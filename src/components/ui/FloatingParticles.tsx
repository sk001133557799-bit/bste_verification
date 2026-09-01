"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FloatingParticles() {
  const particles = [
    { id: 1, top: "15%", left: "10%", size: 4, duration: 7, delay: 0 },
    { id: 2, top: "25%", left: "85%", size: 6, duration: 9, delay: 1 },
    { id: 3, top: "65%", left: "20%", size: 5, duration: 8, delay: 2 },
    { id: 4, top: "75%", left: "75%", size: 4, duration: 10, delay: 0.5 },
    { id: 5, top: "45%", left: "90%", size: 6, duration: 7.5, delay: 1.5 },
    { id: 6, top: "85%", left: "45%", size: 5, duration: 9.5, delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Ambient Light Cones */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-primary-light/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Gold Spark Dots */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/40 shadow-gold-sm"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.9, 1.2, 0.9],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
