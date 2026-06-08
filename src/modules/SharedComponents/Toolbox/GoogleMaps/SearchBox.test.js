import React from 'react';
import { render, waitFor } from 'test-utils';
import userEvent from '@testing-library/user-event';
import SearchBox from './SearchBox';

const mockFetchFields = jest.fn();
const mockSessionToken = {};
const MockAutocompleteSessionToken = jest.fn(() => mockSessionToken);

jest.mock('@vis.gl/react-google-maps', () => ({
    useMapsLibrary: jest.fn(),
}));

jest.mock('./useAutocompleteSuggestions', () => ({
    useAutocompleteSuggestions: jest.fn(),
}));

const { useMapsLibrary } = require('@vis.gl/react-google-maps');
const { useAutocompleteSuggestions } = require('./useAutocompleteSuggestions');

const mockResetSession = jest.fn();
const mockOnPlaceSelect = jest.fn();

const mockToPlace = jest.fn(() => ({ fetchFields: mockFetchFields }));

const mockSuggestions = [
    { placePrediction: { placeId: '1', text: { text: 'Sydney, NSW' }, toPlace: mockToPlace } },
    { placePrediction: { placeId: '2', text: { text: 'Melbourne, VIC' }, toPlace: mockToPlace } },
];

function setup(props = {}) {
    return render(<SearchBox onPlaceSelect={mockOnPlaceSelect} {...props} />);
}

describe('SearchBox', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useMapsLibrary.mockReturnValue({ AutocompleteSessionToken: MockAutocompleteSessionToken });
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: [],
            isLoading: false,
            resetSession: mockResetSession,
        });
        mockFetchFields.mockResolvedValue({});
    });

    it('should render default state', () => {
        const { getByPlaceholderText, queryByRole } = setup();

        expect(getByPlaceholderText('Search...')).toBeInTheDocument();
        expect(queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should show loading spinner when isLoading is true', () => {
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: [],
            isLoading: true,
            resetSession: mockResetSession,
        });
        const { getByRole } = setup();

        expect(getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show suggestions dropdown when input has value and suggestions exist', async () => {
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            resetSession: mockResetSession,
        });
        const { getByPlaceholderText, getByText } = setup();
        await userEvent.type(getByPlaceholderText('Search...'), 'Syd');

        expect(getByText('Sydney, NSW')).toBeInTheDocument();
    });

    it('should not show dropdown when input is empty', () => {
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            resetSession: mockResetSession,
        });
        const { queryByText } = setup();

        expect(queryByText('Sydney, NSW')).not.toBeInTheDocument();
    });

    it('should not show dropdown when there are no suggestions', async () => {
        const { getByPlaceholderText, queryByRole } = setup();
        await userEvent.type(getByPlaceholderText('Search...'), 'xyz');

        expect(queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should call onPlaceSelect and resetSession when a suggestion is clicked', async () => {
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            resetSession: mockResetSession,
        });
        const { getByPlaceholderText, getByText } = setup();

        await userEvent.type(getByPlaceholderText('Search...'), 'Syd');
        await userEvent.click(getByText('Sydney, NSW'));

        expect(mockToPlace).toHaveBeenCalled();
        expect(mockFetchFields).toHaveBeenCalledWith({
            fields: ['viewport', 'location', 'svgIconMaskURI', 'iconBackgroundColor'],
        });
        await waitFor(() => expect(mockOnPlaceSelect).toHaveBeenCalled());
        expect(mockResetSession).toHaveBeenCalled();
    });

    it('should clear input value after selecting a suggestion', async () => {
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            resetSession: mockResetSession,
        });
        const { getByPlaceholderText, getByText } = setup();

        const input = getByPlaceholderText('Search...');
        await userEvent.type(input, 'Syd');
        await userEvent.click(getByText('Sydney, NSW'));

        await waitFor(() => expect(input.value).toBe(''));
    });

    it('should not call resetSession when selection is cleared', async () => {
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            resetSession: mockResetSession,
        });
        const { getByPlaceholderText } = setup();

        const input = getByPlaceholderText('Search...');
        await userEvent.type(input, 'Syd');
        await userEvent.clear(input);

        expect(mockResetSession).not.toHaveBeenCalled();
    });

    it('should correctly compare options by placeId', async () => {
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            resetSession: mockResetSession,
        });
        const { getByPlaceholderText, getByText } = setup();

        const input = getByPlaceholderText('Search...');
        await userEvent.type(input, 'Syd');
        await userEvent.click(getByText('Sydney, NSW'));
        await userEvent.type(input, 'Syd');

        await waitFor(() => expect(input.value).toBe('Syd'));
    });

    it('should not call onPlaceSelect when places library is not loaded', async () => {
        useMapsLibrary.mockReturnValue(null);
        useAutocompleteSuggestions.mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            resetSession: mockResetSession,
        });
        const { getByPlaceholderText, getByText } = setup();

        await userEvent.type(getByPlaceholderText('Search...'), 'Syd');
        await userEvent.click(getByText('Sydney, NSW'));

        expect(mockOnPlaceSelect).not.toHaveBeenCalled();
    });
});
