import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
const db = new Database("hotel.db");

// Setup database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_night REAL NOT NULL,
    capacity INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    amenities TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    FOREIGN KEY (room_id) REFERENCES rooms (id)
  );
`);

// Seed initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM rooms").get() as {
  count: number;
};
if (count.count === 0) {
  const insertRoom = db.prepare(`
    INSERT INTO rooms (name, description, price_per_night, capacity, image_url, amenities)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertRoom.run(
    "Ocean View Suite",
    "Experience luxury with breathtaking ocean views. Features a king-size bed, private balcony, and a spa-like bathroom.",
    350,
    2,
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1600",
    JSON.stringify([
      "King Bed",
      "Ocean View",
      "Balcony",
      "Mini Bar",
      "Free WiFi",
      "Room Service",
    ]),
  );

  insertRoom.run(
    "Executive Penthouse",
    "The ultimate in luxury and space. This penthouse offers panoramic city views, a private terrace, and exclusive lounge access.",
    850,
    4,
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1600",
    JSON.stringify([
      "2 King Beds",
      "City View",
      "Private Terrace",
      "Kitchenette",
      "Lounge Access",
      "Butler Service",
    ]),
  );

  insertRoom.run(
    "Deluxe Double Room",
    "Perfect for families or friends traveling together. Comfortable, spacious, and elegantly designed.",
    200,
    4,
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1600",
    JSON.stringify([
      "2 Queen Beds",
      "City View",
      "Work Desk",
      "Free WiFi",
      "Coffee Maker",
    ]),
  );
}

// Stripe setup
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"; // Fallback for dev
    stripeClient = new Stripe(key, { apiVersion: "2025-02-24.acacia" as any });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

  // Get all rooms
  app.get("/api/rooms", (req, res) => {
    try {
      const rooms = db.prepare("SELECT * FROM rooms").all();
      res.json(
        rooms.map((r: any) => ({ ...r, amenities: JSON.parse(r.amenities) })),
      );
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });

  // Get single room
  app.get("/api/rooms/:id", (req, res) => {
    try {
      const room = db
        .prepare("SELECT * FROM rooms WHERE id = ?")
        .get(req.params.id) as any;
      if (!room) return res.status(404).json({ error: "Room not found" });
      res.json({ ...room, amenities: JSON.parse(room.amenities) });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room" });
    }
  });

  // Check availability
  app.post("/api/bookings/check-availability", (req, res) => {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Check if there are any overlapping bookings
      const overlapping = db
        .prepare(
          `
        SELECT COUNT(*) as count FROM bookings 
        WHERE room_id = ? 
        AND status != 'cancelled'
        AND (
          (check_in <= ? AND check_out >= ?) OR
          (check_in <= ? AND check_out >= ?) OR
          (check_in >= ? AND check_out <= ?)
        )
      `,
        )
        .get(
          roomId,
          checkOut,
          checkIn,
          checkIn,
          checkIn,
          checkIn,
          checkOut,
        ) as { count: number };

      res.json({ available: overlapping.count === 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to check availability" });
    }
  });

  // Create Payment Intent
  app.post("/api/create-payment-intent", async (req, res) => {
    const { roomId, checkIn, checkOut, userName, userEmail } = req.body;

    if (!roomId || !checkIn || !checkOut || !userName || !userEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const room = db
        .prepare("SELECT * FROM rooms WHERE id = ?")
        .get(roomId) as any;
      if (!room) return res.status(404).json({ error: "Room not found" });

      // Calculate nights and total price
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (nights <= 0) return res.status(400).json({ error: "Invalid dates" });

      const totalPrice = nights * room.price_per_night;

      // Create Stripe PaymentIntent
      const stripe = getStripe();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // in cents
        currency: "usd",
        metadata: {
          roomId: roomId.toString(),
          checkIn,
          checkOut,
          userName,
          userEmail,
        },
      });

      // Create pending booking
      const insertBooking = db.prepare(`
        INSERT INTO bookings (room_id, user_name, user_email, check_in, check_out, total_price, status, stripe_payment_intent_id)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
      `);

      const result = insertBooking.run(
        roomId,
        userName,
        userEmail,
        checkIn,
        checkOut,
        totalPrice,
        paymentIntent.id,
      );

      res.json({
        clientSecret: paymentIntent.client_secret,
        bookingId: result.lastInsertRowid,
        totalPrice,
      });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to create payment intent" });
    }
  });

  // Confirm booking (webhook or direct call after successful payment)
  app.post("/api/bookings/confirm", (req, res) => {
    const { paymentIntentId } = req.body;

    try {
      db.prepare(
        `
        UPDATE bookings SET status = 'confirmed' WHERE stripe_payment_intent_id = ?
      `,
      ).run(paymentIntentId);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to confirm booking" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
