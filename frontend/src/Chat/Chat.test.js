import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react'
import Chat from './Chat';

const messages = [
	{ id: 1, sender: 'test', text: 'Hello', timestamp: new Date('2024-01-01T14:30:00.000Z').getTime() },
	{ id: 2, sender: 'test2', text: 'How are you?', timestamp: new Date('2024-01-01T15:30:00.000Z').getTime() }
];
beforeEach(() => {
	global.fetch = jest.fn(() =>
		new Promise(resolve =>
			setTimeout(() => resolve({
				ok: true,
				json: () => Promise.resolve(messages),
			}), 100) // Add a delay to simulate loading state
		)
	);
});

afterEach(() => {
	jest.restoreAllMocks();
});

test('renders load message while messages are being retrieved', async () => {
	await act(async () => {
		render(<Chat isOpen={true} />)
	});
	expect(screen.getByText('Loading...')).toBeInTheDocument();

	await waitFor(() => {
		expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
	})
});

test('renders error message when messages are not retrieved', async () => {
	global.fetch = jest.fn(() => new Promise((_, reject) => setTimeout(() => reject(new Error('Failed to fetch')), 100)));
	await act(async () => {
		render(<Chat isOpen={true} />)
	});
	expect(screen.getByText('Loading...')).toBeInTheDocument();

	await waitFor(() => {
		expect(screen.getByText('Unable to load messages at this time.')).toBeInTheDocument();
	})
});

test('calls load message when component is opened', async () => {
	await act(async () => {
		render(<Chat isOpen={true} />);
	});
	expect(global.fetch).toHaveBeenCalledTimes(1);

	await waitFor(() => {
		expect(screen.getByText(messages[0].text)).toBeInTheDocument();
		expect(screen.getByText(messages[1].text)).toBeInTheDocument();
	});

	global.fetch.mockRestore();
});