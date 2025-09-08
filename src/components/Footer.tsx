import React from "react";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  // const palette = {
  //   bg: "#F9F7F7",
  //   secondary: "#DBE2EF",
  //   primary: "#3F72AF",
  //   dark: "#DBE2EF",
  //   text: "#F9F7F7",
  // };

  return (
    <footer
      className="text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #112D4E 0%, #3F72AF 50%, #1E40AF 100%)",
      }}
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main content grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              NaArNi
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed opacity-90">
            Empowering cleaner heavy transport with smart EV solutions. Leading the transition to sustainable mobility.
            </p>
            
            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm opacity-80">
                <Mail size={16} className="text-blue-200" />
                <span>website@naarni.com</span>
              </div>
              {/* <div className="flex items-center space-x-3 text-sm opacity-80">
                <Phone size={16} className="text-blue-200" />
                <span>+91 98765 43210</span>
              </div> */}
              <a
  href="https://maps.app.goo.gl/2Jr9k2YNAqFHbjzVA"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center space-x-3 text-sm opacity-80 hover:opacity-100"
>
  <MapPin size={16} className="text-blue-200" />
  <span>Bangalore, India</span>
</a>
            </div>
          </div>

          {/* Explore section */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-blue-200">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-[15px] opacity-80 hover:opacity-100 hover:text-blue-200 transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-[15px] opacity-80 hover:opacity-100 hover:text-blue-200 transition-all duration-300 inline-block hover:translate-x-1"
                >
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link 
                  to="/products" 
                  className="text-[15px] opacity-80 hover:opacity-100 hover:text-blue-200 transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Products
                </Link>
              </li> */}
              <li>
                <Link 
                  to="/contact" 
                  className="text-[15px] opacity-80 hover:opacity-100 hover:text-blue-200 transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources section */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-blue-200">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/careers" 
                  className="text-[15px] opacity-80 hover:opacity-100 hover:text-blue-200 transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Careers
                </Link>
              </li>
              {/* <li>
                <Link 
                  to="/track-record" 
                  className="text-[15px] opacity-80 hover:opacity-100 hover:text-blue-200 transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Track Record
                </Link>
              </li> */}
              {/* <li>
                <Link 
                  to="/contact" 
                  className="text-[15px] opacity-80 hover:opacity-100 hover:text-blue-200 transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Support
                </Link>
              </li> */}
              {/* <li>
                <a 
                  href="#" 
                  className="text-[15px] opacity-80 hover:opacity-100 hover:text-blue-200 transition-all duration-300 inline-block hover:translate-x-1"
                >
                  Documentation
                </a>
              </li> */}
            </ul>
          </div>

          {/* Social icons */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-blue-200">
              Connect With Us
            </h3>
            <div className="flex space-x-3">
              <a 
                href="https://www.linkedin.com/company/naarni" 
                aria-label="LinkedIn"
                className="group relative"
              >
                <div className="p-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                  <Linkedin size={16} className="text-white group-hover:text-blue-200 transition-colors duration-300" />
                </div>
              </a>
              {/* <a 
                href="#" 
                aria-label="Twitter"
                className="group relative"
              >
                <div className="p-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                  <Twitter size={16} className="text-white group-hover:text-blue-200 transition-colors duration-300" />
                </div>
              </a> */}
              {/* <a 
                href="#" 
                aria-label="Facebook"
                className="group relative"
              >
                <div className="p-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                  <Facebook size={16} className="text-white group-hover:text-blue-200 transition-colors duration-300" />
                </div>
              </a> */}
            </div>
            
            {/* Newsletter signup */}
            {/* <div className="mt-6">
              <h4 className="text-sm font-medium text-blue-200 mb-3">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-sm text-white placeholder-white/60 focus:outline-none focus:border-blue-300 transition-colors duration-300"
                />
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-r-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-8"></div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] opacity-80">
          <p>
            © {new Date().getFullYear()} NaArNi — All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm mr-16">
            <Link to="/privacy-policy" className="hover:text-blue-200 transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-200 transition-colors duration-300">Terms of Service</Link>
            {/* <Link to="#" className="hover:text-blue-200 transition-colors duration-300">Cookie Policy</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
