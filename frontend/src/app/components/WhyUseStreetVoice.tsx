'use client';

import { motion } from 'framer-motion';
import { FaMobileAlt, FaBolt, FaMapMarkedAlt, FaEye } from 'react-icons/fa'; // Updated icons

export default function WhyUseStreetVoice() {
  return (
    <section id='features' className="py-20" style={{ backgroundColor: "#BBE1FA" }}>
      <div className="text-center mb-12 px-6">
        <h2 className="text-4xl font-bold" style={{ color: "#1B262C" }}>Why Use StreetVoice?</h2>
        <p className="text-xl mt-4" style={{ color: "#0F4C75" }}>Discover the features that make StreetVoice unique.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-6">
        {/* Icon 1: Mobile Accessibility */}
        <motion.div
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <FaMobileAlt className="text-5xl mb-4" style={{ color: "#3282B8" }} />
          <h3 className="text-lg font-semibold" style={{ color: "#1B262C" }}>Mobile Accessibility</h3>
          <p className="text-md" style={{ color: "#4B4B4B" }}>Report issues anytime, anywhere using your phone.</p>
        </motion.div>

        {/* Icon 2: No Middlemen, Just Action */}
        <motion.div
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <FaBolt className="text-5xl mb-4" style={{ color: "#3282B8" }} />
          <h3 className="text-lg font-semibold" style={{ color: "#1B262C" }}>No Middlemen, Just Action</h3>
          <p className="text-md" style={{ color: "#4B4B4B" }}>Submit reports directly to authorities—no red tape or delays.</p>
        </motion.div>

        {/* Icon 3: Geo-Tagged Reports */}
        <motion.div
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <FaMapMarkedAlt className="text-5xl mb-4" style={{ color: "#3282B8" }} />
          <h3 className="text-lg font-semibold" style={{ color: "#1B262C" }}>Geo-Tagged Reports</h3>
          <p className="text-md" style={{ color: "#4B4B4B" }}>Accurate location tagging ensures faster and precise action.</p>
        </motion.div>

        {/* Icon 4: Transparency & Updates */}
        <motion.div
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <FaEye className="text-5xl mb-4" style={{ color: "#3282B8" }} />
          <h3 className="text-lg font-semibold" style={{ color: "#1B262C" }}>Transparency & Updates</h3>
          <p className="text-md" style={{ color: "#4B4B4B" }}>Track your complaint’s progress in real-time. Stay informed, always.</p>
        </motion.div>
      </div>
    </section>
  );
}
