import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import SafetyCheck from '../src/components/atlas/SafetyCheck';
import { LanguageProvider } from '../src/context/LanguageContext';

const Harness = () => {
  const [sel, setSel] = useState('maltodextrin');
  return <SafetyCheck checkSel={sel} onPick={setSel} />;
};

const renderPicker = () =>
  render(
    <LanguageProvider>
      <Harness />
    </LanguageProvider>,
  );

describe('SafetyCheck picker', () => {
  it('closes the list after picking and shows the result', () => {
    Element.prototype.scrollIntoView = () => {};
    renderPicker();
    const item = screen.getAllByRole('button').find((b) => b.textContent === 'Aspartame (E951)')!;
    fireEvent.click(item);
    expect(screen.getByRole('heading', { level: 2, name: 'Aspartame (E951)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Aspartame \(E951\).*Change/ })).toBeInTheDocument();
    expect(screen.queryAllByRole('button').find((b) => b.textContent === 'Sucralose (E955)')).toBeUndefined();
  });

  it('shows names, ages and notes in Telugu, and finds items by their Telugu name', () => {
    localStorage.setItem('telugusugars_lang', 'te');
    renderPicker();
    expect(screen.getByRole('heading', { level: 2, name: 'మాల్టోడెక్స్ట్రిన్' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'పసిపిల్లలు' })).toBeInTheDocument();
    expect(screen.getByText(/ఇంట్లో చేసే ఆహారంలో వేయొద్దు/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'బెల్లం' } });
    expect(screen.getAllByRole('button').some((b) => b.textContent === 'బెల్లం')).toBe(true);
    localStorage.removeItem('telugusugars_lang');
  });
});
