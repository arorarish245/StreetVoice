'use client';

import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <section className="bg-background py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary">It's That Simple:</h2>
        <p className="text-xl mt-4 text-secondary">Effortlessly report civic issues and make a difference.</p>
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
          <h3 className="text-2xl font-semibold mt-4 text-primary">Spot the Problem</h3>
          <p className="text-md mt-2 text-gray-600">
            Notice an issue like potholes, garbage, or broken infrastructure.
          </p>
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
          <h3 className="text-2xl font-semibold mt-4 text-primary">Snap a Picture</h3>
          <p className="text-md mt-2 text-gray-600">
            Capture it with your phone or camera to show the issue clearly.
          </p>
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
          <h3 className="text-2xl font-semibold mt-4 text-primary">Tag It</h3>
          <p className="text-md mt-2 text-gray-600">
            Auto-detect or select the location for accuracy.
          </p>
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
          <h3 className="text-2xl font-semibold mt-4 text-primary">Send It</h3>
          <p className="text-md mt-2 text-gray-600">
            Submit the report with just a tap. The authorities will be notified automatically.
          </p>
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
          <h3 className="text-2xl font-semibold mt-4 text-primary">Fix It</h3>
          <p className="text-md mt-2 text-gray-600">
            Authorities get notified and take action to resolve the issue.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
