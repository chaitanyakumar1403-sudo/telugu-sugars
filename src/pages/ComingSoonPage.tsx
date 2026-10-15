import React from 'react';

export const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="container flex min-h-[70svh] flex-col items-center justify-center gap-6 text-center">
    <span className="reveal inline-flex items-center gap-2 rounded-full border border-amber-400/30 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
      <span className="live-dot h-2 w-2 rounded-full bg-amber-400" /> Coming soon
    </span>
    <h1 className="reveal font-display text-6xl font-extrabold leading-[0.95] text-white sm:text-8xl" style={{ '--d': '120ms' } as React.CSSProperties}>
      {title}
    </h1>
  </div>
);

export default ComingSoonPage;
