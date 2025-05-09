'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Spot the Problem',
      description: 'Notice an issue like potholes, garbage, or broken infrastructure.',
      img: '/images/step1.jpg',
    },
    {
      title: 'Snap a Picture',
      description: 'Capture it with your phone or camera to show the issue clearly.',
      img: '/images/step2.jpg',
    },
    {
      title: 'Tag It',
      description: 'Auto-detect or select the location for accuracy.',
      img: '/images/step3.jpg',
    },
    {
      title: 'Send It',
      description: 'Submit the report with just a tap. The authorities will be notified automatically.',
      img: '/images/step4.jpg',
    },
    {
      title: 'Fix It',
      description: 'Authorities get notified and take action to resolve the issue.',
      img: '/images/step5.jpg',
    },
  ];

  return (
    <section id="how-it-works" className="py-20" style={{ backgroundColor: "#BBE1FA" }}>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold" style={{ color: "#1B262C" }}>
          It's That Simple:
        </h2>
        <p className="text-xl mt-4" style={{ color: "#0F4C75" }}>
          Effortlessly report civic issues and make a difference.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            className="max-w-sm w-full p-6 bg-white rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={step.img}
                alt={step.title}
                fill
                className="object-cover"
                quality={70}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-2xl font-semibold mt-4" style={{ color: "#1B262C" }}>
              {step.title}
            </h3>
            <p className="text-md mt-2" style={{ color: "#4B4B4B" }}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
