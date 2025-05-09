'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is StreetVoice?",
      answer: "StreetVoice is a platform that allows citizens to report civic issues, ranging from garbage to potholes, helping authorities resolve them faster."
    },
    {
      question: "How can I report an issue?",
      answer: "Simply snap a picture of the issue, tag the location, and submit your report through the app or website."
    },
    {
      question: "Is it free to use?",
      answer: "Yes, StreetVoice is completely free for citizens to use."
    },
    {
      question: "What happens after I submit a report?",
      answer: "Once submitted, your report is automatically forwarded to the appropriate authorities, who will take action to resolve the issue."
    },
    {
      question: "How do I track my report?",
      answer: "You can track the status of your report in real-time through the app or website."
    }
  ];

  return (
    <section id='faq' className="py-20 bg-[#BBE1FA]">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold" style={{ color: "#1B262C" }}>Frequently Asked Questions</h2>
        <p className="text-xl mt-4" style={{ color: "#0F4C75" }}>Find answers to common questions about StreetVoice.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 px-6">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <h3 className="text-xl font-semibold" style={{ color: "#1B262C" }}>
                {item.question}
              </h3>
              <span className="text-xl text-[#3282B8]">
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <p className="text-md mt-4" style={{ color: "#4B4B4B" }}>{item.answer}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
