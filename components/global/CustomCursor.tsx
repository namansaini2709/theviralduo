"use client";

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';
import './CustomCursor.css';

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Manage cursor visibility
    const isAdmin = window.location.pathname.startsWith('/admin');
    const shouldHideCursor = !isAdmin && !isMobile;
    
    const styleId = 'cursor-hide-style';
    let styleTag = document.getElementById(styleId);

    const cleanup = () => {
      const tag = document.getElementById(styleId);
      if (tag) tag.remove();
    };

    if (shouldHideCursor) {
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.innerHTML = `* { cursor: none !important; }`;
        document.head.appendChild(styleTag);
      }
    } else {
      cleanup();
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      cleanup();
    };
  }, [pathname, isMobile]);

  // Use MotionValues for high-performance tracking without re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Use springs for smooth following
  const springConfigDot = { damping: 25, stiffness: 400, mass: 0.2 };
  const springConfigRing = { damping: 30, stiffness: 200, mass: 0.8 };

  const cursorX = useSpring(mouseX, springConfigDot);
  const cursorY = useSpring(mouseY, springConfigDot);
  
  const ringX = useSpring(mouseX, springConfigRing);
  const ringY = useSpring(mouseY, springConfigRing);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestInteractive = target.closest('a, button, [role="button"], .interactive');
      
      if (closestInteractive && !closestInteractive.classList.contains('no-cursor')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile || !isVisible || isAdmin) return null;

  return (
    <>
      {/* Main Cursor Circle */}
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: isHovering ? "difference" : "normal",
        }}
        animate={{
          width: isHovering ? 80 : 12,
          height: isHovering ? 80 : 12,
          backgroundColor: isHovering ? "#ffffff" : "#dc2626",
        }}
        transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
      />
      
      {/* Outer Outline */}
      <motion.div
        className="cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
