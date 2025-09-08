import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const menu = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    // { name: "Products", link: "/products" },
    // { name: "Track Record", link: "/track-record" },
    { name: "Careers", link: "/careers" },
    { name: "Contact", link: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <nav className="fixed z-50 w-full">
      {/* Background overlay for mobile menu */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main navbar */}
      <div className={`transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : 'bg-white/80 backdrop-blur-sm md:bg-white/90 md:backdrop-blur-md'
      } top-0 left-0 right-0 fixed z-50`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="relative group">
            <div className="text-[#1E40AF] font-extrabold text-3xl tracking-wide px-4 py-2 rounded-xl transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-800 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/25">
              NaArNi
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"></div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1 items-center">
            {menu.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className={`relative group font-medium text-base px-4 py-3 rounded-xl transition-all duration-300 mx-5 ${
                  isActive(item.link)
                    ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item.name}
                {!isActive(item.link) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                )}
                <span
                  className={`absolute left-1/2 -bottom-1 h-0.5 bg-blue-600 rounded-full transform transition-all duration-300 ${
                    isActive(item.link)
                      ? "w-4/5 -translate-x-1/2"
                      : "w-0 group-hover:w-4/5 group-hover:-translate-x-1/2"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/contact"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300 z-50 relative"
            >
              {open ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="fixed top-20 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-200/50 rounded-b-2xl overflow-hidden md:hidden">
            <div className="px-6 py-4 space-y-2">
              {menu.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`block px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    isActive(item.link)
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-200/50">
                <Link
                  to="/contact"
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 text-center hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
