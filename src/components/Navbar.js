import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import myLogo from '../images/AppLogo.png';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#faf6ed] px-6 py-4 border-b-4 border-black relative">

      <div className="flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-6 border-l-4 border-black pl-4">
          <Link to="/"><img src={myLogo} alt="Ticket Nen BD" className="h-[80px]" /></Link>
        </div>

        {/* Center: Nav Links (desktop) */}
        <ul className="hidden lg:flex space-x-6 text-md font-light font-serif ml-10">
          <li className="border-b-2 border-black pb-1 font-semibold">
            <Link to="/">Home</Link>
          </li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>

        {/* Right: Log In + Menu */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:block border-2 border-black px-4 py-2 -skew-x-12">
          
            <Link to="/login">
            <button className="bg-[#128f8b] text-white font-semibold px-4 py-1 skew-x-12">
              Log In
            </button>
        </Link>

          </div>
          <button onClick={toggleMenu} className="lg:hidden">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 border-t border-black pt-4">
          <ul className="flex flex-col gap-4 text-md font-serif">
            <li>
              <Link to="/" onClick={toggleMenu}>Home</Link>
            </li>
            <li>
              <Link to="/blog" onClick={toggleMenu}>Blog</Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>About Us</Link>
            </li>
            <li>
              <Link to="/login">
              <button className="bg-[#128f8b] text-white font-semibold px-4 py-2 w-full mt-2">
              Log In
            </button>
        </Link>

            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
