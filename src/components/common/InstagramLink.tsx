import React from 'react';

export const INSTAGRAM_HANDLE = 'telugusugars.in';
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

// lucide-react v1 dropped brand icons, so the glyph is inlined
export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

/** Opens the brand's Instagram profile in a new tab (the app on phones). */
export const InstagramLink: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
  </a>
);

export default InstagramLink;
