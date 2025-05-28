import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import myLogo from '../images/AppLogo2.png';
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Mobile menu variants (slide down + fade)
  const menuVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Nav link hover animation props
  const navLinkHover = {
    scale: 1.1,
    textShadow: "0 0 8px rgba(0,0,0,0.2)",
    transition: { duration: 0.2 },
  };

  // Button hover animation props
  const buttonHover = {
    scale: 1.05,// slightly darker shade of #128f8b
    transition: { duration: 0.2 },
  };

  return (
    <nav className="bg-[#faf6ed] px-6 py-2 border-b-4 border-black relative">
      <div className="flex items-center justify-between">
        {/* Logo with entrance animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-6 border-l-4 border-black pl-4"
        >
          <Link to="/">
            <img src={myLogo} alt="Ticket Nen BD" className="h-[70px]" />
          </Link>
        </motion.div>

        {/* Desktop nav links with hover animations */}
        <ul className="hidden lg:flex space-x-6 text-md font-light font-serif ml-10">
          {["Home", "Blog", "Contact", "About Us"].map((text, i) => (
            <motion.li key={text} whileHover={navLinkHover} className="cursor-pointer">
              <Link to={`/${text.toLowerCase().replace(/\s/g, '')}`}>{text}</Link>
            </motion.li>
          ))}
        </ul>

        {/* Right side: Log In + menu button */}
        <div className="flex items-center space-x-4">
          <motion.div
            className="hidden lg:block border-2 border-black px-4 py-2 -skew-x-12"
            whileHover={buttonHover}
          >
            <Link to="/login">
              <button className="bg-[#128f8b] text-white font-semibold px-4 py-1 skew-x-12">
                Log In
              </button>
            </Link>
          </motion.div>

          {/* Animated menu toggle button */}
          <motion.button 
            onClick={toggleMenu} 
            className="lg:hidden"
            whileTap={{ scale: 0.85 }}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Animated Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden mt-4 border-t border-black pt-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
          >
            <ul className="flex flex-col gap-4 text-md font-serif">
              {["Home", "Blog", "Contact", "About Us"].map((text) => (
                <motion.li
                  key={text}
                  whileHover={{ scale: 1.05, color: "#117a76" }}
                  onClick={toggleMenu}
                >
                  <Link to={`/${text.toLowerCase().replace(/\s/g, '')}`}>{text}</Link>
                </motion.li>
              ))}
              <motion.li whileHover={buttonHover}>
                <Link to="/login" onClick={toggleMenu}>
                  <button className="bg-[#128f8b] text-white font-semibold px-4 py-2 w-full mt-2">
                    Log In
                  </button>
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
