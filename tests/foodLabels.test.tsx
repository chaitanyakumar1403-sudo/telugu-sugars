import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FoodLabelsPage from '../src/pages/FoodLabelsPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Interactive Food Label Walkthrough', () => {
  it('renders mock packaging label with clickable hotspots for added sugars and serving size', () => {
    render(
      <LanguageProvider>
        <FoodLabelsPage />
      </LanguageProvider>
    );

    const hotspot = screen.getByTestId('hotspot-added-sugars');
    expect(hotspot).toBeInTheDocument();
    fireEvent.click(hotspot);

    expect(screen.getByText(/How Brands Disguise Added Sugars/i)).toBeInTheDocument();
  });
});
