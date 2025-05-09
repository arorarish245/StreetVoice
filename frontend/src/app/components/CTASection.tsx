'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="bg-[#3282B8] text-white py-16">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl mb-6">
          Join the movement and help us create a cleaner, safer city for everyone.
        </p>
        
        <motion.a
          href="/report"
          className="inline-block bg-white text-[#3282B8] py-3 px-8 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Start Reporting
        </motion.a>
      </div>
    </section>
  );
}
