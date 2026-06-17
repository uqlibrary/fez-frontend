import React from 'react';
import { act, fireEvent, within, render, waitForElementToBeRemoved, WithReduxStore, WithRouter } from 'test-utils';
import { id, JournalSearchInterface } from './JournalSearchInterface';

const setup = state => {
    return render(
        <WithRouter>
            <WithReduxStore>
                <JournalSearchInterface
                    {...{
                        handleKeywordDelete: jest.fn(),
                        handleKeywordAdd: jest.fn(),
                        handleKeywordUpdate: jest.fn(),
                        ...state,
                    }}
                />
            </WithReduxStore>
        </WithRouter>,
    );
};

const mocks = {};
describe('JournalSearchInterface', () => {
    afterEach(() => {
        Object.keys(mocks).map(name => mocks[name].mockRestore());
    });

    it('should render when keywords have been changed', async () => {
        jest.useFakeTimers();
        const keywords = {
            'Keyword-testing': {
                type: 'Keyword',
                text: 'testing',
                id: 'Keyword-testing',
            },
        };
        mocks.useRef = jest.spyOn(React, 'useRef');
        mocks.useRef.mockImplementation(() => ({
            current: {
                ...keywords,
                'Title-Testing': {
                    type: 'Title',
                    text: 'Testing',
                    id: 'Title-Testing',
                },
            },
        }));
        const { queryByTestId } = setup({
            hasAnySelectedKeywords: true,
            showInputControls: false,
            selectedKeywords: keywords,
        });
        expect(queryByTestId(`${id}-search-input`)).not.toBeInTheDocument();
        expect(queryByTestId(`${id}-selected-keywords`)).toBeInTheDocument();
        expect(queryByTestId(`${id}-keywords-browser`)).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-favourite-journals-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-browse-all-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-snackbar')).toBeInTheDocument();
        expect(queryByTestId('journal-search-clear-keywords-button')).toBeInTheDocument();
        act(() => {
            jest.runAllTimers();
        });
        await waitForElementToBeRemoved(queryByTestId('journal-search-snackbar')).then(() =>
            expect(queryByTestId('journal-search-snackbar')).not.toBeInTheDocument(),
        );
    });

    it('should render', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId(`${id}-search-input`)).toBeInTheDocument();
        expect(queryByTestId(`${id}-selected-keywords`)).not.toBeInTheDocument();
        expect(queryByTestId(`${id}-keywords-browser`)).toBeInTheDocument();
        expect(queryByTestId('journal-search-favourite-journals-button')).toBeInTheDocument();
        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();
        expect(queryByTestId('journal-search-button')).toBeDisabled();
        expect(queryByTestId('journal-search-snackbar')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-clear-keywords-button')).not.toBeInTheDocument();
    });

    it('should render when there are selected keywords', () => {
        const { queryByTestId } = setup({
            hasAnySelectedKeywords: true,
            selectedKeywords: {
                'Keyword-testing': {
                    type: 'Keyword',
                    text: 'testing',
                    id: 'Keyword-testing',
                },
                'Title-Testing': {
                    type: 'Title',
                    text: 'Testing',
                    id: 'Title-Testing',
                },
            },
        });
        expect(queryByTestId(`${id}-search-input`)).toBeInTheDocument();
        expect(queryByTestId(`${id}-selected-keywords`)).toBeInTheDocument();
        expect(queryByTestId(`${id}-keywords-browser`)).toBeInTheDocument();
        expect(queryByTestId('journal-search-favourite-journals-button')).toBeInTheDocument();
        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();
        expect(queryByTestId('journal-search-button')).not.toBeDisabled();
        expect(queryByTestId('journal-search-snackbar')).not.toBeInTheDocument();
        expect(queryByTestId('add-to-subject-selection-button')).not.toBeInTheDocument();
    });
    it('should not render clear button when there are no selected keywords', () => {
        const { queryByTestId } = setup({
            hasAnySelectedKeywords: false,
            selectedKeywords: {},
        });

        expect(queryByTestId('journal-search-snackbar')).not.toBeInTheDocument();
    });

    it('should render when keywords search has been done', () => {
        const { queryByTestId } = setup({
            hasAnySelectedKeywords: true,
            showInputControls: false,
            selectedKeywords: {
                'Keyword-testing': {
                    type: 'Keyword',
                    text: 'testing',
                    id: 'Keyword-testing',
                },
                'Title-Testing': {
                    type: 'Title',
                    text: 'Testing',
                    id: 'Title-Testing',
                },
            },
        });
        expect(queryByTestId(`${id}-search-input`)).not.toBeInTheDocument();
        expect(queryByTestId(`${id}-selected-keywords`)).toBeInTheDocument();
        expect(queryByTestId(`${id}-keywords-browser`)).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-favourite-journals-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-browse-all-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-button')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-snackbar')).not.toBeInTheDocument();
        expect(queryByTestId('journal-search-clear-keywords-button')).toBeInTheDocument();
    });

    it('should call handleKeywordUpdate when changing operand', () => {
        const mockHandleKeywordUpdateFn = jest.fn();
        const keyword = { type: 'Title', text: 'Testing', id: 'Title-Testing' };
        const { getByRole, getByTestId } = setup({
            hasAnySelectedKeywords: true,
            showInputControls: false,
            selectedKeywords: {
                'Keyword-testing': {
                    type: 'Keyword',
                    text: 'testing',
                    id: 'Keyword-testing',
                },
                'Title-Testing': { ...keyword },
            },
            handleKeywordUpdate: mockHandleKeywordUpdateFn,
        });

        fireEvent.click(getByTestId('operand-chip-title-testing'));
        fireEvent.click(within(getByRole('menu')).getByText('AND'));
        expect(mockHandleKeywordUpdateFn).toHaveBeenCalledWith({ ...keyword, operand: 'AND' });
    });

    it('should call setSelectedKeywords function with empty object when clear button clicked', () => {
        const keywords = {
            'Keyword-testing': {
                type: 'Keyword',
                text: 'testing',
                id: 'Keyword-testing',
            },
        };
        const mockHandleKeywordResetFn = jest.fn();
        const { queryByTestId } = setup({
            hasAnySelectedKeywords: true,
            showInputControls: false,
            selectedKeywords: keywords,
            handleKeywordReset: mockHandleKeywordResetFn,
        });
        expect(queryByTestId('journal-search-clear-keywords-button')).toBeInTheDocument();

        act(() => {
            fireEvent.click(queryByTestId('journal-search-clear-keywords-button'));
        });

        expect(mockHandleKeywordResetFn).toHaveBeenCalled();
    });

    it('should call the Search All Journals function when button is clicked', () => {
        const mockHandleSearchAllJournalsFn = jest.fn();
        const { queryByTestId } = setup({
            showInputControls: true,
            onSearchAll: mockHandleSearchAllJournalsFn,
        });

        expect(queryByTestId('journal-search-browse-all-button')).toBeInTheDocument();

        act(() => {
            fireEvent.click(queryByTestId('journal-search-browse-all-button'));
        });

        expect(mockHandleSearchAllJournalsFn).toHaveBeenCalled();
    });
});
