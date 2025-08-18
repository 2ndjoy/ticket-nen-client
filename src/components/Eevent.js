import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Filter, Star, Users, Ticket, X, ChevronDown } from 'lucide-react';

const Eevent = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Bangladesh locations
  const locations = [
    'All Locations',
    'Barishal',
    'Chattogram', 
    'Cumilla',
    'Dhaka North',
    'Dhaka South',
    'Gazipur',
    'Narayanganj',
    'Khulna',
    'Mymensingh',
    'Rajshahi',
    'Rangpur',
    'Sylhet'
  ];

  // Mock events data with locations
  const mockEvents = [
    {
      id: 1,
      title: "Rise Above All 2025",
      subtitle: "KIB Complex, Khamar Bari Rd",
      date: "31 Oct, 2025",
      time: "10:00 AM",
      price: "৳1100",
      category: "Conferences",
      location: "Dhaka North",
      status: "live",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      attendees: 850,
      rating: 4.8
    },
    {
      id: 2,
      title: "National IQ Olympiad Season - 1",
      subtitle: "Education Board Complex",
      date: "1 Oct, 2025",
      time: "10:00 AM",
      price: "৳150",
      category: "Competitions",
      location: "Dhaka South",
      status: "live",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=250&fit=crop",
      attendees: 1200,
      rating: 4.9
    },
    {
      id: 3,
      title: "ANIME FEST 2025: LIMITED REALM",
      subtitle: "Celebrity Convention Hall",
      date: "6 Sep, 2025",
      time: "12:00 PM",
      price: "৳350",
      category: "Festivals",
      location: "Dhaka North",
      status: "live",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      attendees: 2500,
      rating: 4.7
    },
    {
      id: 4,
      title: "Best Of Asco & MOSB Congress 2025",
      subtitle: "Pan Pacific Sonargaon",
      date: "31 Aug, 2025",
      time: "10:00 AM",
      price: "৳2000",
      category: "Conferences",
      location: "Dhaka South",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=250&fit=crop",
      attendees: 450,
      rating: 4.6
    },
    {
      id: 5,
      title: "Taronno Ucchas",
      subtitle: "Mirpur National School",
      date: "30 Aug, 2025",
      time: "2:00 PM",
      price: "৳300",
      category: "Concerts",
      location: "Dhaka North",
      status: "live",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      attendees: 800,
      rating: 4.5
    },
    {
      id: 6,
      title: "GWEC Green Fest Season 2",
      subtitle: "S.F.X Greenherald International School",
      date: "29 Aug, 2025",
      time: "10:00 AM",
      price: "৳550",
      category: "Competitions",
      location: "Gazipur",
      status: "live",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop",
      attendees: 650,
      rating: 4.4
    },
    {
      id: 7,
      title: "Pohela Boishakh Festival 2025",
      subtitle: "Ramna Park",
      date: "14 Apr, 2025",
      time: "8:00 AM",
      price: "Free",
      category: "Festivals",
      location: "Dhaka South",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop",
      attendees: 5000,
      rating: 4.9
    },
    {
      id: 8,
      title: "Digital Marketing Summit 2025",
      subtitle: "InterContinental",
      date: "25 Nov, 2025",
      time: "9:00 AM",
      price: "৳1500",
      category: "Workshops",
      location: "Dhaka South",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      attendees: 300,
      rating: 4.3
    },
    {
      id: 9,
      title: "Chittagong Port City Music Festival",
      subtitle: "Patenga Sea Beach",
      date: "15 Dec, 2025",
      time: "6:00 PM",
      price: "৳800",
      category: "Concerts",
      location: "Chattogram",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      attendees: 1500,
      rating: 4.6
    },
    {
      id: 10,
      title: "Khulna Tech Conference 2025",
      subtitle: "Khulna University",
      date: "20 Sep, 2025",
      time: "9:00 AM",
      price: "৳1200",
      category: "Conferences",
      location: "Khulna",
      status: "live",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      attendees: 400,
      rating: 4.5
    },
    {
      id: 11,
      title: "Sylhet Tea Festival",
      subtitle: "Sylhet Tea Garden",
      date: "10 Nov, 2025",
      time: "10:00 AM",
      price: "৳450",
      category: "Festivals",
      location: "Sylhet",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop",
      attendees: 800,
      rating: 4.7
    },
    {
      id: 12,
      title: "Rajshahi Science Fair",
      subtitle: "Rajshahi University",
      date: "5 Oct, 2025",
      time: "10:00 AM",
      price: "৳200",
      category: "Competitions",
      location: "Rajshahi",
      status: "live",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=250&fit=crop",
      attendees: 600,
      rating: 4.4
    },
    {
      id: 13,
      title: "Dhaka Premier League Cricket",
      subtitle: "Sher-e-Bangla National Cricket Stadium",
      date: "25 Sep, 2025",
      time: "2:00 PM",
      price: "৳300",
      category: "Sports",
      location: "Dhaka South",
      status: "live",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=250&fit=crop",
      attendees: 30000,
      rating: 4.8
    },
    {
      id: 14,
      title: "Shakespeare's Hamlet",
      subtitle: "National Theatre Hall",
      date: "12 Nov, 2025",
      time: "7:00 PM",
      price: "৳650",
      category: "Theater",
      location: "Dhaka South",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=250&fit=crop",
      attendees: 500,
      rating: 4.9
    },
    {
      id: 15,
      title: "Chittagong Football Championship",
      subtitle: "M.A. Aziz Stadium",
      date: "18 Oct, 2025",
      time: "4:00 PM",
      price: "৳150",
      category: "Sports",
      location: "Chattogram",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
      attendees: 15000,
      rating: 4.5
    },
    {
      id: 16,
      title: "Nonadito Theater Play",
      subtitle: "Shilpakala Academy",
      date: "8 Dec, 2025",
      time: "6:30 PM",
      price: "৳400",
      category: "Theater",
      location: "Dhaka North",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=250&fit=crop",
      attendees: 300,
      rating: 4.6
    },
    {
      id: 17,
      title: "Khulna Marathon 2025",
      subtitle: "Khulna City Circuit",
      date: "15 Jan, 2026",
      time: "6:00 AM",
      price: "৳500",
      category: "Sports",
      location: "Khulna",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      attendees: 2000,
      rating: 4.7
    }
  ];

  const categories = ['All', 'Conferences', 'Competitions', 'Festivals', 'Concerts', 'Workshops', 'Sports', 'Theater'];

  useEffect(() => {
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by category
    if (activeFilter !== 'All') {
      filtered = filtered.filter(event => event.category === activeFilter);
    }

    // Filter by location
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(event => event.location === selectedLocation);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [activeFilter, searchTerm, selectedLocation, events]);

  const handleCategoryFilter = (category) => {
    setActiveFilter(category);
  };

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
            <button
              onClick={() => setShowFilterModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter */}
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

          {/* Location Filter */}
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

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={clearAllFilters}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex-1 px-4 py-2 bg-[#128f8b] text-white rounded-lg hover:bg-emerald-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#128f8b] to-[#128f8b] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Explore Events</h1>
          <p className="text-3xl  text-emerald-100">Explore the Universe of Events at Your Fingertips.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    activeFilter === category
                      ? 'bg-[#128f8b] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* Location Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{selectedLocation}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showLocationDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 max-h-64 overflow-y-auto">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => handleLocationSelect(location)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          selectedLocation === location ? 'bg-[#128f8b] text-white' : 'text-gray-700'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Filter Icon */}
              <button 
                onClick={() => setShowFilterModal(true)}
                className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(activeFilter !== 'All' || selectedLocation !== 'All Locations' || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {activeFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#128f8b] text-white text-sm rounded-full">
                  {activeFilter}
                  <button onClick={() => setActiveFilter('All')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedLocation !== 'All Locations' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#128f8b] text-white text-sm rounded-full">
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation('All Locations')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#128f8b] text-white text-sm rounded-full">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {/* Status Badge */}
                {event.status === 'live' && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {event.category}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.subtitle}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{event.attendees}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-gray-600">{event.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="text-[#128f8b] font-bold text-lg">
                    {event.price === "Free" ? "Free" : `Starts from ${event.price}`}
                  </div>
                  <button className="bg-[#128f8b] hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria to find more events.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2 bg-[#128f8b] text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-[#128f8b] text-black hover:bg-[#128f8b] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Load More Events
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && <FilterModal />}
    </div>
  );
};

export default Eevent;