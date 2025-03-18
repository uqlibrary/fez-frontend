import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import { SearchKeywordsList } from './SearchKeywordsList';

const setup = state => {
    return render(
        <WithReduxStore>
            <SearchKeywordsList {...{ onKeywordClick: () => {}, ...state }} />
        </WithReduxStore>,
    );
};

const keywordsListTitle = 'test';
const keywordsType = 'title';
describe('SearchKeywordsList', () => {
    it('should render with given title', () => {
        const { getByText } = setup({
            keywordsListTitle,
            keywordsType,
            keywordsList: [],
        });
        expect(getByText(keywordsListTitle)).toBeInTheDocument();
    });

    it('should render available keywords', () => {
        const keywordsList = [
            {
                keyword: 'test1',
            },
            {
                keyword: 'test2',
            },
        ];
        const { getByText } = setup({
            keywordsListTitle,
            keywordsList,
            keywordsType,
        });
        keywordsList.forEach(keyword => {
            expect(getByText(keyword.keyword)).toBeInTheDocument();
        });
    });
});
