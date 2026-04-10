"use client";

import { motion } from "framer-motion";
import { MapPin, Shield, CreditCard, Users, CheckCircle, TrendingUp } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Strategic Locations",
    description: "Our stands are carefully selected in high-growth, accessible areas with strong long-term investment potential.",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Secure & Verified Ownership",
    description: "We ensure clear processes, transparent documentation, and peace of mind from inquiry to ownership.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment Options",
    description: "We offer structured payment plans designed to make property ownership achievable and convenient.",
    gradient: "from-sky-600 to-blue-600",
  },
  {
    icon: Users,
    title: "Growing Communities",
    description: "We develop organized layouts that promote structured, thriving, and future-ready communities.",
    gradient: "from-blue-500 to-sky-500",
  },
  {
    icon: CheckCircle,
    title: "Transparent & Professional Service",
    description: "We believe in honesty, clarity, and guiding you through every step with confidence.",
    gradient: "from-blue-500 to-sky-500",
  },
  {
    icon: TrendingUp,
    title: "Long-Term Value",
    description: "Our developments are chosen with appreciation and sustainability in mind — your investment today grows tomorrow.",
    gradient: "from-cyan-500 to-blue-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-slate-950 py-12 sm:py-14">
      {/* Image background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/why-choose-us-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Why Choose <span style={{ color: '#2652a2' }}>Us</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg">
            We don&apos;t just build homes. We cultivate legacies that span generations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg sm:p-6 lg:p-8"
              >
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl sm:mb-6 sm:h-16 sm:w-16"
                  style={{ background: 'linear-gradient(135deg, #2652a2, #29ddda)' }}
                >
                  <Icon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors sm:text-xl" onMouseEnter={(e) => e.currentTarget.style.color = '#2652a2'} onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
