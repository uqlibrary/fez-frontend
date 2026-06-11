import { renderHook, act } from 'test-utils';
import { useAutocompleteSuggestions } from './useAutocompleteSuggestions';

const mockFetchAutocompleteSuggestions = jest.fn();
const mockSessionToken = {};
const MockAutocompleteSessionToken = jest.fn(() => mockSessionToken);
const MockAutocompleteSuggestion = {
    fetchAutocompleteSuggestions: mockFetchAutocompleteSuggestions,
};

jest.mock('@vis.gl/react-google-maps', () => ({
    useMapsLibrary: jest.fn(),
}));

const { useMapsLibrary } = require('@vis.gl/react-google-maps');

const mockSuggestions = [
    { placePrediction: { placeId: '1', text: { text: 'Sydney, NSW' } } },
    { placePrediction: { placeId: '2', text: { text: 'Melbourne, VIC' } } },
];

const setup = (query = '') => renderHook(q => useAutocompleteSuggestions(q), { initialProps: query });

const runTimersAndFlush = async () =>
    // note: ignore redundant await warning
    await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
    });

describe('useAutocompleteSuggestions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        useMapsLibrary.mockReturnValue({
            AutocompleteSessionToken: MockAutocompleteSessionToken,
            AutocompleteSuggestion: MockAutocompleteSuggestion,
        });
        mockFetchAutocompleteSuggestions.mockResolvedValue({ suggestions: mockSuggestions });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return initial state', () => {
        const { result } = setup();

        expect(result.current.suggestions).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(typeof result.current.resetSession).toBe('function');
    });

    it('should not fetch when places library is not loaded', () => {
        useMapsLibrary.mockReturnValue(null);
        const { result } = setup('Sydney');
        act(() => jest.runAllTimers());

        expect(mockFetchAutocompleteSuggestions).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch when query is empty', () => {
        const { result } = setup('');
        act(() => jest.runAllTimers());

        expect(mockFetchAutocompleteSuggestions).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch when query is only whitespace', () => {
        setup('   ');
        act(() => jest.runAllTimers());

        expect(mockFetchAutocompleteSuggestions).not.toHaveBeenCalled();
    });

    it('should create a session token on first query', async () => {
        setup('Sydney');

        await runTimersAndFlush();
        expect(MockAutocompleteSessionToken).toHaveBeenCalledTimes(1);
    });

    it('should debounce fetch calls', async () => {
        const { rerender } = setup('S');
        rerender('Sy');
        rerender('Syd');
        rerender('Sydn');
        rerender('Sydney');
        expect(mockFetchAutocompleteSuggestions).not.toHaveBeenCalled();

        await runTimersAndFlush();
        expect(mockFetchAutocompleteSuggestions).toHaveBeenCalledTimes(1);
    });

    it('should set isLoading to false after fetching', async () => {
        const { result } = setup('Sydney');
        await runTimersAndFlush();

        expect(result.current.isLoading).toBe(false);
    });

    it('should set suggestions after successful fetch', async () => {
        const { result } = setup('Sydney');
        await runTimersAndFlush();

        expect(result.current.suggestions).toEqual(mockSuggestions);
    });

    it('should handle fetch failure', async () => {
        mockFetchAutocompleteSuggestions.mockImplementation(() => new Error('Network error'));
        const { result } = setup('Sydney');
        await runTimersAndFlush();

        expect(result.current.suggestions).toEqual([]);
    });

    it('should pass trimmed input to fetch', async () => {
        setup('  Sydney  ');
        await runTimersAndFlush();

        expect(mockFetchAutocompleteSuggestions).toHaveBeenCalledWith(expect.objectContaining({ input: 'Sydney' }));
    });

    it('should pass session token to fetch', async () => {
        setup('Sydney');
        await runTimersAndFlush();

        expect(mockFetchAutocompleteSuggestions).toHaveBeenCalledWith(
            expect.objectContaining({ sessionToken: mockSessionToken }),
        );
    });

    it('should reuse the same session token across multiple queries', async () => {
        const { rerender } = setup('Sydney');
        await runTimersAndFlush();
        rerender('Sydney NSW');
        await runTimersAndFlush();

        expect(MockAutocompleteSessionToken).toHaveBeenCalledTimes(1);
    });

    it('should clear suggestions when query becomes empty', async () => {
        const { result, rerender } = setup('Sydney');
        await runTimersAndFlush();
        expect(result.current.suggestions).toEqual(mockSuggestions);

        rerender('');
        await act(async () => await Promise.resolve());
        expect(result.current.suggestions).toEqual([]);
    });

    it('should reset session token and clear suggestions on resetSession', async () => {
        const { result } = setup('Sydney');
        await runTimersAndFlush();
        expect(result.current.suggestions).toEqual(mockSuggestions);

        act(() => result.current.resetSession());
        expect(result.current.suggestions).toEqual([]);
    });

    it('should create a new session token after resetSession', async () => {
        const { result, rerender } = setup('Sydney');
        await runTimersAndFlush();
        act(() => result.current.resetSession());
        MockAutocompleteSessionToken.mockClear();
        rerender('Melbourne');
        await runTimersAndFlush();

        expect(MockAutocompleteSessionToken).toHaveBeenCalledTimes(1);
    });
});
