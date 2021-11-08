import React from 'react';
import { render } from 'test-utils';
import { SelectedKeywords } from './SelectedKeywords';
import locale from '../../../locale/components';

const setup = state => {
    return render(<SelectedKeywords {...{ onKeywordDelete: () => {}, ...state }} />);
};

describe('SelectedKeywords', () => {
    it('should render with title', () => {
        const { getByText } = setup({
            keywords: [{ type: 'type1', text: 'cats' }],
        });
        expect(getByText(locale.components.journalSearch.selectedKeywords.title)).toBeInTheDocument();
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
});
