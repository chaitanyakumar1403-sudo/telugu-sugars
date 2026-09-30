import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('Full Application Production Flow', () => {
  it('navigates seamlessly across all PDF URL patterns and verifies active views', () => {
    render(<App />);

    // 1. Initial render is Home Page with Inside-IMAX wordmark
    expect(screen.getByTestId('hero-wordmark')).toBeInTheDocument();

    // 2. Navigate to Research Explorer
    const researchLinks = screen.getAllByRole('button', { name: /research|పరిశోధన/i });
    fireEvent.click(researchLinks[0]);
    expect(screen.getByText(/Interactive Evidence Network/i)).toBeInTheDocument();

    // 3. Navigate to Food Labels
    const labelLinks = screen.getAllByRole('button', { name: /food labels|లేబుల్స్/i });
    fireEvent.click(labelLinks[0]);
    expect(screen.getByText(/Interactive Food Label Walkthrough/i)).toBeInTheDocument();

    // 4. Navigate to Watch
    const watchLinks = screen.getAllByRole('button', { name: /watch|వీడియోలు/i });
    fireEvent.click(watchLinks[0]);
    expect(screen.getByText(/Interactive Chapters/i)).toBeInTheDocument();

    // 5. Navigate to Standards
    const standardsLinks = screen.getAllByRole('button', { name: /standards|ప్రమాణాలు/i });
    fireEvent.click(standardsLinks[0]);
    expect(screen.getByText(/Editorial & Scientific Standards/i)).toBeInTheDocument();
  });
});
