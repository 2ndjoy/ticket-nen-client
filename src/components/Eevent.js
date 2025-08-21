import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Filter, Star, Users, X, ChevronDown } from 'lucide-react';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Eevent = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const locations = [
    'All Locations', 'Barishal', 'Chattogram', 'Cumilla', 'Dhaka North', 'Dhaka South',
    'Gazipur', 'Narayanganj', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet'
  ];

  const categories = ['All', 'Conferences', 'Competitions', 'Festivals', 'Concerts', 'Workshops', 'Sports', 'Theater'];

  useEffect(() => {
    const controller = new AbortController();
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/api/events', { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load events: ${res.status}`);
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (activeFilter !== 'All') filtered = filtered.filter(event => event.category === activeFilter);
    if (selectedLocation !== 'All Locations') filtered = filtered.filter(event => event.location === selectedLocation);
    if (searchTerm) {
      filtered = filtered.filter(event =>
        (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [activeFilter, searchTerm, selectedLocation, events]);

  const handleCategoryFilter = (category) => setActiveFilter(category);
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };
  const clearAllFilters = () => {
    setActiveFilter('All');
    setSelectedLocation('All Locations');
    setSearchTerm('');
    setShowFilterModal(false);
  };

  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Filter Events</h3>
            <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={activeFilter === category}
                    onChange={() => handleCategoryFilter(category)}
                    className="w-4 h-4 text-[#128f8b] focus:ring-[#128f8b]"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Location</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {locations.map((location) => (
                <label key={location} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="location"
                    value={location}
                    checked={selectedLocation === location}
                    onChange={() => handleLocationSelect(location)}
                    className="w-4 h-4 text-[#128f8b] focus:ring-[#128f8b]"
                  />
                  <span className="text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={clearAllFilters} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Clear All</button>
            <button onClick={() => setShowFilterModal(false)} className="flex-1 px-4 py-2 bg-[#128f8b] text-white rounded-lg hover:bg-emerald-700">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#128f8b] to-[#128f8b] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Explore Events</h1>
          <p className="text-3xl text-emerald-100">Explore the Universe of Events at Your Fingertips.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button key={category} onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    activeFilter === category ? 'bg-[#128f8b] text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setShowLocationDropdown(!showLocationDropdown)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{selectedLocation}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showLocationDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 max-h-64 overflow-y-auto">
                    {locations.map((location) => (
                      <button key={location} onClick={() => handleLocationSelect(location)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${selectedLocation === location ? 'bg-[#128f8b] text-white' : 'text-gray-700'}`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search Events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <button onClick={() => setShowFilterModal(true)} className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {loading && <div className="text-center py-16"><div className="bg-white rounded-2xl shadow-lg p-8 inline-block">Loading events...</div></div>}
        {error && <div className="text-center py-16"><div className="bg-white rounded-2xl shadow-lg p-8 inline-block text-red-600">{error}</div></div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event._id || event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  {event.status === 'live' && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {event.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.subtitle}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" /><span>{event.date}</span>
                      <Clock className="w-4 h-4 ml-2" /><span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" /><span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-500" /><span className="text-gray-600">{event.attendees}</span></div>
                      <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-current" /><span className="text-gray-600">{event.rating}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[#128f8b] font-bold text-lg">{event.price === "Free" ? "Free" : `Starts from ${event.price}`}</div>
                  <button 
  className="bg-[#128f8b] text-white font-semibold text-sm p-3 rounded" 
  onClick={() => navigate(`/events/${event._id || event.id}`)}
>
  See Details
</button></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFilterModal && <FilterModal />}
    </div>
  );
};

export default Eevent;
