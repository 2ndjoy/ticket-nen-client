import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function SuggestedVideos() {
  const scrollRef = useRef(null);

  const videos = [
    {
      title: "Top Concert Moments",
      thumbnail: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    },
    {
      title: "Epic Sports Highlights",
      thumbnail: "https://img.youtube.com/vi/kXYiU_JCYtU/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
    },
    {
      title: "Behind the Theater Scenes",
      thumbnail: "https://img.youtube.com/vi/tgbNymZ7vqY/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=tgbNymZ7vqY",
    },
    {
      title: "Live Theater Show",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    },
    {
      title: "Live Theater Show",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    },
    {
      title: "Live Theater Show",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    },
    {
      title: "Live Theater Show",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    },
    {
      title: "Live Theater Show",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    },
    {
      title: "Live Theater Show",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
      link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    }
    // Add more if needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 1, behavior: "smooth" });
      }
    }, 20); // controls scroll speed (smaller = faster)

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <section className="relative px-6 md:px-20 py-10">
       <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth"

      >
        <div className="flex space-x-6">
          {videos.map((video, idx) => (
            <motion.a
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="inline-block min-w-[280px] md:min-w-[320px] bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{video.title}</h4>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
