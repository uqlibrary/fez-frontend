import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import { ForCodeSearchKeywordsList } from './ForCodeSearchKeywordsList';
import Immutable from 'immutable';

const setup = state => {
    return render(
        <WithReduxStore initialState={Immutable.Map({})}>
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
                sources: [],
            },
            {
                keyword: 'Materials Science, Characterization & Testing 2',
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
