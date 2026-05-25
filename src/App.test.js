import { render, screen } from '@testing-library/react';
import App from './App';
import fetchModel from './lib/fetchModelData';

jest.mock('./lib/fetchModelData');

beforeEach(() => {
  fetchModel.mockImplementation((url) => {
    if (url === '/admin/current') {
      return Promise.reject(new Error('Not logged in'));
    }

    return Promise.resolve(null);
  });
});

test('renders login view when no user is logged in', async () => {
  window.history.pushState({}, '', '/users');
  render(<App />);

  expect(screen.getByText(/le duy hung/i)).toBeInTheDocument();
  expect((await screen.findAllByLabelText(/login name/i)).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/please login/i).length).toBeGreaterThan(0);
});
