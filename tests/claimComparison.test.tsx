import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ClaimComparison from '../src/components/topics/ClaimComparison';
import { getClaims } from '../src/services/contentService';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Compare Two Claims View (PDF Section 5)', () => {
  it('renders comparative matrix showing what evidence supports, limits, and remains unknown', () => {
    const claims = getClaims();
    render(
      <LanguageProvider>
        <ClaimComparison claims={claims} />
      </LanguageProvider>
    );

    expect(screen.getByText(/What Evidence Supports/i)).toBeInTheDocument();
    expect(screen.getByText(/Where Evidence Reaches Its Limits/i)).toBeInTheDocument();
    expect(screen.getByText(/What Remains Unknown/i)).toBeInTheDocument();
  });
});
