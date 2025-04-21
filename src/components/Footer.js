import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import myLogo from '../images/AppLogo.png';

const Footer = () => {
  return (
    <footer className="bg-[#faf6ed] border-t-4 border-black py-8">
      <div className="container mx-auto px-6 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Logo and Brand Info */}
          <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
            <Link to="/">
              <img src={myLogo} alt="Ticket Nen BD" className="h-[50px] mb-4" />
            </Link>
            <p className="text-gray-700 text-sm font-light">Your one-stop ticketing solution</p>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#128f8b]">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#128f8b]">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#128f8b]">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#128f8b]">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info & Copyright */}
        <div className="mt-8 border-t border-gray-300 pt-6 text-sm text-gray-700">
          <div className="flex flex-col items-center lg:flex-row justify-between">
            <p className="mb-4 lg:mb-0">
              Contact us: <a href="mailto:support@ticketnenbd.com" className="text-[#128f8b]">support@ticketnenbd.com</a> | Phone: +123 456 7890
            </p>
            <p>&copy; 2025 Ticket Nen BD. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
