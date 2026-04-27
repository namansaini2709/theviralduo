"use client";

import { motion } from 'framer-motion';
import './Marquee.css';

const marqueeItems = ["SHORT FORM", "ENGAGEMENT", "CONTENT STRATEGY", "VIRAL"];

export default function Marquee() {
  return (
    <div className="marquee-container">
      <motion.div
        className="marquee-wrapper"
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...Array(2)].map((_, groupIndex) => (
          <div key={groupIndex} className="marquee-group">
            {[...Array(4)].map((_, i) => (
              marqueeItems.map((item, index) => (
                <div key={`${groupIndex}-${i}-${index}`} className="marquee-item">
                  <span className="marquee-text">{item}</span>
                  <div className="marquee-dot" />
                </div>
              ))
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
