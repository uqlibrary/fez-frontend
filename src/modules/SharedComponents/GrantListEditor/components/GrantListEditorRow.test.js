import React from 'react';
import GrantListEditorRowWithWidth, { GrantListEditorRow } from './GrantListEditorRow';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        index: 0,
        grant: { grantAgencyName: 'Agency name', grantId: '1234', grantAgencyType: 'Government' },
        canMoveUp: false,
        canMoveDown: false,
        onMoveUp: jest.fn(),
        onMoveDown: jest.fn(),
        onDelete: jest.fn(),
        // locale: {},
        disabled: false,
        width: 'md',
        ...testProps,
    };
    return rtlRender(<GrantListEditorRow {...props} />);
}

describe('GrantListEditorRow', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render default mobile view', () => {
        const { container } = setup({ width: 'xs' });
        expect(container).toMatchSnapshot();
    });

    it('should use width hook', () => {
        const { container } = rtlRender(<GrantListEditorRowWithWidth index={0} grant={{}} />);
        expect(container).toMatchSnapshot();
    });

    it('should render given locale', () => {
        const { container } = setup({
            locale: {
                deleteRecordConfirmation: {},
                moveUpHint: 'Move up',
                moveDownHint: 'Move down',
                deleteHint: 'Delete hint',
                selectHint: 'Select hint [name]',
            },
            grant: {
                nameAsPublished: 'testing',
            },
            classes: {
                selected: 'selected-grant',
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should render given grant data', () => {
        const { container } = setup({
            locale: {
                deleteRecordConfirmation: {},
                moveUpHint: 'Move up',
                moveDownHint: 'Move down',
                deleteHint: 'Delete hint',
                selectHint: 'Select hint [name]',
            },
            grant: {
                grantAgencyName: 'testing',
                grantId: '1234',
                grantAgencyType: '453985',
                selected: true,
            },
            classes: {
                selected: 'selected-grant',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should show confirmation box', () => {
        const { getByRole, container } = setup();
        fireEvent.click(getByRole('button', { name: 'Remove this entry' }));
        expect(container).toMatchSnapshot();
    });

    it('should delete grant', () => {
        const onDeleteFn = jest.fn();
        const { getByRole, getByTestId } = setup({ onDelete: onDeleteFn });
        fireEvent.click(getByRole('button', { name: 'Remove this entry' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(onDeleteFn).toHaveBeenCalled();
    });

    it('should move grant up', () => {
        const onMoveUpFn = jest.fn();
        const { getByRole } = setup({ canMoveUp: true, onMoveUp: onMoveUpFn });
        fireEvent.click(getByRole('button', { name: 'Move entry up the order' }));
        expect(onMoveUpFn).toHaveBeenCalled();
    });

    it('should move grant down', () => {
        const onMoveDownFn = jest.fn();
        const { getByRole } = setup({ canMoveDown: true, onMoveDown: onMoveDownFn });
        fireEvent.click(getByRole('button', { name: 'Move entry down the order' }));
        expect(onMoveDownFn).toHaveBeenCalled();
    });

    it('should not call certain event handlers if row is disabled', () => {
        const onMoveUpFn = jest.fn();
        const onMoveDownFn = jest.fn();
        const onDeleteFn = jest.fn();
        const { getByRole } = setup({
            canMoveUp: true,
            canMoveDown: true,
            onMoveUp: onMoveUpFn,
            onMoveDown: onMoveDownFn,
            onDelete: onDeleteFn,
            disabled: true,
        });

        fireEvent.click(getByRole('button', { name: 'Remove this entry' }));
        fireEvent.click(getByRole('button', { name: 'Move entry up the order' }));
        fireEvent.click(getByRole('button', { name: 'Move entry down the order' }));
        expect(onMoveUpFn).not.toHaveBeenCalled();
        expect(onMoveDownFn).not.toHaveBeenCalled();
        expect(onDeleteFn).not.toHaveBeenCalled();
    });

    it('should correctly handle edit', () => {
        const onEditFn = jest.fn();
        const grant = {
            grantAgencyName: 'testing',
            grantId: '1234',
            grantAgencyType: '453985',
        };
        const { getByRole } = setup({
            canEdit: true,
            grant: grant,
            index: 0,
            onEdit: onEditFn,
        });
        fireEvent.click(getByRole('button', { name: 'Edit this entry' }));
        expect(onEditFn).toHaveBeenCalledWith(grant, 0);
    });
});
