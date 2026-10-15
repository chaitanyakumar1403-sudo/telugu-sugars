import { describe, it, expect } from 'vitest';
import { youtubeId } from '../src/data/videos';

describe('youtubeId', () => {
  it('extracts the id from every common link shape', () => {
    for (const src of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s',
      'https://youtu.be/dQw4w9WgXcQ?si=abc',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      ' dQw4w9WgXcQ ',
    ]) expect(youtubeId(src)).toBe('dQw4w9WgXcQ');
  });
});
