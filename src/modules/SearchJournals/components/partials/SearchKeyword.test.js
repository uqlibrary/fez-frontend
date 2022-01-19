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

    it('should call given onKeywordClick by pressing space bar', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            onKeywordClick: onKeywordClick,
            keyword: keyword,
            variant,
            index,
        });

        fireEvent.keyPress(getByTestId(getId(keyword, variant, index)), { charCode: 32, code: 'Space' });
        expect(onKeywordClick).toHaveBeenCalledTimes(1);
    });
    it('should call given onKeywordClick by pressing normal enter button', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            onKeywordClick: onKeywordClick,
            keyword: keyword,
            variant,
            index,
        });

        fireEvent.keyPress(getByTestId(getId(keyword, variant, index)), { charCode: 13, code: 'Enter' });
        expect(onKeywordClick).toHaveBeenCalledTimes(1);
    });
    it('should call given onKeywordClick by pressing numeric pad enter button', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            onKeywordClick: onKeywordClick,
            keyword: keyword,
            variant,
            index,
        });

        fireEvent.keyPress(getByTestId(getId(keyword, variant, index)), { charCode: 13, code: 'NumpadEnter' });
        expect(onKeywordClick).toHaveBeenCalledTimes(1);
    });
    it('should NOT call given onKeywordClick when a key other than SPACE or ENTER is pressed', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            onKeywordClick: onKeywordClick,
            keyword: keyword,
            variant,
            index,
        });

        fireEvent.keyPress(getByTestId(getId(keyword, variant, index)), { charCode: 100, code: 'KeyD' });
        expect(onKeywordClick).not.toHaveBeenCalled();
    });
});
