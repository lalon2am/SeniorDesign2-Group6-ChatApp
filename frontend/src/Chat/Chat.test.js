import { render, screen } from '@testing-library/react';
import { act } from 'react'
import Chat from './Chat';

test("renders load message while messages are being retrieved", () => {
	act(() => {
		render(<Chat isOpen={true} />)
	});
	expect(screen.getByText("Loading...")).toBeInTheDocument();
});