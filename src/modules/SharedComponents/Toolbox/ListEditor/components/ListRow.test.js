import React from 'react';
import ListRow from './ListRow';
import { rtlRender, fireEvent, waitForElement, queryByTestId } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        index: 0,
        item: 'one',
        canMoveUp: false,
        canMoveDown: false,
        onMoveUp: jest.fn(),
        onMoveDown: jest.fn(),
        onDelete: jest.fn(),
        disabled: false,
        ...testProps,
    };
    return rtlRender(<ListRow {...props} />);
}

describe('ListRow renders ', () => {
    it('a row with index and item and delete button', () => {
        const { getByTestId, getByText } = setup();
        expect(getByText('one')).toBeInTheDocument();
        expect(getByTestId('delete-0')).toBeInTheDocument();
    });

    it('should hide reorder buttong', () => {
        const { container } = setup({ hideReorder: true });
        expect(queryByTestId(container, 'move-up-0')).toBeNull();
        expect(queryByTestId(container, 'move-down-0')).toBeNull();
        expect(queryByTestId(container, 'edit-item-0')).toBeNull();
    });

    it('a row with index and item set, renders reorder buttons, and delete button', () => {
        const { getByTestId } = setup({ canMoveUp: true, canMoveDown: true });
        expect(getByTestId('delete-0')).toBeInTheDocument();
        expect(getByTestId('move-up-0')).toBeInTheDocument();
        expect(getByTestId('move-down-0')).toBeInTheDocument();
    });

    it('a row with index and item set calls move up function', () => {
        const testFunction = jest.fn();
        const { getByTestId } = setup({ canMoveUp: true, onMoveUp: testFunction });
        expect(getByTestId('move-up-0')).toBeInTheDocument();
        fireEvent.click(getByTestId('move-up-0'));
        expect(testFunction).toHaveBeenCalled();
    });

    it('a row with index and item set calls move down function', () => {
        const testFunction = jest.fn();
        const { getByTestId } = setup({ canMoveDown: true, onMoveDown: testFunction });
        expect(getByTestId('move-down-0')).toBeInTheDocument();
        fireEvent.click(getByTestId('move-down-0'));
        expect(testFunction).toHaveBeenCalled();
    });

    it('a row with index and item set calls delete function', async() => {
        const testFunction = jest.fn();
        const { getByTestId } = setup({ onDelete: testFunction });
        expect(getByTestId('delete-0')).toBeInTheDocument();

        fireEvent.click(getByTestId('delete-0'));
        await waitForElement(() => getByTestId('confirm-action'));
        fireEvent.click(getByTestId('confirm-action'));
        expect(testFunction).toHaveBeenCalled();
    });

    it('should not call handlers if row is disabled', () => {
        const onDeleteFn = jest.fn();
        const onMoveUpFn = jest.fn();
        const onMoveDownFn = jest.fn();

        const { getByTestId } = setup({
            disabled: true,
            canMoveUp: true,
            canMoveDown: true,
            onDelete: onDeleteFn,
            onMoveDown: onMoveDownFn,
            onMoveUp: onMoveUpFn,
        });

        expect(getByTestId('delete-0').disabled).toBeTruthy();
        expect(getByTestId('move-up-0').disabled).toBeTruthy();
        expect(getByTestId('move-down-0').disabled).toBeTruthy();

        fireEvent.click(getByTestId('delete-0'));
        expect(onDeleteFn).not.toHaveBeenCalled();

        fireEvent.click(getByTestId('move-up-0'));
        expect(onMoveUpFn).not.toHaveBeenCalled();

        fireEvent.click(getByTestId('move-down-0'));
        expect(onMoveDownFn).not.toHaveBeenCalled();
    });

    it('should handle edit', () => {
        const onEditFn = jest.fn();
        const { getByTestId } = setup({ canEdit: true, onEdit: onEditFn, index: 1 });
        fireEvent.click(getByTestId('edit-item-1'));
        expect(onEditFn).toHaveBeenCalledWith(1);
    });
});
