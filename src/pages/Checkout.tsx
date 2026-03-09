import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { CreditCard, Lock } from 'lucide-react';
import SEO from '../components/SEO';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface CheckoutState {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  room: any;
}

const CheckoutForm = ({ state, clientSecret, totalPrice }: { state: CheckoutState, clientSecret: string, totalPrice: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement as any,
          billing_details: {
            name: state.room.name,
          },
        },
      });

      if (error) {
        setError(error.message || 'An error occurred.');
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm booking on backend
        await fetch('/api/bookings/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        });
        
        // Redirect to success page or show success message
        alert('Booking successful!');
        navigate('/');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-stone-500" />
          Payment Details
        </h3>
        <div className="p-4 border border-stone-200 rounded-xl bg-stone-50">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-stone-900 text-white font-medium py-4 rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 flex justify-center items-center"
      >
        {processing ? 'Processing...' : `Pay $${totalPrice}`}
        <Lock className="w-4 h-4 ml-2" />
      </button>
    </form>
  );
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;
  
  const [clientSecret, setClientSecret] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!state) {
      navigate('/rooms');
    }
  }, [state, navigate]);

  const handleCreateIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: state.roomId,
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          userName,
          userEmail
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setClientSecret(data.clientSecret);
      setTotalPrice(data.totalPrice);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert('Failed to initialize payment.');
    }
  };

  if (!state) return null;

  const start = new Date(state.checkIn);
  const end = new Date(state.checkOut);
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-stone-50 min-h-screen pt-24 pb-12"
    >
      <SEO 
        title="Checkout | Luxe Hotel"
        description="Complete your booking at Luxe Hotel."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Complete Your Reservation</h1>
          <p className="text-stone-600">You're just a few steps away from your luxury stay.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 sticky top-28">
              <h2 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-100 pb-4">Booking Summary</h2>
              
              <div className="flex items-start space-x-4 mb-6">
                <img src={state.room.image_url} alt={state.room.name} className="w-20 h-20 object-cover rounded-xl" />
                <div>
                  <h3 className="font-medium text-stone-900">{state.room.name}</h3>
                  <p className="text-sm text-stone-500">{state.guests} Guest{state.guests > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-stone-600 mb-6 border-b border-stone-100 pb-6">
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span className="font-medium text-stone-900">{format(start, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span className="font-medium text-stone-900">{format(end, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium text-stone-900">{nights} Night{nights > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>${state.room.price_per_night} x {nights} nights</span>
                  <span>${state.room.price_per_night * nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-stone-100 text-lg font-medium text-stone-900">
                  <span>Total</span>
                  <span>${state.room.price_per_night * nights}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Steps */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {step === 1 ? (
              <form onSubmit={handleCreateIntent} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h2 className="text-2xl font-serif text-stone-900 mb-6">Guest Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-stone-900 text-white font-medium py-4 rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h2 className="text-2xl font-serif text-stone-900 mb-6">Payment</h2>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm state={state} clientSecret={clientSecret} totalPrice={totalPrice} />
                  </Elements>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
