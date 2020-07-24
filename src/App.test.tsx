/* eslint-disable */
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import componentStore from './store/componentStore';


test('renders learn react link', () => {
  const { getByText } = render(<App componentStore={componentStore} />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
