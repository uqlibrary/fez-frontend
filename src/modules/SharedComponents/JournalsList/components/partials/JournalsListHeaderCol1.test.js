import React from 'react';
import JournalsListHeaderCol1 from './JournalsListHeaderCol1';
import { fireEvent, render } from 'test-utils';

const setup = (state = {}) => {
    return render(<JournalsListHeaderCol1 {...state} />);
};

describe('JournalsListHeaderCol1', () => {
    it('should render ', () => {
        const { getByTestId } = setup();
        expect(getByTestId('journal-list-header-col-1-select-all')).not.toHaveAttribute('disabled');
        expect(getByTestId('journal-list-header-col-1-select-all')).not.toHaveAttribute('checked');
    });
    it('should render without checkboxes when isSelectable = false', () => {
        const { queryByTestId } = setup({ isSelectable: false });
        expect(queryByTestId('journal-list-header-col-1-select-all')).not.toBeInTheDocument();
    });
    it('should render with select all checked when isAllSelected = true', () => {
        const { getByTestId } = setup({ checked: true });
        expect(getByTestId('journal-list-header-col-1-select-all')).toHaveAttribute('checked');
    });
    it('should execute given onToggleSelectAll closure', () => {
        const onToggleSelectAll = jest.fn();
        const { getByTestId } = setup({ onChange: onToggleSelectAll });
        fireEvent.click(getByTestId('journal-list-header-col-1-select-all'));
        expect(onToggleSelectAll).toHaveBeenCalledTimes(1);
    });
});
