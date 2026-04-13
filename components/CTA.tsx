"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-12 sm:py-14" style={{ background: 'linear-gradient(135deg, #2652a2, #00aeed, #29ddda)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:40px_40px] animate-[slide_30s_linear_infinite]"></div>
      </div>
      
      {/* Floating orbs */}
      <motion.div
        className="absolute left-4 top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:left-20 sm:top-20 sm:h-64 sm:w-64"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-16 right-4 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:bottom-20 sm:right-20 sm:h-64 sm:w-64"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Ready to Showcase Your Properties?
          </h2>
          <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed sm:text-lg md:mb-12 md:text-xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Let's create a welcoming, professional stand for your housing exhibition that helps you connect with potential buyers and showcase your properties beautifully.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl sm:px-10 sm:text-lg" style={{ color: '#2652a2' }}
            >
              Request Free Quote
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg border-2 border-white bg-white/10 px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white/20 sm:px-10 sm:text-lg"
            >
              View Portfolio
            </motion.button>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-start gap-5 text-white/90 sm:flex-row sm:items-center sm:justify-center sm:gap-6"
          >
            <div className="flex w-full max-w-sm items-center gap-3 sm:w-auto">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Call Us</div>
                <div className="font-bold">+263 242 774 455 / 748 121</div>
              </div>
            </div>
            <div className="flex w-full max-w-sm items-center gap-3 sm:w-auto">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Email Us</div>
                <div className="font-bold">sales@shelter.co.zw</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
