import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const images = [
  'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8NHx8bXVzaWMlMjBldmVudHx8MHx8fHwxNjI1ODI5NDE4&ixlib=rb-1.2.1&q=80&w=1080',
  'https://www.hindustantimes.com/ht-img/img/2023/03/18/1600x900/ban_vs_ire_1679159985923_1679159991742_1679159991742.jpg',
  'https://th.bing.com/th/id/R.3c9d3afb3ce975ba50d4b25fa348ec7d?rik=d9OERmVnPNg1pA&pid=ImgRaw&r=0',
  'https://i.ytimg.com/vi/1t2VTlKUCx4/maxresdefault.jpg',
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
  }, [page]);

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
