import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';

// The site opens in Telugu for anyone who hasn't chosen; the tests check the English copy.
beforeEach(() => localStorage.setItem('telugusugars_lang', 'en'));

// Mock window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock window.scrollTo for JSDOM
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

// Mock HTMLCanvasElement.prototype.getContext for JSDOM
HTMLCanvasElement.prototype.getContext = (() => ({
  clearRect: () => {},
  beginPath: () => {},
  arc: () => {},
  fill: () => {},
  stroke: () => {},
  moveTo: () => {},
  lineTo: () => {},
  fillText: () => {},
  measureText: () => ({ width: 0 }),
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;
