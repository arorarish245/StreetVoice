'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section
      className="relative flex items-center justify-center h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 text-center p-6 space-y-6">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold tracking-wide leading-tight text-shadow-lg"
        >
          StreetVoice
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl md:text-3xl font-semibold tracking-wider"
        >
          Your Voice for a Cleaner, Safer City
        </motion.p>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl max-w-lg mx-auto font-light leading-relaxed"
        >
          Snap a picture of the issue, and we’ll take care of the rest — from reporting to resolution.
        </motion.p>

        {/* CTA Button */}
        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          href="/report"
          className="inline-block text-black py-3 px-8 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          style={{
            backgroundColor: '#3282B8', // Accent color
            opacity: 0.9,
          }}
        >
          Start Reporting
        </motion.a>
      </div>
    </section>
  );
}
