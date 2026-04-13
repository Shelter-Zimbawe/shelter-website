"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  products: [
    "RockView Park Stands",
    "Adelaide Park Stands",
    "Mabvuku Chizhanje",
    "Lendy Park Marondera Stands",
  ],
  services: [
  ],
  company: [
  ],
  support: [
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-gray-300 relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="mb-4 text-2xl font-bold sm:text-3xl" style={{ color: '#2652a2' }}>
                Shelter Zimbabwe
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(38, 82, 162, 0.2)' }}>
                    <Mail className="w-5 h-5" style={{ color: '#2652a2' }} />
                  </div>
                  <span className="break-all text-gray-300 sm:break-normal">sales@shelter.co.zw</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(38, 82, 162, 0.2)' }}>
                    <Phone className="w-5 h-5" style={{ color: '#2652a2' }} />
                  </div>
                  <span className="text-gray-300">+263 242 774 455 / 748 121</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(38, 82, 162, 0.2)' }}>
                    <MapPin className="w-5 h-5" style={{ color: '#2652a2' }} />
                  </div>
                  <span className="text-gray-300">Shelter House 95 Five Avenue, Harare</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h4 className="text-white font-bold mb-4 capitalize text-lg">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 transition-colors duration-200" onMouseEnter={(e) => e.currentTarget.style.color = '#2652a2'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row md:items-center"
        >
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Shelter Zimbabwe. All rights reserved.
          </p>
          <div className="mt-2 flex gap-4 md:mt-0">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ backgroundColor: '#1f2937' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2652a2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
