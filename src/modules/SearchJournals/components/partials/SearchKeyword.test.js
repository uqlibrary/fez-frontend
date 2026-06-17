import React from 'react';
import { fireEvent, rtlRender } from 'test-utils';
import { getId, SearchKeyword } from './SearchKeyword';

const setup = (state, render = rtlRender) => {
    return render(<SearchKeyword {...{ onKeywordClick: () => {}, ...state }} />);
};

const keyword = 'test';
const type = 'title';
const variant = 'default';
const index = 0;
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

describe('SearchKeyword', () => {
    it('should render', () => {
        const { getByText } = setup({
            keyword,
            variant,
            type,
            index,
        });
        expect(getByText(keyword)).toBeInTheDocument();
    });

    it('should render for non default variant', () => {
        const { getByText } = setup({
            keyword,
            onKeywordClick: () => {},
            type,
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
            type,
            index,
        });
        expect(getByText(keyword)).toBeInTheDocument();
    });

    it('should render for code subjects', () => {
        const { getByText } = setup({
            keyword,
            cvoId,
            sources,
            type,
            index,
        });
        expect(getByText(keyword)).toBeInTheDocument();
    });

    it('should display all given sources for for code subjects', () => {
        const { getByText } = setup({
            keyword,
            cvoId,
            sources,
            type,
            index,
        });
        sources.forEach(source => {
            expect(getByText(source.index)).toBeInTheDocument();
            expect(getByText(source.name)).toBeInTheDocument();
        });
    });

    it('should call given onKeywordClick when clicked', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            keyword: keyword,
            onKeywordClick: onKeywordClick,
            variant,
            type,
            index,
        });
        fireEvent.click(getByTestId(getId(keyword, variant, type, index)));
        expect(onKeywordClick).toHaveBeenCalledTimes(1);
    });

    it('should call not throw error when onKeywordClick is not given and when clicked', () => {
        const { getByTestId } = setup({
            keyword: keyword,
            onKeywordClick: undefined,
            variant,
            type,
            index,
        });
        fireEvent.click(getByTestId(getId(keyword, variant, type, index)));
    });

    it('should call given onKeywordClick by pressing space bar', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            onKeywordClick: onKeywordClick,
            keyword: keyword,
            variant,
            type,
            index,
        });

        fireEvent.keyPress(getByTestId(getId(keyword, variant, type, index)), { charCode: 32, code: 'Space' });
        expect(onKeywordClick).toHaveBeenCalledTimes(1);
    });
    it('should call given onKeywordClick by pressing normal enter button', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            onKeywordClick: onKeywordClick,
            keyword: keyword,
            variant,
            type,
            index,
        });

        fireEvent.keyPress(getByTestId(getId(keyword, variant, type, index)), { charCode: 13, code: 'Enter' });
        expect(onKeywordClick).toHaveBeenCalledTimes(1);
    });
    it('should call given onKeywordClick by pressing numeric pad enter button', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            onKeywordClick: onKeywordClick,
            keyword: keyword,
            variant,
            type,
            index,
        });

        fireEvent.keyPress(getByTestId(getId(keyword, variant, type, index)), { charCode: 13, code: 'NumpadEnter' });
        expect(onKeywordClick).toHaveBeenCalledTimes(1);
    });
    it('should NOT call given onKeywordClick when a key other than SPACE or ENTER is pressed', () => {
        const onKeywordClick = jest.fn();
        const { getByTestId } = setup({
            onKeywordClick: onKeywordClick,
            keyword: keyword,
            variant,
            type,
            index,
        });

        fireEvent.keyPress(getByTestId(getId(keyword, variant, type, index)), { charCode: 100, code: 'KeyD' });
        expect(onKeywordClick).not.toHaveBeenCalled();
    });
});
