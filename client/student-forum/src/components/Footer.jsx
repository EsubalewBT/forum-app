import React from 'react';
import { Facebook, Instagram, Youtube, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Social Links */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Menu className="w-6 h-6 text-white mr-2" />
              <span className="text-2xl font-bold">
                <span className="text-white">THINK</span>
                <span className="text-orange-500">THANK</span>
              </span>
            </div>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Link</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how" className="text-gray-400 hover:text-white transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              
              <p>esubalewb55@gmail.com</p>
              <p>+251984782383</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;