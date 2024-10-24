import { render, screen } from '@testing-library/react';
import Chat from './Chat';

test("renders load message while messages are being retrieved", () => {
	const { getByText } = render(<Chat isOpen={true} />);
	expect(getByText("Loading...")).toBeInTheDocument();
});