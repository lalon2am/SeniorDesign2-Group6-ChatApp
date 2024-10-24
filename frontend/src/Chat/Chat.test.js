import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react'
import Chat from './Chat';

test('renders load message while messages are being retrieved', () => {
	render(<Chat isOpen={true} />)
	expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('calls load message when component is opened', async () => {
	const messages = [
		{ id: 1, sender: 'test', text: 'Hello', timestamp: new Date('2024-01-01T14:30:00.000Z').getTime() },
		{ id: 2, sender: 'test2', text: 'How are you?', timestamp: new Date('2024-01-01T15:30:00.000Z').getTime() }
	];
	global.fetch = jest.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve(messages),
		})
	);

	const { container } = render(<Chat isOpen={true} />);
	expect(global.fetch).toHaveBeenCalledTimes(1);

	await waitFor(() => {
		const chatInstance = container.firstChild._reactInternalFiber.return.stateNode;
		expect(chatInstance.state.messages).toEqual(mockMessages);
	});

	global.fetch.mockRestore();
});