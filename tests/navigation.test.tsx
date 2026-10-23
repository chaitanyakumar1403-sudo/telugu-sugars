import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageProvider } from '../src/context/LanguageContext';
import Header from '../src/components/common/Header';

describe('Navigation & Bilingual Switcher', () => {
  it('switches language between English and Telugu', () => {
    const onNavigate = vi.fn();

    render(
      <LanguageProvider>
        <Header activePath="/" onNavigate={onNavigate} />
      </LanguageProvider>
    );

    const langBtn = screen.getByRole('button', { name: /switch to telugu|తెలుగు/i });
    expect(langBtn).toBeInTheDocument();
    fireEvent.click(langBtn);

    // The nav shows translated labels
    expect(screen.getAllByText(/పరిశోధన/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/వీడియోలు/i).length).toBeGreaterThan(0);
  });

  it('triggers navigation when links are clicked', () => {
    const onNavigate = vi.fn();

    render(
      <LanguageProvider>
        <Header activePath="/" onNavigate={onNavigate} />
      </LanguageProvider>
    );

    const watchBtn = screen.getByRole('button', { name: /watch|వీడియోలు/i });
    fireEvent.click(watchBtn);
    expect(onNavigate).toHaveBeenCalledWith('/watch');
  });
});
