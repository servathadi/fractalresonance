'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

// Theme-aware colors
const COLORS = {
  dark: {
    blue: '#1F3A5F',
    gold: '#C9A227',
  },
  light: {
    blue: '#CBD5E1',
    gold: '#96780A',
  },
};

interface CoherenceWidgetProps {
  initialN?: number;
  initialK?: number;
}

export function CoherenceWidget({ initialN = 50, initialK = 0.5 }: CoherenceWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const colors = COLORS[resolvedTheme === 'dark' ? 'dark' : 'light'];

  // Simulation State
  const [N, setN] = useState(initialN);
  const [K, setK] = useState(initialK);
  const [coherence, setCoherence] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // Physics Ref (to avoid closure staleness in animation loop)
  const simRef = useRef({
    oscillators: [] as { phase: number; speed: number }[],
    N: initialN,
    K: initialK,
  });

  // Initialize Oscillators
  useEffect(() => {
    const oscillators = [];
    for (let i = 0; i < N; i++) {
      oscillators.push({
        phase: Math.random() * 2 * Math.PI,
        // Natural frequencies: Standard Normal distribution
        speed: (Math.random() - 0.5) * 0.1, 
      });
    }
    simRef.current.oscillators = oscillators;
    simRef.current.N = N;
  }, [N]); // Re-init when N changes

  // Update K ref
  useEffect(() => {
    simRef.current.K = K;
  }, [K]);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (!isRunning) return;
      const dt = Math.min((time - lastTime) / 1000, 0.1); // Cap dt
      lastTime = time;
      
      const { oscillators, N, K } = simRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.35;

      // 1. Calculate Order Parameter (Mean Field)
      // Z = r * e^(i*psi) = (1/N) * sum(e^(i*theta))
      let sumCos = 0;
      let sumSin = 0;
      for (const osc of oscillators) {
        sumCos += Math.cos(osc.phase);
        sumSin += Math.sin(osc.phase);
      }
      const r = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
      const psi = Math.atan2(sumSin, sumCos);

      // Update React state (throttled ideally, but rAF is fast)
      // Actually, updating state every frame kills React. Update ref, read ref in separate interval?
      // Or just draw the text on canvas. Let's draw text on canvas for perf.
      // But we want to export C to parent? No, just visualize here.
      
      // 2. Physics Update (Mean Field)
      // dtheta/dt = w + K * r * sin(psi - theta)
      for (const osc of oscillators) {
        const dTheta = osc.speed + K * r * Math.sin(psi - osc.phase);
        osc.phase += dTheta; // Scale speed for visual effect
      }

      // 3. Draw
      ctx.clearRect(0, 0, width, height);
      
      // Unit Circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = colors.blue;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Oscillators
      for (const osc of oscillators) {
        const x = cx + Math.cos(osc.phase) * radius;
        const y = cy + Math.sin(osc.phase) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        // Color based on sync (closeness to psi)
        const diff = Math.abs(osc.phase - psi) % (2*Math.PI);
        // Simple gold/steel coloring
        ctx.fillStyle = colors.gold;
        ctx.fill();
      }

      // Order Parameter Vector (The "Coherence Arrow")
      const arrowLen = r * radius;
      const ax = cx + Math.cos(psi) * arrowLen;
      const ay = cy + Math.sin(psi) * arrowLen;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ax, ay);
      ctx.strokeStyle = colors.gold;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Arrowhead
      if (r > 0.05) {
        ctx.beginPath();
        ctx.arc(ax, ay, 4, 0, 2 * Math.PI);
        ctx.fillStyle = colors.gold;
        ctx.fill();
      }

      // Text Metric
      setCoherence(r); // This might cause re-renders. 
      // Optimization: Only set if changed significantly or just use refs for UI overlay?
      // Let's rely on React 18 batching or simple separate component.
      // Actually, drawing text on canvas is cheapest.
      
      requestAnimationFrame(() => animate(performance.now()));
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isRunning, N, colors]); // Re-bind if N or theme changes

  return (
    <div className="w-full bg-frc-void border border-frc-blue rounded-lg p-5">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {/* Canvas */}
        <div className="relative shrink-0">
           <canvas 
            ref={canvasRef} 
            width={280} 
            height={280}
            className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px]"
          />
           {/* Center Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
             <div className="text-[10px] text-frc-steel uppercase tracking-widest mb-1">Coherence</div>
             <div className="text-2xl font-mono text-frc-gold">{coherence.toFixed(3)}</div>
           </div>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <div className="flex justify-between text-xs text-frc-text-dim mb-2 uppercase tracking-wide">
              <span>Oscillators (N)</span>
              <span className="font-mono text-frc-gold">{N}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="200" 
              step="10" 
              value={N}
              onChange={(e) => setN(Number(e.target.value))}
              className="w-full h-1 bg-frc-blue rounded-lg appearance-none cursor-pointer accent-frc-gold"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-frc-text-dim mb-2 uppercase tracking-wide">
              <span>Coupling (K)</span>
              <span className="font-mono text-frc-gold">{K.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5" 
              step="0.05" 
              value={K}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full h-1 bg-frc-blue rounded-lg appearance-none cursor-pointer accent-frc-gold"
            />
             <p className="text-[10px] text-frc-text-dim mt-2">
               K &lt; 0.5: Chaos. K &gt; 1.0: Phase Lock.
             </p>
          </div>

          <div className="pt-2 border-t border-frc-blue/30">
             <p className="text-xs text-frc-text-dim leading-relaxed">
               <strong>Visualization:</strong> Each dot is an agent. The <span className="text-frc-gold">gold arrow</span> represents the group's coherence vector. Longer arrow = higher synchrony.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
