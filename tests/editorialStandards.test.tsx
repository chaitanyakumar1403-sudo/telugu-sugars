import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EditorialStandardsPage from '../src/pages/EditorialStandardsPage';
import ConsentBanner from '../src/components/common/ConsentBanner';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Editorial Standards & Privacy Consent (PDF Sections 8 & 9)', () => {
  it('displays peer review workflow, conflict of interest policy, and correction process', () => {
    render(
      <LanguageProvider>
        <EditorialStandardsPage />
      </LanguageProvider>
    );

    expect(screen.getByText(/Editorial & Scientific Standards/i)).toBeInTheDocument();
    expect(screen.getByText(/Conflict of Interest Disclosure/i)).toBeInTheDocument();
    expect(screen.getByText(/Formal Corrections Policy/i)).toBeInTheDocument();
  });

  it('respects user consent choices with plain-language explanation', () => {
    render(<ConsentBanner />);
    const acceptBtn = screen.getByRole('button', { name: /accept preferences/i });
    expect(acceptBtn).toBeInTheDocument();
    fireEvent.click(acceptBtn);
    expect(localStorage.getItem('telugusugars_consent')).toBeTruthy();
  });
});
