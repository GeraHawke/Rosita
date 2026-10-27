import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Index from '../index';

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('Index (Login Screen)', () => {
});