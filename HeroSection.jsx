import React from 'react';
import { Mountain, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const scrollDown = () => {
    const tracker = document.getElementById('tracker-section');
    tracker?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background image — real photo by Kalen Emsley on Unsplash */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80")',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 gap-6">
        <Mountain className="size-10 text-primary" />
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-wider text-foreground uppercase">
          Summit Wizard.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
          A climber from Ohio working toward high-altitude mountaineering. One peak at a time.
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 z-10 animate-bounce cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown className="size-8 text-primary" />
      </button>
    </section>
  );
}
