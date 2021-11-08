import React from 'react';
import { fireEvent, render } from 'test-utils';
import { getId, SearchKeyword } from './SearchKeyword';

const setup = state => {
    return render(<SearchKeyword {...{ onKeywordClick: () => {}, ...state }} />);
};

const keyword = 'test';
const variant = 'default';
const index = 0;

describe('SearchKeyword', () => {
    it('should render', () => {
        const { getByText } = setup({
            keyword,
            onKeywordClick: () => {},
            variant,
            index,
        });
        expect(getByText(keyword)).toBeInTheDocument();
    });

    it('should render for non default variant', () => {
        const { getByText } = setup({
            keyword,
            onKeywordClick: () => {},
            index,
        });
        expect(getByText(keyword)).toBeInTheDocument();
    });

    it('should render for non string keywords', () => {
        const element = <>{keyword}</>;
        const { getByText } = setup({
            keyword: element,
            onKeywordClick: () => {},
            variant,
            index,
        });
        expect(getByText(keyword)).toBeInTheDocument();
    });

    it('should call given onKeywordClick when clicked', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            keyword: keyword,
            onKeywordClick: onKeywordClick,
            variant,
            index,
        });
        fireEvent.click(getByTestId(getId(keyword, variant, index)));
        expect(onKeywordClick).toHaveBeenCalledTimes(1);
    });
});
