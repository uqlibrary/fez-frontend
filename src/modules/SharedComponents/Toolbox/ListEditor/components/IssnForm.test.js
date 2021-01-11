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
});
