/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import realm from '../app/db';

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))
jest.mock('NativeAnimatedHelper')

it('renders correctly', () => {
  renderer.create(<App />);
  realm.close()
});
