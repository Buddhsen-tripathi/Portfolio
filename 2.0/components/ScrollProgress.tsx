"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ScrollProgress = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Detect route changes

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / documentHeight) * 100;
      setScrollPercentage(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Page Load Progress
  useEffect(() => {
    setLoading(true);
    setScrollPercentage(10); // Start at 10%
    
    setTimeout(() => {
      setScrollPercentage(100);
    }, 500); // Fast transition to 100%

    setTimeout(() => {
      setLoading(false);
      setScrollPercentage(0); // Hide after complete
    }, 800); // Smooth fade-out
  }, [pathname]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-1 z-[9999] transition-opacity duration-500 ${
        scrollPercentage === 0 && !loading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${scrollPercentage}%`,
          backgroundColor: "#4299e1",
          transition: "width 0.2s ease-out, opacity 0.5s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default ScrollProgress;