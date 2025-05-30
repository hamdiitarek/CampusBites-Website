
import { GraduationCap, Store, Shield, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-3 text-xl font-bold text-white">StudyConnect</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting students, vendors, and administrators to create the future of education.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-400" />
              For Students
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Study Resources</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Peer Network</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Schedule Manager</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Progress Tracking</a></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Store className="w-5 h-5 mr-2 text-green-400" />
              For Vendors
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Seller Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Product Catalog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sales Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Payment Solutions</a></li>
            </ul>
          </div>

          {/* For Admins */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-400" />
              For Admins
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">User Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">System Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Controls</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support Tools</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2024 StudyConnect. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
