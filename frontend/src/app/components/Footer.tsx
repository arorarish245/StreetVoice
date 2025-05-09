'use client';

export default function Footer() {
  return (
    <footer className="bg-[#1B262C] text-white py-8">
      <div className="container mx-auto text-center">
        {/* Logo or Title */}
        <h2 className="text-3xl font-bold mb-4">StreetVoice</h2>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#BBE1FA] hover:text-[#3282B8]">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#BBE1FA] hover:text-[#3282B8]">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#BBE1FA] hover:text-[#3282B8]">
            Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#BBE1FA] hover:text-[#3282B8]">
            LinkedIn
          </a>
        </div>

        {/* Copyright Text */}
        <p className="text-sm mb-4">&copy; 2025 StreetVoice. All rights reserved.</p>

        {/* Links */}
        <div className="flex justify-center space-x-6">
          <a href="/privacy-policy" className="text-[#BBE1FA] hover:text-[#3282B8]">Privacy Policy</a>
          <a href="/terms-of-service" className="text-[#BBE1FA] hover:text-[#3282B8]">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
