"use client";

import { motion } from "framer-motion";
import { CheckCircle, Award, Users, MapPin, CreditCard, Shield, TrendingUp, Clock } from "lucide-react";

const whyChooseShelter = [
  "40+ Years of Proven Experience",
  "1,000+ Stands Successfully Sold",
  "Strategic, High-Growth Locations",
  "Flexible Payment Options",
  "Transparent & Secure Ownership",
  "A Commitment to Building Lasting Communities",
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white py-12 sm:py-14">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: '#2652a2' }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" style={{ backgroundColor: '#29ddda' }}></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              Building Communities for Over <span style={{ color: '#2652a2' }}>40+ Years</span>
            </h2>
            <p className="mb-6 text-base leading-relaxed text-gray-600 sm:text-lg">
              For more than four decades, Shelter has helped families and investors secure their future through trusted land ownership. With over 1,000 stands successfully sold, our experience is built on reliability, integrity, and long-term vision.
            </p>
            <p className="mb-6 text-base leading-relaxed text-gray-600 sm:text-lg">
              We believe owning land is the foundation of stability, growth, and generational wealth. That is why every development we offer is carefully planned, strategically located, and designed to create thriving communities.
            </p>
            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
              From your first inquiry to final ownership, we provide transparent processes, professional guidance, and flexible solutions that make property ownership achievable and secure.
            </p>
            
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Why Choose Shelter</h3>
              <div className="space-y-3">
                {whyChooseShelter.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#2652a2' }} />
                    <span className="text-base text-gray-700 sm:text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl p-4 shadow-xl sm:p-6 lg:p-8" style={{ background: 'linear-gradient(135deg, #2652a2, #00aeed, #29ddda)' }}>
              {/* Animated background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:30px_30px] animate-[slide_20s_linear_infinite]"></div>
              </div>
              
              <div className="relative rounded-2xl bg-white p-5 sm:p-6 lg:p-8">
                <h3 className="mb-6 text-center text-xl font-bold text-gray-900 sm:text-2xl">Our Legacy</h3>
                <div className="space-y-4 sm:space-y-6">
                  {/* Experience */}
                  <div className="rounded-xl border p-5 sm:p-6" style={{ background: 'linear-gradient(to bottom right, rgba(38, 82, 162, 0.08), rgba(0, 174, 237, 0.1), rgba(41, 221, 218, 0.12))', borderColor: 'rgba(38, 82, 162, 0.18)' }}>
                    <div className="mb-2 flex items-center gap-3">
                      <Clock className="h-7 w-7 sm:h-8 sm:w-8" style={{ color: '#2652a2' }} />
                      <span className="font-semibold text-gray-900">Experience You Can Trust</span>
                    </div>
                    <div className="mb-1 text-2xl font-black text-gray-900 sm:text-3xl">40+ Years</div>
                    <div className="text-sm text-gray-600">in Land Development</div>
                  </div>

                  {/* Track Record */}
                  <div className="rounded-xl border p-5 sm:p-6" style={{ background: 'linear-gradient(to bottom right, rgba(38, 82, 162, 0.08), rgba(0, 174, 237, 0.1), rgba(41, 221, 218, 0.12))', borderColor: 'rgba(38, 82, 162, 0.18)' }}>
                    <div className="mb-2 flex items-center gap-3">
                      <Award className="h-7 w-7 sm:h-8 sm:w-8" style={{ color: '#2652a2' }} />
                      <span className="font-semibold text-gray-900">Proven Track Record</span>
                    </div>
                    <div className="mb-1 text-2xl font-black text-gray-900 sm:text-3xl">1,000+ Stands</div>
                    <div className="text-sm text-gray-600">Successfully Sold</div>
                  </div>

                  {/* Community Vision */}
                  <div className="rounded-xl border p-5 sm:p-6" style={{ background: 'linear-gradient(to bottom right, rgba(38, 82, 162, 0.08), rgba(0, 174, 237, 0.1), rgba(41, 221, 218, 0.12))', borderColor: 'rgba(38, 82, 162, 0.18)' }}>
                    <div className="mb-2 flex items-center gap-3">
                      <Users className="h-7 w-7 sm:h-8 sm:w-8" style={{ color: '#2652a2' }} />
                      <span className="font-semibold text-gray-900">Community-Focused Vision</span>
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      Developing spaces where families grow and futures are secured
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
