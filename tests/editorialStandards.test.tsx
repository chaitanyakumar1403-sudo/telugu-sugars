import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EditorialStandardsPage from '../src/pages/EditorialStandardsPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Editorial standards', () => {
  it('explains who pays us, what counts as evidence, and how mistakes get fixed', () => {
    render(
      <LanguageProvider>
        <EditorialStandardsPage />
      </LanguageProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'How we work' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Who pays us' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'When we get something wrong' })).toBeInTheDocument();
  });
});
