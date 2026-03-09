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
    fetch(`/api/rooms/${id}`)
      .then(res => res.json())
      .then(data => setRoom(data))
      .catch(console.error);
  }, [id]);

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setAvailability(null);

    try {
      const res = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: id, checkIn, checkOut })
      });
      const data = await res.json();
      setAvailability(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChecking(false);
    }
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

  if (!room) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

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
