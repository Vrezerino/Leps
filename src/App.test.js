import { render, screen } from '@testing-library/react';
import App from './App';

test('ladybug exists', () => {
  render(<App />);
  const ladybug = screen.getAllByAltText('ladybug')[0];
  expect(ladybug).toBeInTheDocument();
});
