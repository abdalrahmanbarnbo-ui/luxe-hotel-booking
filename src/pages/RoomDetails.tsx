import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format, addDays } from 'date-fns';
import { Calendar, Users, CheckCircle2, AlertCircle } from 'lucide-react';
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

// نفس البيانات الثابتة لكي تتطابق مع صفحة الغرف
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

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [checkOut, setCheckOut] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [guests, setGuests] = useState<number>(1);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean } | null>(null);

  useEffect(() => {
    // البحث عن الغرفة المطلوبة من البيانات الثابتة بدلاً من الخادم
    const foundRoom = mockRooms.find(r => r.id === Number(id));
    if (foundRoom) {
      setRoom(foundRoom);
    }
  }, [id]);

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setAvailability(null);

    // محاكاة عملية التحقق من الخادم (تأخير زمني بسيط لتبدو واقعية)
    setTimeout(() => {
      setAvailability({ available: true }); // نجعلها دائماً متاحة لغرض العرض التجريبي
      setIsChecking(false);
    }, 1000);
  };

  const handleBookNow = () => {
    if (availability?.available) {
      navigate('/checkout', {
        state: {
          roomId: id,
          checkIn,
          checkOut,
          guests,
          room
        }
      });
    }
  };

  if (!room) return <div className="min-h-screen flex items-center justify-center">Loading Room Details...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-stone-50 min-h-screen pt-24 pb-12"
    >
      <SEO 
        title={`${room.name} | Luxe Hotel`}
        description={room.description}
        image={room.image_url}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Room Info */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 shadow-sm">
              <img 
                src={room.image_url} 
                alt={room.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <h1 className="text-4xl font-serif text-stone-900 mb-4">{room.name}</h1>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              {room.description}
            </p>
            
            <div className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-6">Room Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-stone-600">
                    <CheckCircle2 className="w-5 h-5 text-stone-400" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 sticky top-28">
              <div className="flex justify-between items-end mb-8 border-b border-stone-100 pb-6">
                <div>
                  <p className="text-3xl font-medium text-stone-900">${room.price_per_night}</p>
                  <p className="text-sm text-stone-500 uppercase tracking-wider">Per Night</p>
                </div>
                <div className="flex items-center space-x-1 text-stone-600">
                  <Users className="w-5 h-5" />
                  <span>Up to {room.capacity}</span>
                </div>
              </div>

              <form onSubmit={handleCheckAvailability} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd')}
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Guests</label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500"
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isChecking}
                  className="w-full bg-stone-100 text-stone-900 font-medium py-4 rounded-xl hover:bg-stone-200 transition-colors disabled:opacity-50"
                >
                  {isChecking ? 'Checking...' : 'Check Availability'}
                </button>
              </form>

              {availability && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl border"
                >
                  {availability.available ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-emerald-600 mb-4">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Room is available!</span>
                      </div>
                      <button 
                        onClick={handleBookNow}
                        className="w-full bg-stone-900 text-white font-medium py-4 rounded-xl hover:bg-stone-800 transition-colors"
                      >
                        Proceed to Booking
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Not available for selected dates.</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}