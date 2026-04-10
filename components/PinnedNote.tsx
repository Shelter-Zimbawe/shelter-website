"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function PinnedNote() {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setShowBanner(scrollY < 100);
    };

    // Use both scroll and wheel events for better detection
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleScroll, { passive: true });
    
    // Check immediately and after a brief delay
    handleScroll();
    const timeoutId = setTimeout(handleScroll, 50);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className="fixed top-20 right-4 md:right-8 z-40 pointer-events-none"
          initial={{ opacity: 0, y: -30 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -30,
            scale: 0.9,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Picture Frame - About to fall */}
          <motion.div
            className="relative"
            style={{
              transform: "perspective(1000px)",
              transformOrigin: "top center",
            }}
            animate={{
              rotate: [-2, -4, 0, -2],
              rotateX: [0, 2, -1, 0],
              y: [0, 5, -2, 0],
              x: [0, 3, -1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Frame Shadow on wall - Blue tinted */}
            <div className="absolute top-2 left-2 w-full h-full rounded blur-sm" style={{ backgroundColor: 'rgba(38, 82, 162, 0.15)' }}></div>
            
            {/* Picture Frame - Simple blue frame */}
            <div
              className="relative p-2 rounded shadow-lg border-2 min-w-[200px] md:min-w-[240px]"
              style={{
                backgroundColor: '#2652a2',
                borderColor: '#2652a2',
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {/* Frame inner border */}
              <div className="absolute inset-1 border-2 rounded" style={{ borderColor: 'rgba(38, 82, 162, 0.6)' }}></div>
              
              {/* Picture/Mat - Light blue tinted */}
              <div
                className="p-4 rounded-sm relative overflow-hidden"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(41, 221, 218, 0.1), rgba(41, 221, 218, 0.15), rgba(41, 221, 218, 0.1))',
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.08)",
                }}
              >
                {/* Picture content */}
                <div className="text-center py-2">
                  <div className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">
                    Flexible
                  </div>
                  <div className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                    Payments
                  </div>
                  
                  {/* Decorative line - Blue accent */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-0.5" style={{ backgroundColor: '#29ddda' }}></div>
                    <div className="w-12 h-1 rounded" style={{ backgroundColor: '#29ddda' }}></div>
                    <div className="w-8 h-0.5" style={{ backgroundColor: '#29ddda' }}></div>
                  </div>
                </div>

                {/* Picture texture */}
                <div 
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      rgba(0,0,0,1) 10px,
                      rgba(0,0,0,1) 11px
                    )`,
                  }}
                ></div>
              </div>

              {/* Frame corners decoration - Light blue accent */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 rounded-tl" style={{ borderColor: '#2652a2' }}></div>
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 rounded-tr" style={{ borderColor: '#2652a2' }}></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 rounded-bl" style={{ borderColor: '#2652a2' }}></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 rounded-br" style={{ borderColor: '#2652a2' }}></div>
            </div>

            {/* Hanging wire/cord - loose and about to slip - Blue tinted */}
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
              animate={{
                rotate: [0, 3, -3, 0],
                y: [0, 2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                <path
                  d="M 5 15 Q 15 5, 30 8 Q 45 11, 55 15"
                  stroke="#29ddda"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Nail/hook - barely holding - Blue tinted */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20">
                <div className="w-3 h-3 rounded-full border-2 shadow-lg" style={{ backgroundColor: '#2652a2', borderColor: '#2652a2' }}>
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#29ddda' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Shadow on wall - shows it's lifting off - Blue tinted shadow */}
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-6 rounded-full blur-xl" style={{ backgroundColor: 'rgba(38, 82, 162, 0.3)' }}
            animate={{
              scale: [1, 1.3, 0.9, 1],
              opacity: [0.25, 0.35, 0.2, 0.25],
              x: [0, 4, -2, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
