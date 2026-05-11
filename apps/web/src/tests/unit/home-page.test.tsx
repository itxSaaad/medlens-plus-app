import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from '../../app/page';

describe('Home page', () => {
  it('renders the starter heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading')).toHaveTextContent(/to get started/i);
  });
});
