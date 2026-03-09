import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import SEO from '../components/SEO';

interface Room {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  image_url: string;
  amenities: string[];
}

// بيانات ثابتة جاهزة للعرض الفوري بدون الحاجة لخادم
const mockRooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Ocean View",
    description: "Experience breathtaking ocean views from your private balcony. This spacious room features a king-size bed, luxurious linens, and a marble bathroom.",
    price_per_night: 350,
    capacity: 2,
    image_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
    amenities: ["Ocean View", "King Bed", "Balcony", "Free WiFi", "Room Service"]
  },
  {
    id: 2,
    name: "Executive Suite",
    description: "A perfect blend of luxury and comfort. The Executive Suite offers a separate living area, premium amenities, and exclusive access to the executive lounge.",
    price_per_night: 550,
    capacity: 3,
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
    amenities: ["City View", "Lounge Access", "Mini Bar", "Espresso Machine"]
  },
  {
    id: 3,
    name: "Presidential Penthouse",
    description: "The pinnacle of luxury. Our penthouse suite features panoramic views, a private terrace with a plunge pool, and a dedicated butler service.",
    price_per_night: 1200,
    capacity: 4,
    image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
    amenities: ["Private Pool", "Butler Service", "Terrace", "Kitchen", "Spa Bath"]
  }
];

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    // بدلاً من الاتصال بالخادم، نقوم بتحميل البيانات الثابتة مباشرة
    setRooms(mockRooms);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-stone-50 min-h-screen pt-24 pb-12"
    >
      <SEO 
        title="Our Rooms & Suites | Luxe Hotel"
        description="Browse our selection of luxury rooms and suites. Find the perfect accommodation for your stay at Luxe Hotel."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Rooms & Suites</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of rooms, each designed to provide an unforgettable experience of comfort and luxury.
          </p>
        </div>

        <div className="space-y-16">
          {rooms.map((room, index) => (
            <motion.div 
              key={room.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto">
                <img 
                  src={room.image_url} 
                  alt={room.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-serif text-stone-900">{room.name}</h2>
                  <div className="text-right">
                    <p className="text-2xl font-medium text-stone-900">${room.price_per_night}</p>
                    <p className="text-xs text-stone-500 uppercase tracking-wider">Per Night</p>
                  </div>
                </div>
                
                <p className="text-stone-600 mb-8 leading-relaxed">
                  {room.description}
                </p>
                
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-stone-900 uppercase tracking-wider mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, i) => (
                      <span key={i} className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Link 
                    to={`/rooms/${room.id}`} 
                    className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full hover:bg-stone-800 transition-colors font-medium tracking-wide w-full text-center md:w-auto"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}