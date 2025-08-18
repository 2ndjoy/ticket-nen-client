import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const images = [
  'https://i.ibb.co.com/xKQyYhQD/1st.jpg',
  'https://i.ibb.co.com/rKkQrH0P/bb.jpg',
  'https://i.ibb.co.com/0jPZSjm2/4th.jpg',
  'https://i.ibb.co.com/8n1TPxv6/3rd.jpg',
  'https://i.ibb.co.com/gb3fmPgV/5th.jpg',
];

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

const Carousel = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => setPage([page + newDirection, newDirection]);

  // Handle swipe gestures
  const handlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval); // Clean up on unmount
  }, [paginate]); // Fixed by adding 'paginate' as a dependency

  const imageIndex = ((page % images.length) + images.length) % images.length;

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl" {...handlers}>
      <div className="relative h-64 sm:h-96">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={images[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute w-full h-full object-cover rounded-xl shadow-lg"
            alt={`Slide ${imageIndex + 1}`}
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          onClick={() => paginate(-1)}
          className="bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 rounded-full p-2 focus:outline-none"
        >
          ‹
        </button>
        <button
          onClick={() => paginate(1)}
          className="bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 rounded-full p-2 focus:outline-none"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Carousel;
