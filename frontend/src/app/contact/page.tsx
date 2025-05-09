// src/app/components/ContactUs.tsx

'use client';

import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setIsSubmitting(true);
  setStatus(null);

  const response = await fetch('http://localhost:8000/contact', {  // 🔁 Changed from /api/contact
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    setStatus('Your message has been sent!');
    setFormData({ name: '', email: '', message: '' });
  } else {
    setStatus('Something went wrong. Please try again.');
  }

  setIsSubmitting(false);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BBE1FA] py-12 px-6">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#1B262C] text-center mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg text-[#1B262C]">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg text-[#1B262C]">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-lg text-[#1B262C]">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
              rows={4}
              required
            />
          </div>

          {status && (
            <div className={`mb-4 text-center ${status.includes('sent') ? 'text-green-500' : 'text-red-500'}`}>
              {status}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 text-white text-lg rounded-full ${isSubmitting ? 'bg-gray-500' : 'bg-[#3282B8] hover:bg-[#1B262C] transition duration-300'}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
