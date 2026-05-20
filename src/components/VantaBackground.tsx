'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: {
      CLOUDS: (options: {
        el: string | HTMLElement;
        mouseControls: boolean;
        touchControls: boolean;
        gyroControls: boolean;
        minHeight: number;
        minWidth: number;
        backgroundColor?: number;
        skyColor?: number;
        cloudColor?: number;
        cloudShadowColor?: number;
        sunColor?: number;
        sunGlareColor?: number;
        sunlightColor?: number;
        speed?: number;
      }) => { destroy: () => void };
    };
  }
}

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      // Load Three.js
      const threeScript = document.createElement('script');
      threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      threeScript.async = true;

      // Load Vanta Clouds
      const vantaScript = document.createElement('script');
      vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js';
      vantaScript.async = true;

      threeScript.onload = () => {
        vantaScript.onload = () => {
          if (window.VANTA && vantaRef.current) {
            vantaEffect.current = window.VANTA.CLOUDS({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              backgroundColor: 0xffffff,
              skyColor: 0x68b8d7,
              cloudColor: 0xadc1de,
              cloudShadowColor: 0x183550,
              sunColor: 0xff9919,
              sunGlareColor: 0xff6633,
              sunlightColor: 0xff9933,
              speed: 1,
            });
          }
        };
        document.head.appendChild(vantaScript);
      };

      document.head.appendChild(threeScript);
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
