import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface AmbientCanvasProps {
  className?: string;
}

export const AmbientCanvas: React.FC<AmbientCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check system prefers-reduced-motion safely
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsPaused(true);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle drifting amber crystals and metabolic nodes
    const particleCount = Math.min(35, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      amberHue: Math.random() > 0.4 ? '212, 163, 89' : '243, 201, 139',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!isPaused) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.amberHue}, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.amberHue}, 0.3)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
      <button
        onClick={() => setIsPaused((prev) => !prev)}
        className="pointer-events-auto absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/40 hover:bg-black/70 border border-white/10 text-slate-300 transition-colors"
        aria-label={isPaused ? 'Resume ambient animation' : 'Pause ambient animation'}
        title="Toggle background ambient particle flow"
      >
        {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3 text-slate-400" />}
        <span>{isPaused ? 'Motion: Off' : 'Motion: On'}</span>
      </button>
    </div>
  );
};

export default AmbientCanvas;
