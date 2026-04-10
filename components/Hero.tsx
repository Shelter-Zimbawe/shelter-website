"use client";

import { ArrowRight, Home, Award, TrendingUp, Building2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingForm from "./BookingForm";

export default function Hero() {
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-white"
      style={{ minHeight: "640px" }}
    >
      {/* RIGHT-SIDE ATMOSPHERE BASE */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              90deg,
              #ffffff 0%,
              #f9fcff 54%,
              #eef8ff 74%,
              #dff6fb 100%
            )
          `,
        }}
      />

      {/* HOUSE IMAGE WITH REAL FADE-OUT */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/house.png"
          alt="Modern Shelter Zimbabwe home"
          className="absolute left-0 top-0 h-full w-full object-cover md:w-[78%]"
          style={{
            objectPosition: "left center",
            filter: "brightness(0.98) contrast(1.04)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 56%, rgba(0,0,0,0.92) 64%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.16) 84%, rgba(0,0,0,0) 92%)",
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 56%, rgba(0,0,0,0.92) 64%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.16) 84%, rgba(0,0,0,0) 92%)",
          }}
        />
      </div>

      {/* SOFT WHITE LIFT THROUGH THE MIDDLE */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(255,255,255,0.00) 0%,
              rgba(255,255,255,0.00) 42%,
              rgba(255,255,255,0.10) 52%,
              rgba(255,255,255,0.28) 62%,
              rgba(255,255,255,0.50) 72%,
              rgba(255,255,255,0.22) 82%,
              rgba(255,255,255,0.00) 100%
            )
          `,
        }}
      />

      {/* TOP/BOTTOM EDGE FADE */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.96) 0%,
              rgba(255,255,255,0.35) 10%,
              rgba(255,255,255,0.00) 18%,
              rgba(255,255,255,0.00) 82%,
              rgba(255,255,255,0.35) 90%,
              rgba(255,255,255,0.96) 100%
            )
          `,
        }}
      />

      {/* BLUE GLOW ON FAR RIGHT */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[42%] pointer-events-none md:block"
        style={{
          background: `
            radial-gradient(
              circle at 88% 48%,
              rgba(0,174,237,0.34) 0%,
              rgba(41,221,218,0.18) 24%,
              rgba(38,82,162,0.08) 42%,
              rgba(255,255,255,0.00) 72%
            )
          `,
        }}
      />

      {/* BOTTOM CURVED GLOW */}
      <div
        className="absolute bottom-[-140px] right-[-80px] hidden h-[340px] w-[76%] opacity-80 pointer-events-none md:block"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(0,174,237,0.20) 0%,
              rgba(41,221,218,0.14) 24%,
              rgba(38,82,162,0.08) 42%,
              rgba(255,255,255,0.00) 72%
            )
          `,
          filter: "blur(10px)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[640px] w-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-[560px] pb-14 pt-28 sm:pt-32 md:ml-auto md:pt-36">
            <h1 className="mb-6 text-4xl font-bold leading-[0.98] text-slate-900 sm:text-5xl md:text-6xl">
              <span className="block">Land for today.</span>
              <span className="block" style={{ color: "#2652a2" }}>
                A home for tomorrow
              </span>
            </h1>

            <p className="mb-9 max-w-[520px] text-base leading-relaxed text-slate-600 sm:text-lg">
              We don&apos;t just build homes. We cultivate legacies that span generations.
            </p>

            <div
              className="mb-5 flex w-full max-w-md items-center gap-2 rounded-2xl border bg-white/82 px-4 py-2.5 backdrop-blur-sm shadow-sm sm:w-fit sm:px-5"
              style={{ borderColor: "rgba(38,82,162,0.12)" }}
            >
              <Home className="w-4 h-4" style={{ color: "#2652a2" }} />
              <span className="text-sm font-medium leading-snug text-slate-700">
                Trusted Housing Stand Experts for 40+ years
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                className="group rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl sm:px-8 sm:text-lg"
                style={{
                  background: "linear-gradient(135deg, #2652a2, #00aeed, #29ddda)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span className="flex items-center gap-2">
                  View Available Stands
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => setShowBookingForm(true)}
                className="rounded-2xl border-2 bg-white/88 px-6 py-4 text-base font-semibold shadow-sm transition-all duration-200 hover:bg-white sm:px-8 sm:text-lg"
                style={{
                  color: "#2652a2",
                  borderColor: "rgba(38,82,162,0.26)",
                }}
              >
                Book a Site Visit
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { number: "5,000+", label: "Housing Stands Delivered", icon: Home },
                { number: "98%", label: "Client Satisfaction", icon: TrendingUp },
                { number: "5,000+", label: "Happy Families", icon: Building2 },
                { number: "24/7", label: "Support Available", icon: Award },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-3xl border bg-white/80 p-5 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{ borderColor: "rgba(41,221,218,0.16)" }}
                  >
                    <Icon className="w-7 h-7 mb-3" style={{ color: "#2652a2" }} />
                    <div
                      className="mb-1 text-2xl font-bold md:text-3xl"
                      style={{ color: "#2652a2" }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-600 font-medium leading-snug">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <BookingForm onClose={() => setShowBookingForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}