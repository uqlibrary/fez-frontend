import React from 'react';
import { render } from 'test-utils';
import { SelectedKeywords } from './SelectedKeywords';
import locale from 'locale/components';

const setup = state => {
    return render(<SelectedKeywords {...{ onKeywordDelete: () => {}, ...state }} />);
};

describe('SelectedKeywords', () => {
    it('should render with title', () => {
        const { getByText } = setup({
            keywords: [{ type: 'type1', text: 'cats' }],
        });
        expect(getByText(locale.components.searchJournals.partials.selectedKeywords.title)).toBeInTheDocument();
    });

    it('should render available keywords', () => {
        const keywords = [
            { type: 'type1', text: 'cats' },
            { type: 'type2', text: 'dogs' },
        ];
        const { getByTestId } = setup({
            keywords: keywords,
        });
        keywords.forEach(keyword => {
            expect(getByTestId(`journal-search-chip-${keyword.type}-${keyword.text}`)).toBeInTheDocument();
        });
    });

    it('should render correct separators', () => {
        const keywords = [
            { type: 'Keyword', text: 'cats' },
            { type: 'Title', text: 'dogs' },
            { type: 'Subject', text: 'dogs' },
            { type: 'Keyword', text: 'dogs' },
        ];
        const { getByTestId } = setup({
            keywords: keywords,
        });
        expect(getByTestId('separator-0')).toHaveTextContent('OR');
        expect(getByTestId('separator-1')).toHaveTextContent('OR');
        expect(getByTestId('separator-2')).toHaveTextContent('AND');
    });
});
