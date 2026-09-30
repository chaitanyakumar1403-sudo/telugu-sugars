import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageProvider } from '../src/context/LanguageContext';
import Header from '../src/components/common/Header';
import MobileBottomNav from '../src/components/common/MobileBottomNav';

describe('Navigation & Bilingual Switcher', () => {
  it('switches language between English and Telugu', () => {
    const onNavigate = vi.fn();
    const onOpenSearch = vi.fn();

    render(
      <LanguageProvider>
        <Header activePath="/" onNavigate={onNavigate} onOpenSearch={onOpenSearch} />
        <MobileBottomNav activePath="/" onNavigate={onNavigate} />
      </LanguageProvider>
    );

    const langBtn = screen.getByRole('button', { name: /switch to telugu|తెలుగు/i });
    expect(langBtn).toBeInTheDocument();
    fireEvent.click(langBtn);

    // Both desktop and mobile nav display translated labels
    expect(screen.getAllByText(/పరిశోధన గ్రాఫ్/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/కథనాలు/i).length).toBeGreaterThan(0);
  });

  it('triggers navigation when links are clicked', () => {
    const onNavigate = vi.fn();
    const onOpenSearch = vi.fn();

    render(
      <LanguageProvider>
        <Header activePath="/" onNavigate={onNavigate} onOpenSearch={onOpenSearch} />
      </LanguageProvider>
    );

    const watchBtn = screen.getByRole('button', { name: /watch|వీడియోలు/i });
    fireEvent.click(watchBtn);
    expect(onNavigate).toHaveBeenCalledWith('/watch');
  });
});
