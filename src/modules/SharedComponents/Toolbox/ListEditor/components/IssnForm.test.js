import React from 'react';
import IssnForm, { indexFinder } from './IssnForm';
import { rtlRender, fireEvent } from 'test-utils';

describe('IssnForm behaviour tests', () => {
    it('should submit correct form of issn', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <IssnForm
                onAdd={onAddFn}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="issn"
                normalize={jest.fn(value => value)}
                mode="add"
            />,
        );

        expect(getByTestId('issn-add')).toHaveAttribute('disabled', '');

        fireEvent.change(getByTestId('issn-input'), { target: { value: '0000-0000' } });

        expect(getByTestId('issn-add')).not.toHaveAttribute('disabled', '');

        fireEvent.click(getByTestId('issn-add'));

        expect(onAddFn).toHaveBeenCalledWith(
            {
                key: '0000-0000',
                value: {
                    sherpaRomeo: { link: false },
                    ulrichs: { link: false, linkText: '' },
                },
            },
            indexFinder,
        );
    });

    it('should submit correct form of issn for NewListEditor', () => {
        const onSubmitFn = jest.fn();
        const { getByTestId } = rtlRender(
            <IssnForm
                onSubmit={onSubmitFn}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="issn"
                normalize={jest.fn(value => value)}
                mode="add"
            />,
        );

        expect(getByTestId('issn-add')).toHaveAttribute('disabled', '');

        fireEvent.change(getByTestId('issn-input'), { target: { value: '0000-0000' } });

        expect(getByTestId('issn-add')).not.toHaveAttribute('disabled', '');

        fireEvent.click(getByTestId('issn-add'));

        expect(onSubmitFn).toHaveBeenCalledWith(
            {
                key: '0000-0000',
                value: {
                    sherpaRomeo: { link: false },
                    ulrichs: { link: false, linkText: '' },
                },
            },
            indexFinder,
        );
    });

    it('should submit update selected item to update', () => {
        const onSubmitFn = jest.fn();
        const { getByTestId } = rtlRender(
            <IssnForm
                onSubmit={onSubmitFn}
                locale={{
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Update',
                }}
                listEditorId="issn"
                normalize={jest.fn(value => value)}
                mode="update"
                itemSelectedToEdit={{ key: '1111-2222' }}
            />,
        );

        fireEvent.change(getByTestId('issn-input'), { target: { value: '0000-0000' } });
        fireEvent.click(getByTestId('issn-update'));

        expect(onSubmitFn).toHaveBeenCalledWith(
            {
                key: '0000-0000',
                value: {
                    sherpaRomeo: { link: false },
                    ulrichs: { link: false, linkText: '' },
                },
            },
            indexFinder,
        );
    });

    it('should correctly handle filtering for the given list and the item', () => {
        expect(indexFinder([{ key: '1111-2222', value: {} }], { key: '1111-2222' })).toBe(0);
        expect(indexFinder([{ key: '1111-2222', value: {} }], { key: '1111-1111' })).toBe(-1);
    });
});
