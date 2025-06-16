import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import { KeywordsList } from './KeywordsList';
import locale from '../../../../locale/components';

const setup = state => {
    return render(
        <WithReduxStore>
            <KeywordsList {...state} />
        </WithReduxStore>,
    );
};

const title = 'test';
const keyword = 'keyword';
const list = [<div key="0">{keyword}</div>];
const help = {
    tooltip: 'Test title',
    title: 'Title',
    text: {
        type: 'p',
        key: null,
        ref: null,
        props: {
            children: 'This is a test',
        },
        _owner: null,
        _store: {},
    },
    buttonLabel: 'Close',
};

describe('KeywordsList', () => {
    it('should render', () => {
        const { getByText } = setup({
            title,
            list,
            help,
        });
        expect(getByText(title)).toBeInTheDocument();
        expect(getByText(keyword)).toBeInTheDocument();
        expect(getByText(help.tooltip)).toBeInTheDocument();
    });
    it('should render when there is no help data', () => {
        const { getByText } = setup({
            title,
            list,
        });
        expect(getByText(title)).toBeInTheDocument();
        expect(getByText(keyword)).toBeInTheDocument();
    });
    it('should render when there are no list items', () => {
        const { getByText } = setup({
            title,
            list: [],
            help,
        });
        expect(getByText(locale.components.searchJournals.partials.keywordsList.noResultsFound)).toBeInTheDocument();
    });
});
