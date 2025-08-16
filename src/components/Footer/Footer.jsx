import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="w-11/12 mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* School Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Chenchri School</h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            Dedicated to providing quality education and shaping the future of our students with
            discipline, knowledge, and innovation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-gray-200 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/admission" className="hover:text-white transition">
                Admission
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <ul className="space-y-2 text-gray-200 text-sm">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> Kaikhali, Kathalia, Jhalokathi
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> +880 1234-567890
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> info@chenchrischool.edu.bd
            </li>
          </ul>

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-900 text-gray-300 text-center py-3 text-sm">
        © {new Date().getFullYear()} Chenchri School. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
