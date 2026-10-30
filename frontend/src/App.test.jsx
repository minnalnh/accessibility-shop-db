import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the shop header', () => {
  render(<App />);
  expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
});
