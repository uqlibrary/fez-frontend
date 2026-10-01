import { renderHook, act } from 'test-utils';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { exportJournals } from 'actions/journals';
import { getDefaultOperand } from 'helpers/journalSearch';
import {
    isValidKeyword,
    filterNonValidKeywords,
    getKeywordKey,
    useSelectedKeywords,
    useSelectedJournals,
    buildJournalSearchQueryParams,
    useJournalSearch,
    useJournalSearchControls,
    useActiveFacetFilters,
} from './hooks';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock('actions/journals', () => ({
    exportJournals: jest.fn(payload => ({ type: 'EXPORT_JOURNALS', payload })),
}));

jest.mock('helpers/journalSearch', () => ({
    getDefaultOperand: jest.fn(() => 'AND'),
}));

describe('hooks', () => {
    describe('isValidKeyword', () => {
        it('should return true for non-keyword-shaped values', () => {
            expect(isValidKeyword({})).toBe(true);
            expect(isValidKeyword('text')).toBe(true);
        });

        it('should validate operand against allowed list', () => {
            const keyword = { id: '1', type: 'author', text: 'Smith', operand: 'AND' };
            expect(isValidKeyword(keyword)).toBe(true);
        });

        it('should invalidate an unknown operand', () => {
            const keyword = { id: '1', type: 'author', text: 'Smith', operand: 'NOT_REAL' };
            expect(isValidKeyword(keyword)).toBe(false);
        });
    });

    describe('filterNonValidKeywords', () => {
        it('should return empty object when input is not an object', () => {
            expect(filterNonValidKeywords(null)).toEqual({});
            expect(filterNonValidKeywords('abc')).toEqual({});
        });

        it('should keep only valid keywords', () => {
            const keywords = {
                a: { id: '1', type: 'author', text: 'Smith', operand: 'AND' },
                b: { id: '2', type: 'author', text: 'Doe', operand: 'INVALID' },
            };
            expect(filterNonValidKeywords(keywords)).toEqual({ a: keywords.a });
        });
    });

    describe('getKeywordKey', () => {
        it('should build key from cvoId when present', () => {
            expect(getKeywordKey({ type: 'subject', cvoId: '123' })).toBe('subject-123');
        });

        it('should build key from text with spaces replaced', () => {
            expect(getKeywordKey({ type: 'author', text: 'John Smith' })).toBe('author-John-Smith');
        });
    });

    describe('buildJournalSearchQueryParams', () => {
        it('should merge search with active facets, defaulting to empty objects', () => {
            expect(buildJournalSearchQueryParams({ q: 'test' })).toEqual({
                q: 'test',
                activeFacets: { filters: {}, ranges: {} },
            });
        });

        it('should use provided facet and range filters', () => {
            const filters = { subject: ['a'] };
            const ranges = { year: [2000, 2020] };
            expect(buildJournalSearchQueryParams({ q: 'test' }, filters, ranges)).toEqual({
                q: 'test',
                activeFacets: { filters, ranges },
            });
        });
    });

    describe('useSelectedKeywords', () => {
        it('should initialize with filtered keywords', () => {
            const { result } = renderHook(() => useSelectedKeywords({}));
            expect(result.current.selectedKeywords).toEqual({});
            expect(result.current.hasAnySelectedKeywords).toBe(false);
        });

        it('should add a keyword with a generated id and default operand', () => {
            const { result } = renderHook(() => useSelectedKeywords({}));

            act(() => {
                result.current.handleKeywordAdd({ type: 'author', text: 'Smith' });
            });

            expect(getDefaultOperand).toHaveBeenCalledWith('author');
            expect(result.current.selectedKeywords).toEqual({
                'author-Smith': { type: 'author', text: 'Smith', id: 'author-Smith', operand: 'AND' },
            });
            expect(result.current.hasAnySelectedKeywords).toBe(true);
        });

        it('should update an existing keyword', () => {
            const initial = { 'author-Smith': { id: 'author-Smith', type: 'author', text: 'Smith', operand: 'AND' } };
            const { result } = renderHook(() => useSelectedKeywords(initial));

            act(() => {
                result.current.handleKeywordUpdate({
                    id: 'author-Smith',
                    type: 'author',
                    text: 'Smith',
                    operand: 'OR',
                });
            });

            expect(result.current.selectedKeywords['author-Smith'].operand).toBe('OR');
        });

        it('should delete a keyword', () => {
            const initial = { 'author-Smith': { id: 'author-Smith', type: 'author', text: 'Smith', operand: 'AND' } };
            const { result } = renderHook(() => useSelectedKeywords(initial));

            act(() => {
                result.current.handleKeywordDelete({ id: 'author-Smith' });
            });

            expect(result.current.selectedKeywords).toEqual({});
            expect(result.current.hasAnySelectedKeywords).toBe(false);
        });
    });

    describe('useSelectedJournals', () => {
        const available = [{ jnl_jid: '1' }, { jnl_jid: '2' }];

        it('should initialize with provided state', () => {
            const { result } = renderHook(() => useSelectedJournals({ state: { 1: true }, available }));
            expect(result.current.selectedJournals).toEqual({ 1: true });
            expect(result.current.countSelectedJournals()).toBe(1);
        });

        it('should select all journals on toggle when none selected', () => {
            const { result } = renderHook(() => useSelectedJournals({ state: {}, available }));

            act(() => {
                result.current.handleToggleSelectAllJournals();
            });

            expect(result.current.selectedJournals).toEqual({ 1: true, 2: true });
            expect(result.current.isAllSelected).toBe(true);
        });

        it('should clear selection on toggle when all selected', () => {
            const { result } = renderHook(() => useSelectedJournals({ state: {}, available }));

            act(() => {
                result.current.handleToggleSelectAllJournals();
            });
            act(() => {
                result.current.handleToggleSelectAllJournals();
            });

            expect(result.current.selectedJournals).toEqual({});
            expect(result.current.isAllSelected).toBe(false);
        });

        it('should add a journal on checked change event', () => {
            const { result } = renderHook(() => useSelectedJournals({ state: {}, available }));

            act(() => {
                result.current.handleSelectedJournalsChange({ target: { checked: true, value: '1' } });
            });

            expect(result.current.selectedJournals).toEqual({ 1: true });
        });

        it('should mark isAllSelected true when the last journal is checked', () => {
            const { result } = renderHook(() => useSelectedJournals({ state: { 1: true }, available }));

            act(() => {
                result.current.handleSelectedJournalsChange({ target: { checked: true, value: '2' } });
            });

            expect(result.current.isAllSelected).toBe(true);
        });

        it('should remove a journal on unchecked change event', () => {
            const { result } = renderHook(() => useSelectedJournals({ state: { 1: true }, available }));

            act(() => {
                result.current.handleSelectedJournalsChange({ target: { checked: false, value: '1' } });
            });

            expect(result.current.selectedJournals).toEqual({});
            expect(result.current.isAllSelected).toBe(false);
        });
    });

    describe('useJournalSearch', () => {
        const navigate = jest.fn();

        beforeEach(() => {
            jest.clearAllMocks();
            useNavigate.mockReturnValue(navigate);
            useLocation.mockReturnValue({ search: '?q=test', key: 'loc-key' });
            getDefaultOperand.mockReturnValue('AND');
        });

        it('should parse query params from location search', () => {
            const { result } = renderHook(() => useJournalSearch());
            expect(result.current.journalSearchQueryParams.q).toBe('test');
            expect(result.current.locationKey).toBe('loc-key');
        });

        it('should navigate on search with a new query', () => {
            const { result } = renderHook(() => useJournalSearch('/journals'));

            act(() => {
                result.current.handleSearch({ q: 'new' }, { some: 'state' });
            });

            expect(navigate).toHaveBeenCalledWith(
                { pathname: '/journals', search: expect.stringContaining('q=new') },
                { state: { some: 'state' } },
            );
        });

        it('should bail out on a duplicate search request', () => {
            useLocation.mockReturnValue({ search: '?q=new', key: 'loc-key' });
            const { result } = renderHook(() => useJournalSearch('/journals'));

            act(() => {
                result.current.handleSearch({ q: 'new' });
            });

            expect(navigate).not.toHaveBeenCalled();
        });
    });

    describe('useJournalSearchControls', () => {
        const dispatch = jest.fn();
        const onSearch = jest.fn();
        const journalSearchQueryParams = { q: 'test' };

        beforeEach(() => {
            jest.clearAllMocks();
            useDispatch.mockReturnValue(dispatch);
        });

        const setup = () => renderHook(() => useJournalSearchControls(onSearch, journalSearchQueryParams, true, false));

        it('should dispatch exportJournals with format merged in', () => {
            const { result } = setup();

            act(() => {
                result.current.handleExport({ format: 'csv' });
            });

            expect(exportJournals).toHaveBeenCalledWith({ q: 'test', format: 'csv' }, true, false);
            expect(dispatch).toHaveBeenCalled();
        });

        it('should call onSearch resetting page on page size change', () => {
            const { result } = setup();

            act(() => {
                result.current.pageSizeChanged(50);
            });

            expect(onSearch).toHaveBeenCalledWith({ q: 'test', pageSize: 50, page: 1 });
        });

        it('should call onSearch with the requested page on page change', () => {
            const { result } = setup();

            act(() => {
                result.current.pageChanged(3);
            });

            expect(onSearch).toHaveBeenCalledWith({ q: 'test', page: 3 });
        });

        it('should call onSearch with sort params on sort change', () => {
            const { result } = setup();

            act(() => {
                result.current.sortByChanged('title', 'asc');
            });

            expect(onSearch).toHaveBeenCalledWith({ q: 'test', sortBy: 'title', sortDirection: 'asc' });
        });

        it('should call onSearch resetting page on facets change', () => {
            const { result } = setup();
            const activeFacets = { filters: { a: 1 } };

            act(() => {
                result.current.facetsChanged(activeFacets);
            });

            expect(onSearch).toHaveBeenCalledWith({ q: 'test', activeFacets: { ...activeFacets }, page: 1 });
        });
    });

    describe('useActiveFacetFilters', () => {
        it('should behave like useState, returning value and setter', () => {
            const { result } = renderHook(() => useActiveFacetFilters({ subject: [] }));
            const [state] = result.current;
            expect(state).toEqual({ subject: [] });

            act(() => {
                const [, setState] = result.current;
                setState({ subject: ['a'] });
            });

            expect(result.current[0]).toEqual({ subject: ['a'] });
        });
    });
});
