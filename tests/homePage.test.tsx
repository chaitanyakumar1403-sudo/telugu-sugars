import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../src/pages/HomePage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('HomePage Hero and Interactive Wordmark', () => {
  it('renders the running wordmark and turns it orange on hover', () => {
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

  it('shows only feature names and both video chapters', () => {
    const onNavigate = vi.fn();
    render(
      <LanguageProvider>
        <HomePage onNavigate={onNavigate} />
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { name: 'How it started' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How it’s going' })).toBeInTheDocument();
    expect(screen.getByText(/Coming soon/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Food Labels/ }));
    expect(onNavigate).toHaveBeenCalledWith('/food-labels');
    expect(screen.queryByText(/Jaggery Illusion/i)).not.toBeInTheDocument();
  });
});
