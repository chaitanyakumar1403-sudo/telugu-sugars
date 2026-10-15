import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import SafetyCheck from '../src/components/atlas/SafetyCheck';

const Harness = () => {
  const [sel, setSel] = useState('maltodextrin');
  return <SafetyCheck checkSel={sel} onPick={setSel} />;
};

describe('SafetyCheck picker', () => {
  it('closes the list after picking and shows the result', () => {
    Element.prototype.scrollIntoView = () => {};
    render(<Harness />);
    const item = screen.getAllByRole('button').find((b) => b.textContent === 'Aspartame (E951)')!;
    fireEvent.click(item);
    expect(screen.getByRole('heading', { level: 2, name: 'Aspartame (E951)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Aspartame \(E951\).*Change/ })).toBeInTheDocument();
    expect(screen.queryAllByRole('button').find((b) => b.textContent === 'Sucralose (E955)')).toBeUndefined();
  });
});
