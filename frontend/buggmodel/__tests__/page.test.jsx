import { render, screen } from '@testing-library/react';
import Home from '../app/page';

test('renders ClayComponent', () => {
  render(<Home />);
  const clayComponentElement = screen.getByTestId('clay-component');
  expect(clayComponentElement).toBeInTheDocument();
});