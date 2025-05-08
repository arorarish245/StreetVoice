import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay for readability */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-4">
          StreetVoice: Speak Up. Clean Up. Fix Up.
        </h1>
        <p className="text-xl sm:text-2xl mb-6 max-w-xl mx-auto">
          Report civic problems in your area with just a photo. Our system alerts the right authorities — automatically.
        </p>
        <a href="/report" className="bg-accent text-white py-3 px-6 rounded-lg text-xl hover:bg-secondary transition-colors duration-300">
          Start Reporting
        </a>
        <div className="mt-6 flex space-x-8 text-2xl">
          <span role="img" aria-label="camera">📸</span>
          <span role="img" aria-label="location">🧭</span>
          <span role="img" aria-label="government">🏛️</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
