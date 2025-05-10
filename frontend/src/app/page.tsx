"use client";

import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import WhyUseStreetVoice from "./components/WhyUseStreetVoice";
import CTASection from "./components/CTASection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <HowItWorks/>
      <WhyUseStreetVoice/>
      <CTASection/>
      <FAQSection/>
      <Footer/>
    </div>
  );
}
