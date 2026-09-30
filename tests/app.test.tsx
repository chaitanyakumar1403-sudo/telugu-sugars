import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Root', () => {
  it('renders the Telugu Sugars application container with luxury brand tokens', () => {
    render(<App />);
    expect(screen.getByTestId('telugusugars-root')).toBeInTheDocument();
  });
});
