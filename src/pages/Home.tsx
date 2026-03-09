import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Wifi,
  Coffee,
  Wind,
  Car,
  Waves,
  Utensils,
  ArrowRight,
} from "lucide-react";
import SEO from "../components/SEO";

interface Room {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  image_url: string;
  amenities: string[];
}

export default function Home() {
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setFeaturedRooms(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-stone-50"
    >
      <SEO
        title="Luxe Hotel | Premium Stays & Luxury Accommodations"
        description="Experience unparalleled luxury at Luxe Hotel. Book your stay today for premium rooms, world-class amenities, and unforgettable experiences."
      />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Hotel Exterior"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-6"
          >
            A Sanctuary of <br className="hidden md:block" />
            <span className="italic">Refined Elegance</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl font-light tracking-wide mb-10 max-w-2xl mx-auto text-stone-200"
          >
            Discover the perfect blend of modern luxury and timeless comfort in
            the heart of the city.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/rooms"
              className="inline-flex items-center space-x-2 bg-white text-stone-900 px-8 py-4 rounded-full hover:bg-stone-100 transition-colors font-medium tracking-wide"
            >
              <span>Explore Our Rooms</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">
            Featured Accommodations
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Carefully curated spaces designed to provide the ultimate comfort
            and relaxation during your stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/rooms/${room.id}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
                  <img
                    src={room.image_url}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif text-stone-900 mb-2">
                      {room.name}
                    </h3>
                    <p className="text-stone-500 text-sm line-clamp-2">
                      {room.description}
                    </p>
                  </div>
                  <div className="text-right pl-4">
                    <p className="text-lg font-medium text-stone-900">
                      ${room.price_per_night}
                    </p>
                    <p className="text-xs text-stone-500 uppercase tracking-wider">
                      Per Night
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/rooms"
            className="inline-block border border-stone-300 text-stone-900 px-8 py-3 rounded-full hover:bg-stone-900 hover:text-white transition-colors"
          >
            View All Rooms
          </Link>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">
              World-Class Amenities
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Everything you need for a perfect stay, thoughtfully provided.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { icon: Wifi, label: "High-Speed WiFi" },
              { icon: Coffee, label: "Premium Coffee" },
              { icon: Wind, label: "Air Conditioning" },
              { icon: Car, label: "Valet Parking" },
              { icon: Waves, label: "Infinity Pool" },
              { icon: Utensils, label: "Fine Dining" },
            ].map((amenity, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm"
              >
                <amenity.icon
                  className="w-8 h-8 text-stone-800 mb-4"
                  strokeWidth={1.5}
                />
                <span className="text-sm font-medium text-stone-900">
                  {amenity.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Inquiry */}
      <section
        id="contact"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-16 lg:p-20 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-stone-400 mb-10">
                Have questions about your stay? Our concierge team is available
                24/7 to assist you with any inquiries.
              </p>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-stone-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-stone-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-stone-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-stone-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-stone-500"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-stone-900 font-medium py-3 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="hidden lg:block relative">
              <img
                src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=1200"
                alt="Concierge"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
