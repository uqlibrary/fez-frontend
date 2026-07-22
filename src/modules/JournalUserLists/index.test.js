import React from 'react';
import { assertNotToBeInTheDocument, render as defaultRender, waitFor } from 'test-utils';
import JournalUserLists from './index';
import { loadLists } from 'actions/journalUserLists';
import { locale } from 'locale';

jest.mock('actions/journalUserLists', () => ({
    loadLists: jest.fn(),
    createList: jest.fn(),
    updateList: jest.fn(),
    deleteList: jest.fn(),
}));

jest.mock('./DataGrid', () => ({
    DataGrid: () => <div data-testid="mock-data-grid" />,
}));

const mockDispatch = jest.fn().mockReturnValue(Promise.resolve());
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: (...args) => mockUseSelector(...args),
}));

const setup = () => defaultRender(<JournalUserLists />);

describe('JournalUserLists', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show the loader', () => {
        mockUseSelector.mockReturnValue({ loading: true, data: null, error: '' });
        loadLists.mockReturnValue(() => Promise.resolve());

        const { getByText } = setup();

        expect(getByText(/loading/i)).toBeInTheDocument();
        assertNotToBeInTheDocument('journal-user-lists-error');
        assertNotToBeInTheDocument('mock-data-grid');
    });

    it('should dispatch loadLists on mount', async () => {
        mockUseSelector.mockReturnValue({ loading: false, data: null, error: '' });
        const thunk = jest.fn(() => Promise.resolve());
        loadLists.mockReturnValue(thunk);

        const { getByTestId, getByText } = setup();

        expect(loadLists).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(thunk);
        await waitFor(() => expect(getByTestId('mock-data-grid')).toBeInTheDocument());
        expect(getByText(locale.pages.journalUserLists.title)).toBeInTheDocument();
    });

    it('should show error message when error is present', () => {
        const message = 'Something went wrong';
        mockUseSelector.mockReturnValue({ loading: false, data: null, error: { message } });

        const { getByTestId } = setup();

        expect(getByTestId('journal-user-lists-error')).toHaveTextContent(message);
    });
});
