import React from 'react';
import { render } from 'test-utils';
import { ForCodeSearchKeyword } from './ForCodeSearchKeyword';

const setup = state => {
    return render(<ForCodeSearchKeyword {...{ onKeywordClick: () => {}, index: 0, ...state }} />);
};

const keyword = 'test';
const cvoId = 12345;
const sources = [
    {
        index: 'source-index-0',
        name: 'source-name-0',
    },
    {
        index: 'source-index-1',
        name: 'source-name-1',
    },
];
describe('ForCodeSearchKeyword', () => {
    it('should render', () => {
        const { getByText } = setup({
            keyword,
            cvoId,
            sources,
        });
        expect(getByText(keyword)).toBeInTheDocument();
    });

    it('should display all given sources', () => {
        const { getByText } = setup({
            keyword,
            cvoId,
            sources,
        });
        sources.forEach(source => {
            expect(getByText(source.index)).toBeInTheDocument();
            expect(getByText(source.name)).toBeInTheDocument();
        });
    });
});
