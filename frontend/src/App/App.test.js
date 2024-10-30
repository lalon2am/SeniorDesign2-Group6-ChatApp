import { render, screen } from '@testing-library/react';
import { getAuth } from 'firebase/auth';
import App from './App';

jest.mock('firebase/auth');

test('renders learn react link', async () => {
  getAuth.mockReturnValue({
    currentUser: { uid: 'test-uid', email: 'test@example.com' },
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: 'test-uid', email: 'test@example.com' }); // Simulate a logged-in user
      // Return a mock unsubscribe function
      return jest.fn();
    }),
  });
  render(<App />);
  const linkElement = screen.getByTestId('app-container');
  expect(linkElement).toBeInTheDocument();
});
