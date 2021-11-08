import React from 'react';
import { fireEvent, render } from 'test-utils';
import { SelectedKeywordItem } from './SelectedKeywordItem';

const setup = state => {
    return render(<SelectedKeywordItem {...state} />);
};

const keyword = { type: 'type1', text: 'dogs' };
describe('SelectedKeywordItem', () => {
    it('should render keyword data', () => {
        const { getByText } = setup({
            onKeywordDelete: () => {},
            keyword: keyword,
        });

        expect(getByText(`${keyword.type}:`)).toBeInTheDocument();
        expect(getByText(keyword.text)).toBeInTheDocument();
    });

    it('should call given onKeywordDelete on removal', () => {
        const onKeywordDelete = jest.fn();
        const { container } = setup({
            onKeywordDelete: onKeywordDelete,
            keyword: keyword,
        });

        fireEvent.click(container.querySelector('[class*="deleteIcon"]'));
        expect(onKeywordDelete).toHaveBeenCalledTimes(1);
    });
});
