import React from 'react';
import { render, act } from '@testing-library/react';
import { FormValidator } from './FormValidator';
import { useWatch } from 'react-hook-form';
import { validate } from 'config/admin';

// Mock dependencies
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useWatch: jest.fn(),
}));

jest.mock('config/admin', () => ({
    validate: jest.fn(),
}));

// Use fake timers to control debounce
jest.useFakeTimers();

describe('FormValidator Component', () => {
    let mockSetCustomErrors;
    let mockForm;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        mockSetCustomErrors = jest.fn();
        mockForm = {
            control: {}, // Mock control object for useWatch
            getValues: jest.fn(() => ({ rek_title: 'Test Title' })),
        };

        // Default mock return value for the validation function
        validate.mockReturnValue({ rek_title: 'Validation Error' });
    });

    it('should render nothing', () => {
        useWatch.mockReturnValue({});
        const { container } = render(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);
        expect(container.firstChild).toBeNull();
    });

    it('should not call validation immediately on first render', () => {
        useWatch.mockReturnValue({});
        render(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);
        expect(validate).not.toHaveBeenCalled();
        expect(mockSetCustomErrors).not.toHaveBeenCalled();
    });

    it('should trigger debounced validation after a form value changes', () => {
        // Initial render with some values
        useWatch.mockReturnValue({ rek_title: 'Initial' });
        const { rerender } = render(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);

        // Simulate a change by updating the value returned by useWatch and re-rendering
        useWatch.mockReturnValue({ rek_title: 'Updated' });
        rerender(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);

        // Immediately after the change, validation should not have been called yet
        expect(validate).not.toHaveBeenCalled();
        expect(mockSetCustomErrors).not.toHaveBeenCalled();

        // Fast-forward time by the debounce delay (500ms)
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Now, validation should have been called
        expect(validate).toHaveBeenCalledTimes(1);
        expect(validate).toHaveBeenCalledWith({ rek_title: 'Test Title' }); // It calls getValues()

        // And the state setter should have been called with the result
        expect(mockSetCustomErrors).toHaveBeenCalledTimes(1);
        expect(mockSetCustomErrors).toHaveBeenCalledWith({ rek_title: 'Validation Error' });
    });

    it('should cancel pending validation on unmount', () => {
        // Initial render
        useWatch.mockReturnValue({ rek_title: 'Initial' });
        const { rerender, unmount } = render(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);

        // Simulate a change
        useWatch.mockReturnValue({ rek_title: 'Updated' });
        rerender(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);

        // Unmount the component *before* the debounce timer fires
        unmount();

        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Because the component unmounted, the debounced call should have been cancelled
        expect(validate).not.toHaveBeenCalled();
        expect(mockSetCustomErrors).not.toHaveBeenCalled();
    });

    it('should only run the final validation after multiple rapid changes', () => {
        useWatch.mockReturnValue({ rek_title: 'A' });
        const { rerender } = render(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);

        // Simulate rapid changes
        useWatch.mockReturnValue({ rek_title: 'B' });
        rerender(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);
        act(() => {
            jest.advanceTimersByTime(100); // Not enough time to fire
        });

        useWatch.mockReturnValue({ rek_title: 'C' });
        rerender(<FormValidator form={mockForm} setCustomErrors={mockSetCustomErrors} />);
        act(() => {
            jest.advanceTimersByTime(100); // Still not enough
        });

        // Fast-forward past the debounce threshold
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // The validation should have only been called once for the latest state
        expect(validate).toHaveBeenCalledTimes(1);
        expect(mockSetCustomErrors).toHaveBeenCalledTimes(1);
    });
});
