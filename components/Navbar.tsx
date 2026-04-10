"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Products", href: "#products" },
    { name: "Superstructures", href: "#superstructures" },
    { name: "About", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-shrink-0"
          >
            <a href="#home" className="block whitespace-nowrap text-base font-bold sm:text-xl lg:text-2xl" style={{ color: '#2652a2' }}>
              Shelter Zimbabwe
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden xl:block">
            <div className="ml-8 flex items-baseline space-x-4 2xl:space-x-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isScrolled
                      ? "text-gray-700"
                      : "text-gray-800"
                  }`}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2652a2'}
                  onMouseLeave={(e) => e.currentTarget.style.color = isScrolled ? '#374151' : '#1f2937'}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden sm:block">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md lg:px-6 lg:text-base"
              style={{ background: 'linear-gradient(135deg, #2652a2, #00aeed, #29ddda)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #1f468d, #2652a2, #00aeed)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #2652a2, #00aeed, #29ddda)'}
            >
              Complete Buying Guide
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            className={`rounded-lg p-2 focus:outline-none sm:ml-3 xl:hidden ${
              isScrolled ? "text-gray-700" : "text-gray-800"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden w-full border-t bg-white shadow-xl"
          >
            <div className="mx-auto w-full max-w-7xl space-y-1 px-4 pb-4 pt-2 sm:px-6 lg:px-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-3 text-base font-medium text-gray-700 hover:opacity-80"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(38, 82, 162, 0.1)';
                    e.currentTarget.style.color = '#2652a2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button
                className="mt-4 w-full rounded-lg px-6 py-3 font-semibold text-white transition-all duration-200 sm:hidden"
                style={{ background: 'linear-gradient(135deg, #2652a2, #00aeed, #29ddda)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #1f468d, #2652a2, #00aeed)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #2652a2, #00aeed, #29ddda)'}
              >
                Complete Buying Guide
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
