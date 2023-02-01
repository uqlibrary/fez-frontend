import React from 'react';
import { AllTheProviders, fireEvent, render } from 'test-utils';
import { SelectedKeywordItem } from './SelectedKeywordItem';

const setup = state => {
    return render(
        <AllTheProviders>
            <SelectedKeywordItem {...state} />
        </AllTheProviders>,
    );
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
    it('should call given onKeywordDelete on removal by pressing space bar', () => {
        const onKeywordDelete = jest.fn();
        const { container } = setup({
            onKeywordDelete: onKeywordDelete,
            keyword: keyword,
        });

        fireEvent.keyPress(container.querySelector('[class*="deleteIcon"]'), { charCode: 32, code: 'Space' });
        expect(onKeywordDelete).toHaveBeenCalledTimes(1);
    });
    it('should call given onKeywordDelete on removal by pressing normal enter button', () => {
        const onKeywordDelete = jest.fn();
        const { container } = setup({
            onKeywordDelete: onKeywordDelete,
            keyword: keyword,
        });

        fireEvent.keyPress(container.querySelector('[class*="deleteIcon"]'), { charCode: 13, code: 'Enter' });
        expect(onKeywordDelete).toHaveBeenCalledTimes(1);
    });
    it('should call given onKeywordDelete on removal by pressing numeric pad enter button', () => {
        const onKeywordDelete = jest.fn();
        const { container } = setup({
            onKeywordDelete: onKeywordDelete,
            keyword: keyword,
        });

        fireEvent.keyPress(container.querySelector('[class*="deleteIcon"]'), { charCode: 13, code: 'NumpadEnter' });
        expect(onKeywordDelete).toHaveBeenCalledTimes(1);
    });
    it('should NOT call given onKeywordDelete when a key other than SPACE or ENTER is pressed', () => {
        const onKeywordDelete = jest.fn();
        const { container } = setup({
            onKeywordDelete: onKeywordDelete,
            keyword: keyword,
        });

        fireEvent.keyPress(container.querySelector('[class*="deleteIcon"]'), { charCode: 100, code: 'KeyD' });
        expect(onKeywordDelete).not.toHaveBeenCalled();
    });
});
