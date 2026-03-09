import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Hotel, Menu, X } from 'lucide-react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // دالة للصعود إلى أعلى الصفحة بسلاسة
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* تمت إضافة scrollToTop عند الضغط على الشعار */}
            <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-stone-800" />
              <span className="font-serif text-2xl tracking-tight font-medium text-stone-900">Luxe</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              {/* تمت إضافة scrollToTop عند الضغط على Home */}
              <Link to="/" onClick={scrollToTop} className="text-stone-600 hover:text-stone-900 transition-colors">Home</Link>
              <Link to="/rooms" className="text-stone-600 hover:text-stone-900 transition-colors">Rooms & Suites</Link>
              <a href="/#amenities" className="text-stone-600 hover:text-stone-900 transition-colors">Amenities</a>
              <a href="/#contact" className="text-stone-600 hover:text-stone-900 transition-colors">Contact</a>
            </nav>

            <div className="hidden md:flex">
              <Link to="/rooms" className="bg-stone-900 text-white px-6 py-2.5 rounded-full hover:bg-stone-800 transition-colors font-medium text-sm tracking-wide">
                Book Now
              </Link>
            </div>

            <button 
              className="md:hidden p-2 text-stone-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {/* تمت إضافة الصعود للأعلى وإغلاق القائمة عند الضغط على Home في الجوال */}
              <Link 
                to="/" 
                className="block px-3 py-2 text-stone-600 hover:bg-stone-50 rounded-md" 
                onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
              >
                Home
              </Link>
              <Link to="/rooms" className="block px-3 py-2 text-stone-600 hover:bg-stone-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Rooms & Suites</Link>
              <a href="/#amenities" className="block px-3 py-2 text-stone-600 hover:bg-stone-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Amenities</a>
              <a href="/#contact" className="block px-3 py-2 text-stone-600 hover:bg-stone-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Contact</a>
              <Link to="/rooms" className="block px-3 py-2 mt-4 text-center bg-stone-900 text-white rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>
                Book Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              {/* تمت إضافة scrollToTop هنا أيضاً */}
              <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2 mb-4">
                <Hotel className="h-8 w-8 text-white" />
                <span className="font-serif text-2xl tracking-tight text-white">Luxe</span>
              </Link>
              <p className="max-w-md text-stone-400">
                Experience unparalleled luxury and comfort in the heart of Paradise City. 
                Your perfect getaway awaits.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/rooms" className="hover:text-white transition-colors">Our Rooms</Link></li>
                <li><a href="/#amenities" className="hover:text-white transition-colors">Amenities</a></li>
                <li><a href="/#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="/#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4 uppercase tracking-wider text-sm">Contact</h3>
              <ul className="space-y-2">
                <li>123 Luxury Ave</li>
                <li>Paradise City, PC 12345</li>
                <li>+1 (555) 0198</li>
                <li>reservations@luxehotel.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Luxe Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}