import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResearchPage from '../src/pages/ResearchPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Research Explorer Interaction Spec (PDF Section 6)', () => {
  it('renders central claim node and allows node click to open side drawer', () => {
    render(
      <LanguageProvider>
        <ResearchPage />
      </LanguageProvider>
    );

    const paperNode = screen.getByTestId('node-paper-1');
    expect(paperNode).toBeInTheDocument();
    fireEvent.click(paperNode);

    expect(screen.getByTestId('paper-drawer')).toBeInTheDocument();
    expect(screen.getByText(/Study Limitations/i)).toBeInTheDocument();
  });

  it('allows switching to linear accessible table view', () => {
    render(
      <LanguageProvider>
        <ResearchPage />
      </LanguageProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /table view|list view/i });
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
