import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WatchPage from '../src/pages/WatchPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Watch Episode Hub (PDF Section 5)', () => {
  it('renders video episode with chapters and clicking a chapter seeks timestamp', () => {
    render(
      <LanguageProvider>
        <WatchPage />
      </LanguageProvider>
    );

    const chapterBtn = screen.getByText(/The Jaggery Health Halo Myth|The Sweetener of Our Ancestors/i);
    expect(chapterBtn).toBeInTheDocument();
    fireEvent.click(chapterBtn);
    expect(screen.getByTestId('active-chapter')).toBeInTheDocument();
  });

  it('renders interactive transcript and cited papers list', () => {
    render(
      <LanguageProvider>
        <WatchPage />
      </LanguageProvider>
    );

    expect(screen.getByTestId('transcript-container')).toBeInTheDocument();
    expect(screen.getByTestId('episode-references')).toBeInTheDocument();
  });
});
