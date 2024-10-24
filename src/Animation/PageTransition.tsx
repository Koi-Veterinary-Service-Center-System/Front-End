"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

// Định nghĩa component Wave như cũ
const Wave = ({
  color,
  amplitude,
  frequency,
  speed,
  delay,
}: {
  color: string;
  amplitude: number;
  frequency: number;
  speed: number;
  delay: number;
}) => {
  const [pathData, setPathData] = useState("");

  useEffect(() => {
    const generateWave = () => {
      let path = `M 0 ${50 + amplitude}`;
      for (let x = 0; x <= 1000; x += 10) {
        const y =
          amplitude * Math.sin(x / frequency + (Date.now() * speed) / 1000);
        path += ` L ${x} ${50 + y}`;
      }
      setPathData(path);
    };

    const interval = setInterval(generateWave, 50);
    return () => clearInterval(interval);
  }, [amplitude, frequency, speed]);

  return (
    <motion.path
      d={pathData}
      fill="none"
      stroke={color}
      strokeWidth="3"
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1, pathLength: 1 }}
      exit={{ opacity: 0, pathLength: 0 }}
      transition={{ duration: 1.5, delay: delay, ease: "easeInOut" }}
    />
  );
};

// Component để thêm cá koi vào trang
const KoiFish = () => {
  return (
    <motion.img
      src="src\assets\images\560f67cddc155c1b87f77515f7f13525.jpg" // Thay đường dẫn tới hình ảnh cá koi
      alt="Koi Fish"
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      style={{
        position: "absolute",
        bottom: "20%",
        left: "10%",
        width: "100px",
        zIndex: 10,
      }}
    />
  );
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#0c4a6e",
              zIndex: 9999,
              overflow: "hidden",
            }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient
                  id="waveGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0c4a6e" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#waveGradient)" />
              <g>
                <Wave
                  color="rgba(255,255,255,0.2)"
                  amplitude={20}
                  frequency={200}
                  speed={0.5}
                  delay={0}
                />
                <Wave
                  color="rgba(255,255,255,0.3)"
                  amplitude={30}
                  frequency={150}
                  speed={0.7}
                  delay={0.2}
                />
                <Wave
                  color="rgba(255,255,255,0.4)"
                  amplitude={40}
                  frequency={100}
                  speed={0.9}
                  delay={0.4}
                />
                <Wave
                  color="rgba(255,255,255,0.5)"
                  amplitude={50}
                  frequency={80}
                  speed={1.1}
                  delay={0.6}
                />
              </g>
            </svg>
            {/* Thêm hiệu ứng cá koi */}
            <KoiFish />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};
