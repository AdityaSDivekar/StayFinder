import { useState, useEffect, useRef, useCallback } from 'react';
import useListings from '../hooks/useLisitings';
import PropertyCard from '../components/PropertyCard';
import ErrorMessage from '../components/ErrorMessage';
import { FaMapMarkerAlt, FaSearch, FaArrowUp } from 'react-icons/fa';
import bgImage from '../assets/homepage_background_image.jpg';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { listings, loading, error, setLocation, setPage, hasMore } = useListings();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setLocation(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, setLocation]);

  // Infinite Scroll
  const observer = useRef();
  const lastListingRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPage]
  );

  // Handle scroll direction for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollTop(currentScrollY > 200 && currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
      <div className="max-w-7xl mx-auto py-8">

        {/* 🔍 Hero Section with Search */}
        <section
          className="relative mb-12 rounded-xl shadow-lg overflow-hidden min-h-[400px] flex items-center justify-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          <div className="relative z-10 text-center text-white p-6 sm:p-10 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
              Discover Your <span className="text-indigo-300">Dream Stay</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Explore unique properties and find the perfect place for your next adventure.
            </p>

            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by location (e.g., New York, Paris)..."
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-white focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition duration-300 ease-in-out text-gray-900 placeholder-gray-500 bg-white/20 focus:bg-white shadow-sm backdrop-blur-sm"
              />
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
            </div>
          </div>
        </section>

        {error && <ErrorMessage message={error} />}

        {/* 🏠 Listings */}
        {listings.length > 0 ? (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {listings.map((listing, index) => {
                if (index === listings.length - 1) {
                  return (
                    <div key={listing._id} ref={lastListingRef}>
                      <PropertyCard listing={listing} />
                    </div>
                  );
                }
                return <PropertyCard key={listing._id} listing={listing} />;
              })}
            </div>
            {loading && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
              </div>
            )}
          </section>
        ) : !loading ? (
          <div className="text-center py-16">
            <FaSearch className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-700 mb-2">No properties found!</h2>
            <p className="text-lg text-gray-500">Try adjusting your search or explore other locations.</p>
          </div>
        ) : (
          <div className="text-center py-16 text-indigo-500">Loading...</div>
        )}
      </div>

      {/* 🔝 Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white p-3 rounded-full opacity-50 hover:opacity-100 transition-all duration-300 shadow-lg z-50"
          title="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default Home;
