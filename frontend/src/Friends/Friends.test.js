import { render, screen, configure, fireEvent,waitFor } from '@testing-library/react';
import Friends from './Friends';
import {act} from 'react';
test('addfriend', async function() {
    
  const element = render(<Friends />);
  const container=element.container;
  const input = container.getElementsByClassName('my-input')[0];

  fireEvent.change(input, { target: { value: "Arjay lalonde" } });
  fireEvent.click(screen.getByText('Add'))
  
  await waitFor(() => {
    return Promise.race([
      container.findByText('Friend Added'),
      container.findByText('No friend found'),
      container.findByText('That is you'),
      container.findByText("You've already added that friend"),
    ]);
  }, { timeout: 5000 });
});



test('getfriends', async function() {
    
  const element = render(<Friends />);
  const container=element.container;
  //const input = container.getElementsByClassName('my-input')[0];
  
  expect(true)

});