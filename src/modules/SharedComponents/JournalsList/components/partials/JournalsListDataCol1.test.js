import React from 'react';
import { fireEvent, render } from 'test-utils';
import JournalsListDataCol1 from './JournalsListDataCol1';
import mockData from 'mock/data/testing/journals/journals';

const setup = (state = {}) => {
    return render(<JournalsListDataCol1 {...{ index: 0, journal: mockData[0], ...state }} />);
};

describe('JournalsListDataCol1', () => {
    it('should render ', () => {
        const { getByTestId } = setup();
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).not.toHaveAttribute('disabled');
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).not.toHaveAttribute('checked');
    });
    it('should render without checkboxes when isSelectable = false', () => {
        const { queryByTestId } = setup({ isSelectable: false });
        expect(queryByTestId('journal-list-data-col-1-checkbox-0')).not.toBeInTheDocument();
    });
    it('should render with select all checked when checked = true', () => {
        const { getByTestId } = setup({ checked: true });
        expect(getByTestId('journal-list-data-col-1-checkbox-0')).toHaveAttribute('checked');
    });
    it('should execute given onToggleSelectAll closure', () => {
        const onChange = jest.fn();
        const { getByTestId } = setup({ onChange: onChange });
        fireEvent.click(getByTestId('journal-list-data-col-1-checkbox-0'));
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
