import React from 'react';
import { render as defaultRender, waitFor } from 'test-utils';
import Manager from './Manager';
import { loadLists } from 'actions/journalUserLists';
import { locale } from '../../locale';

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

const setup = () => defaultRender(<Manager />);

describe('JournalUserLists', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show the loader while loading and not yet loaded once', () => {
        mockUseSelector.mockReturnValue({ loading: true, data: null, error: '' });
        loadLists.mockReturnValue(() => Promise.resolve());

        const { getByText, queryByTestId } = setup();

        expect(getByText(/loading/i)).toBeInTheDocument();
        expect(queryByTestId('mock-data-grid')).not.toBeInTheDocument();
    });

    it('should dispatch loadLists on mount', () => {
        mockUseSelector.mockReturnValue({ loading: false, data: null, error: '' });
        const thunk = jest.fn(() => Promise.resolve());
        loadLists.mockReturnValue(thunk);

        setup();

        expect(loadLists).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(thunk);
    });

    it('should render the page title and DataGrid once data is available', async () => {
        mockUseSelector.mockReturnValue({ loading: false, data: { data: [] }, error: '' });
        loadLists.mockReturnValue(() => Promise.resolve());
        const { getByTestId } = setup();

        expect(locale.pages.journalUserLists.title);
        await waitFor(() => expect(getByTestId('mock-data-grid')).toBeInTheDocument());
    });

    it('should stop showing loader after load completes even if data stays falsy', async () => {
        mockUseSelector.mockReturnValue({ loading: true, data: null, error: '' });
        loadLists.mockReturnValue(() => Promise.resolve());
        const { getByText } = setup();
        expect(getByText(/loading/i)).toBeInTheDocument();

        await waitFor(() => {
            mockUseSelector.mockReturnValue({ loading: false, data: null, error: '' });
        });
    });
});
