import { render, screen } from '@testing-library/react';
import App from './App';
import fetchModel from './lib/fetchModelData';

jest.mock('./lib/fetchModelData');

const users = [
  {
    _id: '57231f1a30e4351f4e9f4bd7',
    first_name: 'Ian',
    last_name: 'Malcolm',
    occupation: 'Mathematician',
  },
];

beforeEach(() => {
  fetchModel.mockImplementation((url) => {
    if (url === '/user/list') {
      return Promise.resolve(users);
    }

    return Promise.resolve(null);
  });
});

test('renders photo sharing app shell', async () => {
  window.history.pushState({}, '', '/users');
  render(<App />);

  expect(screen.getByText(/le duy hung/i)).toBeInTheDocument();
  expect(screen.getAllByText(/users/i).length).toBeGreaterThan(0);
  expect(await screen.findAllByText(/ian malcolm/i)).toHaveLength(2);
});
