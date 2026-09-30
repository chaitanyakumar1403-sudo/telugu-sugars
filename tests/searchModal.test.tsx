import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchModal from '../src/components/search/SearchModal';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Global Search Modal (PDF Section 5)', () => {
  it('displays query suggestions and filters results across stories, claims, and papers', () => {
    const onNavigate = vi.fn();
    const onClose = vi.fn();

    render(
      <LanguageProvider>
        <SearchModal isOpen={true} onClose={onClose} onNavigate={onNavigate} />
      </LanguageProvider>
    );

    // Initial state shows suggested queries
    expect(screen.getByText(/Suggested Clinical Queries/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search articles, studies, food labels/i);
    fireEvent.change(searchInput, { target: { value: 'Sugar' } });

    expect(screen.getAllByTestId('search-result-item').length).toBeGreaterThan(0);
  });
});
