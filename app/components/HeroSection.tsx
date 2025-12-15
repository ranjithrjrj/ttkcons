'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 1. IMPORT next/image

const slides = [
  {
    id: 1,
    category: 'Slide 1 / Roads & Highways',
    title: 'Building Reliability, Constructing The Future.',
    description: 'A leading government contractor specializing in Roads, Bridges, and large-scale Irrigation projects across South India.',
    buttonText: 'Explore Our Work',
    buttonLink: '/projects',
    className: 'hero-slide-1',
    // 2. ADD IMAGE SOURCE (Path relative to your /public folder)
    imageSrc: '/images/nhaislide1.png', 
  },
  {
    id: 2,
    category: 'Slide 2 / Bridges & Railways',
    title: 'Mastering Complex Structural Engineering.',
    description: 'Delivering vital Over Bridges (ROBs) and Limited Use Subways (VUPs) for seamless railway and highway integration.',
    buttonText: 'View Rail Capabilities',
    buttonLink: '/infrastructure',
    className: 'hero-slide-2',
    // 2. ADD IMAGE SOURCE
    imageSrc: '/images/slide2.png',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full h-[650px] relative overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex items-center justify-center text-white transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* 3. IMAGE COMPONENT INTEGRATION */}
          <Image
            src={slide.imageSrc}
            alt={slide.title}
            fill={true} // Makes the image fill the parent div
            className="object-cover" // Ensures the image covers the area without stretching
            priority={true} // Recommended for LCP images like a hero banner
          />
          {/* END IMAGE COMPONENT */}

          {/* 4. CONTENT OVERLAY */}
          {/* You may want a darker overlay on the image for readability */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          
          {/* TEXT CONTENT */}
          <div className="max-w-6xl mx-auto text-left px-4 md:px-8 z-20">
            <p className="text-xl uppercase tracking-widest text-amber-400 font-semibold mb-3">
              {slide.category}
            </p>
            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              {slide.title.split('**').map((part, i) => 
                i % 2 === 1 ? <span key={i} className="text-amber-400">{part}</span> : part
              )}
            </h1>
            <p className="text-lg font-light max-w-xl mb-8">
              {slide.description}
            </p>
            <Link
              href={slide.buttonLink}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-amber-500 text-base font-semibold rounded-md text-white bg-amber-500 hover:bg-amber-600 transition duration-300 shadow-xl"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}

      {/* Slide Indicators (Remains the same) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-amber-500 w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}