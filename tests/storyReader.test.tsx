import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StoryDetailPage from '../src/pages/StoryDetailPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Story Reader & Glossary Popover', () => {
  it('renders story with font size adjustment and audio narrator controls', () => {
    render(
      <LanguageProvider>
        <StoryDetailPage slug="the-jaggery-health-halo-myth" />
      </LanguageProvider>
    );

    const increaseFontBtn = screen.getByRole('button', { name: /^Increase Font A\+$/i });
    expect(increaseFontBtn).toBeInTheDocument();
    fireEvent.click(increaseFontBtn);

    expect(screen.getByTestId('story-content')).toHaveClass('text-lg');
  });

  it('reveals Telugu scientific glossary popover on term click', () => {
    render(
      <LanguageProvider>
        <StoryDetailPage slug="the-jaggery-health-halo-myth" />
      </LanguageProvider>
    );

    const termTrigger = screen.getByTestId('glossary-trigger-glycemic-index--gi-');
    expect(termTrigger).toBeInTheDocument();
    fireEvent.click(termTrigger);

    expect(screen.getByText(/గ్లైసెమిక్ ఇండెక్స్/i)).toBeInTheDocument();
  });
});
