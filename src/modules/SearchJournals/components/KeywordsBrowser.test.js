import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import { KeywordsBrowser } from './KeywordsBrowser';
import locale from '../../../locale/components';
import Immutable from 'immutable';
import { initialJournalSearchKeywords, initialState } from '../../../reducers/journals';

const setup = ({ storeState = {}, state } = {}) => {
    return render(
        <WithReduxStore
            initialState={Immutable.Map({
                journalReducer: {
                    ...initialState,
                    isInitialValues: false,
                    ...storeState,
                    journalSearchKeywords: { ...initialJournalSearchKeywords, ...storeState.journalSearchKeywords },
                },
            })}
        >
            <KeywordsBrowser {...{ onKeywordAdd: jest.fn(), ...state }} />
        </WithReduxStore>,
    );
};

const keyword = 'test';
describe('KeywordsBrowser', () => {
    it('should render empty', () => {
        const { queryByText } = setup({ storeState: { isInitialValues: true } });
        expect(
            queryByText(locale.components.searchJournals.partials.keywordsBrowser.titlePrefix),
        ).not.toBeInTheDocument();
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.title)).not.toBeInTheDocument();
    });

    it('should render with exactMatch', () => {
        const { queryByText } = setup({
            storeState: {
                journalSearchKeywords: {
                    exactMatch: [
                        {
                            keyword: `exactMatch ${keyword}`,
                            title: 'title',
                            href: 'href',
                        },
                    ],
                },
            },
        });
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.titlePrefix)).toBeInTheDocument();
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.title)).toBeInTheDocument();
        expect(queryByText(`exactMatch ${keyword}`)).toBeInTheDocument();
    });

    it('should render with keywordMatch', () => {
        const { queryByText } = setup({
            storeState: {
                journalSearchKeywords: {
                    keywordMatch: [
                        {
                            keyword: `keywordMatch ${keyword}`,
                        },
                    ],
                },
            },
        });
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.titlePrefix)).toBeInTheDocument();
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.title)).toBeInTheDocument();
        expect(queryByText(`keywordMatch ${keyword}`)).toBeInTheDocument();
    });

    it('should render with titleMatch', () => {
        const { queryByText } = setup({
            storeState: {
                journalSearchKeywords: {
                    titleMatch: [
                        {
                            keyword: `titleMatch ${keyword}`,
                        },
                    ],
                },
            },
        });
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.titlePrefix)).toBeInTheDocument();
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.title)).toBeInTheDocument();
        expect(queryByText(`titleMatch ${keyword}`)).toBeInTheDocument();
    });

    it('should render with subjectMatch', () => {
        const { queryByText } = setup({
            storeState: {
                journalSearchKeywords: {
                    subjectMatch: [
                        {
                            keyword: `subjectMatch ${keyword}`,
                            cvoId: 12345,
                            sources: [],
                        },
                    ],
                },
            },
        });
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.titlePrefix)).toBeInTheDocument();
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.title)).toBeInTheDocument();
        expect(queryByText(`subjectMatch ${keyword}`)).toBeInTheDocument();
    });

    it('should render error', () => {
        const error = 'error';
        const { queryByText } = setup({
            storeState: {
                journalSearchKeywordsError: {
                    message: error,
                },
            },
        });
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.titlePrefix)).toBeInTheDocument();
        expect(queryByText(locale.components.searchJournals.partials.keywordsBrowser.title)).toBeInTheDocument();
        expect(queryByText(error)).toBeInTheDocument();
    });
});
