import React from 'react';
import ListRowHeader from './ListRowHeader';
import { rtlRender, fireEvent, queryByText, waitForElement } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onDeleteAll: jest.fn(),
        disabled: false,
        ...testProps,
    };
    return rtlRender(<ListRowHeader {...props} />);
}

describe('ListRowHeader renders ', () => {
    it('header for contributor editor control with name and delete all button only', () => {
        const { getByTestId } = setup();
        expect(getByTestId('delete-all-items')).toBeInTheDocument();
    });

    it('header for contributor editor control with delete all disabled', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('delete-all-items').disabled).toBeTruthy();
    });

    it('should render larger grid item', () => {
        const { container } = setup({
            hideReorder: true,
        });
        expect(queryByText(container, 'Reorder items')).toBeNull();
    });

    it('should show confirmation box', async() => {
        const onDeleteAllFn = jest.fn();
        const { getByTestId } = setup({ onDeleteAll: onDeleteAllFn });

        fireEvent.click(getByTestId('delete-all-items'));
        await waitForElement(() => getByTestId('confirm-action'));
        fireEvent.click(getByTestId('confirm-action'));

        expect(onDeleteAllFn).toHaveBeenCalled();
    });
});
