import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import { ExactMatchSearchKeywordsList } from './ExactMatchSearchKeywordsList';

const setup = state => {
    return render(
        <WithReduxStore>
            <ExactMatchSearchKeywordsList {...{ onKeywordClick: () => {}, ...state }} />
        </WithReduxStore>,
    );
};

const keywordsListTitle = 'test';
describe('ExactMatchSearchKeywordsList', () => {
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
                keyword: 'cats',
                title: 'pid 1',
                href: 'https://espace.library.uq.edu.au/view/UQ:1',
            },
            {
                keyword: 'dogs',
                title: 'pid 2',
                href: 'https://espace.library.uq.edu.au/view/UQ:2',
            },
        ];
        const { getByText } = setup({
            keywordsListTitle,
            keywordsList,
        });
        keywordsList.forEach(keyword => {
            expect(getByText(keyword.keyword)).toHaveAttribute('href', `${keyword.href}?fromSearch=true`);
        });
    });
});
