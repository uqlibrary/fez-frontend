import React from 'react';
import { render } from 'test-utils';
import { SearchKeywordsList } from './SearchKeywordsList';

const setup = state => {
    return render(<SearchKeywordsList {...{ onKeywordClick: () => {}, ...state }} />);
};

const keywordsListTitle = 'test';
describe('SearchKeywordsList', () => {
    it('should render with given title', () => {
        const { getByText } = setup({
            keywordsListTitle,
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
        });
        keywordsList.forEach(keyword => {
            expect(getByText(keyword.keyword)).toBeInTheDocument();
        });
    });
});
