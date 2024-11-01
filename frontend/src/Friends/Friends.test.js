import { render, screen, configure, fireEvent,waitFor } from '@testing-library/react';
import Friends from './Friends';
import {act} from 'react';



//GGG

beforeEach(() => {
	global.fetch = jest.fn(() =>
		new Promise(resolve =>
			setTimeout(() => resolve({
				ok: true,
				text: () => Promise.resolve("No friend found"),
			}), 100) // Add a delay to simulate loading state
		)
	);
});

afterEach(() => {
	jest.restoreAllMocks();
});

test('add friend', async () => {
    
    var element;
	await act(async () => {
		element=render(<Friends isOpen={true} />)
	});

    const container=element.container;
    const input = container.getElementsByClassName('my-input')[0];
  
    fireEvent.change(input, { target: { value: "Arjay lalonde" } });
    fireEvent.click(screen.getByText('Add'))
    
await waitFor(() => {
  // Check if any of the texts are present
  const friendAdded = screen.queryByText('Friend Added');
  const noFriendFound = screen.queryByText('No friend found');
  const thatIsYou = screen.queryByText('That is you');
  const alreadyAdded = screen.queryByText("You've already added that friend");

  // Return true if any of them are found
  return friendAdded || noFriendFound || thatIsYou || alreadyAdded;
}, { timeout: 4000 });
    screen.debug();
    
});

