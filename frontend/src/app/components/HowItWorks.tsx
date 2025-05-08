'use client';

import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <section className="py-20" style={{ backgroundColor: "#BBE1FA" }}> {/* Background color */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold" style={{ color: "#1B262C" }}>It's That Simple:</h2> {/* Primary color */}
        <p className="text-xl mt-4" style={{ color: "#0F4C75" }}>Effortlessly report civic issues and make a difference.</p> {/* Secondary color */}
      </div>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {/* Step 1: Spot the Problem */}
        <motion.div
          className="max-w-sm w-full p-6 bg-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src="/images/step1.jpg"
            alt="Spot the Problem"
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="text-2xl font-semibold mt-4" style={{ color: "#1B262C" }}>Spot the Problem</h3> {/* Primary color */}
          <p className="text-md mt-2" style={{ color: "#4B4B4B" }}>Notice an issue like potholes, garbage, or broken infrastructure.</p> {/* Neutral color */}
        </motion.div>

        {/* Step 2: Snap a Picture */}
        <motion.div
          className="max-w-sm w-full p-6 bg-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src="/images/step2.jpg"
            alt="Snap a Picture"
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="text-2xl font-semibold mt-4" style={{ color: "#1B262C" }}>Snap a Picture</h3> {/* Primary color */}
          <p className="text-md mt-2" style={{ color: "#4B4B4B" }}>Capture it with your phone or camera to show the issue clearly.</p> {/* Neutral color */}
        </motion.div>

        {/* Step 3: Tag It */}
        <motion.div
          className="max-w-sm w-full p-6 bg-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src="/images/step3.jpg"
            alt="Tag It"
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="text-2xl font-semibold mt-4" style={{ color: "#1B262C" }}>Tag It</h3> {/* Primary color */}
          <p className="text-md mt-2" style={{ color: "#4B4B4B" }}>Auto-detect or select the location for accuracy.</p> {/* Neutral color */}
        </motion.div>

        {/* Step 4: Send It */}
        <motion.div
          className="max-w-sm w-full p-6 bg-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src="/images/step4.jpg"
            alt="Send It"
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="text-2xl font-semibold mt-4" style={{ color: "#1B262C" }}>Send It</h3> {/* Primary color */}
          <p className="text-md mt-2" style={{ color: "#4B4B4B" }}>Submit the report with just a tap. The authorities will be notified automatically.</p> {/* Neutral color */}
        </motion.div>

        {/* Step 5: Fix It */}
        <motion.div
          className="max-w-sm w-full p-6 bg-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src="/images/step5.jpg"
            alt="Fix It"
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="text-2xl font-semibold mt-4" style={{ color: "#1B262C" }}>Fix It</h3> {/* Primary color */}
          <p className="text-md mt-2" style={{ color: "#4B4B4B" }}>Authorities get notified and take action to resolve the issue.</p> {/* Neutral color */}
        </motion.div>
      </div>
    </section>
  );
}
