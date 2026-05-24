import { render, screen } from '@testing-library/react';
import App from './App';

test('renders photo sharing app shell', () => {
  window.history.pushState({}, '', '/users');
  render(<App />);

  expect(screen.getByText(/le duy hung/i)).toBeInTheDocument();
  expect(screen.getAllByText(/users/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/ian malcolm/i).length).toBeGreaterThan(0);
});
