"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Tendai & Rudo Moyo",
    role: "Residential Stand Owner",
    location: "Rockview",
    title: "A Smooth and Transparent Process",
    content:
      "Buying our stand through Shelter was one of the best decisions we've made. The process was clear, professional, and stress-free from start to finish. Today, we are building our dream home with confidence.",
    rating: 5,
    stand: "Rockview",
  },
  {
    name: "Farai Chikwanda",
    role: "Investor & Stand Owner",
    location: "Adelaide Park",
    title: "An Investment Worth Making",
    content:
      "I was looking for a secure land investment with long-term value, and Shelter delivered exactly that. Their team guided me through every step, including the payment process and documentation. I highly recommend them.",
    rating: 5,
    stand: "Adelaide Park",
  },
  {
    name: "Nyasha Nkomo",
    role: "Homeowner",
    location: "Residential Development",
    title: "More Than Just a Purchase",
    content:
      "Shelter made us feel supported throughout the entire journey. From reserving our stand to completing payments, everything was handled professionally. We now own land that will benefit our family for generations.",
    rating: 5,
    stand: "Residential Development",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12 sm:py-14">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-20" style={{ backgroundColor: '#2652a2' }}></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-20" style={{ backgroundColor: '#00aeed' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Client <span style={{ color: '#2652a2' }}>Success Stories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from families and investors who've found their perfect stand and are building their future with Shelter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #2652a2, #00aeed, #29ddda)' }}></div>
              
              <Quote className="w-12 h-12 mb-4 opacity-20 group-hover:opacity-40 transition-opacity" style={{ color: '#2652a2' }} />
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{testimonial.title}</h3>
              <p className="mb-6 text-base leading-relaxed text-gray-700 sm:text-lg">
                "{testimonial.content}"
              </p>
              <div className="pt-4 border-t border-gray-100">
                <div className="font-bold text-gray-900 text-lg mb-1">{testimonial.name}</div>
                <div className="text-sm text-gray-500 mb-2">{testimonial.role} – {testimonial.location}</div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full inline-block" style={{ color: '#2652a2', backgroundColor: 'rgba(38, 82, 162, 0.12)' }}>
                  {testimonial.stand}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
