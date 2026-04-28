"use client";

import React from "react";
import FloatingParticlesBackground from "./FloatingParticlesBackground";

const InteractiveBackground: React.FC = () => {
  return (
    <>
      <div 
        className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-[#080808]"
        style={{
          backgroundImage: `url('/Background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Radial Gradient Orbs for Depth */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/5 blur-[120px] pointer-events-none" />

        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      </div>

      {/* New Particle System from Framer */}
      <FloatingParticlesBackground 
        particleCount={80}
        particleSize={1.5}
        particleOpacity={0.5}
        glowIntensity={12}
        movementSpeed={0.4}
        mouseInfluence={150}
        mouseGravity="repel"
        glowAnimation="ease"
      />
    </>
  );
};

export default InteractiveBackground;
