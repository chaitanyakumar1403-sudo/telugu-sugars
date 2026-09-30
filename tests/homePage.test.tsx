import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../src/pages/HomePage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('HomePage Hero and Interactive Wordmark', () => {
  it('renders the Inside-IMAX display wordmark and handles interaction toggle', () => {
    const onNavigate = vi.fn();
    render(
      <LanguageProvider>
        <HomePage onNavigate={onNavigate} />
      </LanguageProvider>
    );

    const wordmark = screen.getByTestId('hero-wordmark');
    expect(wordmark).toBeInTheDocument();
    fireEvent.mouseEnter(wordmark);
    expect(wordmark).toHaveClass('is-revealed');
  });

  it('renders evidence cards with "What the study found" and "What it cannot tell us"', () => {
    const onNavigate = vi.fn();
    render(
      <LanguageProvider>
        <HomePage onNavigate={onNavigate} />
      </LanguageProvider>
    );

    expect(screen.getAllByText(/What the study found/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/What it cannot tell us/i).length).toBeGreaterThan(0);
  });
});
