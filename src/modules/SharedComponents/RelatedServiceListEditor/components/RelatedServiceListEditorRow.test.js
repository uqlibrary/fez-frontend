import React from 'react';
import RelatedServiceListEditorRow from './RelatedServiceListEditorRow';
import { rtlRender, fireEvent } from 'test-utils';

import * as Hook from 'hooks/useWidth';

function setup(testProps = {}) {
    const props = {
        index: 0,
        relatedService: { nameAsPublished: 'Related service', relatedServiceId: '1234', relatedServiceDesc: 'desc' },
        canMoveUp: false,
        canMoveDown: false,
        onMoveUp: jest.fn(),
        onMoveDown: jest.fn(),
        onDelete: jest.fn(),
        // locale: {},
        disabled: false,
        ...testProps,
    };
    return rtlRender(<RelatedServiceListEditorRow {...props} />);
}

describe('GrantListEditorRow', () => {
    const useWidth = jest.spyOn(Hook, 'useWidth');

    it('should render default view', () => {
        useWidth.mockImplementation(() => 'lg');
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render default mobile view', () => {
        useWidth.mockImplementation(() => 'xs');
        const { container } = setup();

        expect(container).toMatchSnapshot();
    });

    it('should render given locale', () => {
        useWidth.mockImplementation(() => 'lg');
        const { container } = setup({
            locale: {
                deleteRecordConfirmation: {},
                moveUpHint: 'Move up',
                moveDownHint: 'Move down',
                deleteHint: 'Delete hint',
            },
            classes: {
                selected: 'selected-related-service',
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should render given related service data', () => {
        const { container } = setup({
            locale: {
                deleteRecordConfirmation: {},
                moveUpHint: 'Move up',
                moveDownHint: 'Move down',
                deleteHint: 'Delete hint',
                selectHint: 'Select hint [name]',
            },
            relatedService: {
                relatedServiceId: '1234',
                relatedServiceDesc: 'desc',
                selected: true,
            },
            classes: {
                selected: 'selected-related-service',
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
        const relatedService = {
            nameAsPublished: 'Related service',
            relatedServiceDesc: 'desc',
            relatedServiceId: '1234',
        };
        const { getByRole } = setup({
            canEdit: true,
            relatedService: relatedService,
            index: 0,
            onEdit: onEditFn,
        });
        fireEvent.click(getByRole('button', { name: 'Edit this entry' }));
        expect(onEditFn).toHaveBeenCalledWith(relatedService, 0);
    });
});
