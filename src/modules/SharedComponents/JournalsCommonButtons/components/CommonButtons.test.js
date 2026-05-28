import React from 'react';
import { render, WithRouter, fireEvent } from 'test-utils';
import { CommonButtons } from '../index';

const mockUseNavigate = jest.fn();
const mockUseLocation = { pathname: '/' };

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockUseNavigate,
    useLocation: () => mockUseLocation,
}));

const setup = ({ state = {}, initialEntries = ['/'] } = {}) => {
    return render(
        <WithRouter initialEntries={initialEntries}>
            <CommonButtons {...state} />
        </WithRouter>,
    );
};

describe('CommonButtons', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
    });
    it('should render', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('journal-search-favourite-journals-button')).toBeInTheDocument();
        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();
    });

    it('should not render Search All Journals button with prop "browseAllJournals:true"', () => {
        const { queryByTestId } = setup({ state: { browseAllJournals: true } });
        expect(queryByTestId('journal-search-favourite-journals-button')).toBeInTheDocument();
        expect(queryByTestId('journal-search-browse-all-button')).not.toBeInTheDocument();
    });

    it('should change URL when Favourite Journals button pressed', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('journal-search-favourite-journals-button')).toBeInTheDocument();

        fireEvent.click(queryByTestId('journal-search-favourite-journals-button'));

        expect(mockUseNavigate).toBeCalledWith('/journals/favourites/', { state: { prevLocation: { pathname: '/' } } });
    });

    it('should call supplied function when Search All Journals button pressed', () => {
        const mockHandleSearchAllJournalsFn = jest.fn();
        const { queryByTestId } = setup({ state: { onSearchAll: mockHandleSearchAllJournalsFn } });
        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();

        fireEvent.click(queryByTestId('journal-search-browse-all-button'));

        expect(mockHandleSearchAllJournalsFn).toHaveBeenCalled();
    });
});
