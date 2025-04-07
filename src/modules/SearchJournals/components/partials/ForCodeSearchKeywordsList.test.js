import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import { ForCodeSearchKeywordsList } from './ForCodeSearchKeywordsList';

const setup = state => {
    return render(
        <WithReduxStore>
            <ForCodeSearchKeywordsList {...{ onKeywordClick: () => {}, ...state }} />
        </WithReduxStore>,
    );
};

const keywordsListTitle = 'test';
describe('ForCodeSearchKeywordsList', () => {
    it('should render without keywords', () => {
        const { getByText } = setup({
            keywordsListTitle,
            keywordsList: [],
        });
        expect(getByText(keywordsListTitle)).toBeInTheDocument();
    });

    it('should render available keywords', () => {
        const keywordsList = [
            {
                keyword: 'Materials Science, Characterization & Testing',
                cvoId: 12345,
                sources: [],
            },
            {
                keyword: 'Materials Science, Characterization & Testing 2',
                cvoId: 12345,
                sources: [],
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
