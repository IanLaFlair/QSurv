"use client";

import { motion } from "framer-motion";

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated Orbs */}
      <motion.div 
        className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-purple-600/30 rounded-full blur-[100px]"
        animate={{
          x: [0, 400, 0, -200, 0],
          y: [0, 200, -100, 200, 0],
          scale: [1, 1.3, 0.9, 1.2, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div 
        className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] bg-blue-600/20 rounded-full blur-[120px]"
        animate={{
          x: [0, -400, 200, -200, 0],
          y: [0, -300, 100, -200, 0],
          scale: [1, 1.2, 0.8, 1.1, 1],
          rotate: [0, -120, -240, -360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div 
        className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] bg-cyan-500/15 rounded-full blur-[90px]"
        animate={{
          x: [0, 300, -300, 100, 0],
          y: [0, -200, 200, -100, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.4, 0.8, 1.2, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
