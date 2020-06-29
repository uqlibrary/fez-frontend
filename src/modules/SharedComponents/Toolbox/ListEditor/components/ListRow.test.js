import React from 'react';
import ListRow from './ListRow';
import { rtlRender, fireEvent, waitFor, queryByTestId } from 'test-utils';

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
        listRowId: 'test-list-row-0',
        ...testProps,
    };
    return rtlRender(<ListRow {...props} />);
}

describe('ListRow renders ', () => {
    it('a row with index and item and delete button', () => {
        const { getByTestId, getByText } = setup();
        expect(getByText('one')).toBeInTheDocument();
        expect(getByTestId('test-list-row-0-delete')).toBeInTheDocument();
    });

    it('should hide reorder buttong', () => {
        const { container } = setup({ hideReorder: true });
        expect(queryByTestId(container, 'test-list-row-0-move-up')).toBeNull();
        expect(queryByTestId(container, 'test-list-row-0-move-down')).toBeNull();
        expect(queryByTestId(container, 'test-list-row-0-edit')).toBeNull();
    });

    it('a row with index and item set, renders reorder buttons, and delete button', () => {
        const { getByTestId } = setup({ canMoveUp: true, canMoveDown: true });
        expect(getByTestId('test-list-row-0-delete')).toBeInTheDocument();
        expect(getByTestId('test-list-row-0-move-up')).toBeInTheDocument();
        expect(getByTestId('test-list-row-0-move-down')).toBeInTheDocument();
    });

    it('a row with index and item set calls move up function', () => {
        const testFunction = jest.fn();
        const { getByTestId } = setup({ canMoveUp: true, onMoveUp: testFunction });
        expect(getByTestId('test-list-row-0-move-up')).toBeInTheDocument();
        fireEvent.click(getByTestId('test-list-row-0-move-up'));
        expect(testFunction).toHaveBeenCalled();
    });

    it('a row with index and item set calls move down function', () => {
        const testFunction = jest.fn();
        const { getByTestId } = setup({ canMoveDown: true, onMoveDown: testFunction });
        expect(getByTestId('test-list-row-0-move-down')).toBeInTheDocument();
        fireEvent.click(getByTestId('test-list-row-0-move-down'));
        expect(testFunction).toHaveBeenCalled();
    });

    it('a row with index and item set calls delete function', async () => {
        const testFunction = jest.fn();
        const { getByTestId } = setup({ onDelete: testFunction });
        expect(getByTestId('test-list-row-0-delete')).toBeInTheDocument();

        fireEvent.click(getByTestId('test-list-row-0-delete'));
        await waitFor(() => getByTestId('confirm-action'));
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

        expect(getByTestId('test-list-row-0-delete').disabled).toBeTruthy();
        expect(getByTestId('test-list-row-0-move-up').disabled).toBeTruthy();
        expect(getByTestId('test-list-row-0-move-down').disabled).toBeTruthy();

        fireEvent.click(getByTestId('test-list-row-0-delete'));
        expect(onDeleteFn).not.toHaveBeenCalled();

        fireEvent.click(getByTestId('test-list-row-0-move-up'));
        expect(onMoveUpFn).not.toHaveBeenCalled();

        fireEvent.click(getByTestId('test-list-row-0-move-down'));
        expect(onMoveDownFn).not.toHaveBeenCalled();
    });

    it('should handle edit', () => {
        const onEditFn = jest.fn();
        const { getByTestId } = setup({ canEdit: true, onEdit: onEditFn, index: 1, listRowId: 'test-list-row-1' });
        fireEvent.click(getByTestId('test-list-row-1-edit'));
        expect(onEditFn).toHaveBeenCalledWith(1);
    });
});
