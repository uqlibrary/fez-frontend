import React from 'react';
import IssnForm from './IssnForm';
import { rtlRender, fireEvent } from 'test-utils';

describe('IssnForm behaviour tests', () => {
    it('should submit correct form of issn', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = rtlRender(
            <IssnForm
                onAdd={onAddFn}
                locale={{
                    id: 'issn-text-input',
                    inputFieldLabel: 'Item name',
                    inputFieldHint: 'Please type the item name',
                    addButtonLabel: 'Add',
                }}
                listEditorId="issn"
                normalize={jest.fn(value => value)}
            />,
        );

        expect(getByTestId('add-issn')).toHaveAttribute('disabled', '');

        fireEvent.change(getByTestId('issn-text-input'), { target: { value: '0000-0000' } });

        expect(getByTestId('add-issn')).not.toHaveAttribute('disabled', '');

        fireEvent.click(getByTestId('add-issn'));

        expect(onAddFn).toHaveBeenCalledWith({
            key: '0000-0000',
            value: {
                sherpaRomeo: { link: false },
                ulrichs: { link: false, linkText: '' },
            },
        });
    });
});
