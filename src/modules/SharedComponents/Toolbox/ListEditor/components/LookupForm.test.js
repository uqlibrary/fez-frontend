import React from 'react';
import LookupForm from './LookupForm';
import { rtlRender, fireEvent } from 'test-utils';
import { TextField } from '@mui/material';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        inputField: ({ input }) => <TextField value={input.value} onChange={input.onChange} />,
        onAdd: testProps.onAdd || jest.fn(), // : PropTypes.func.isRequired,
        isValid: testProps.isValid || jest.fn(() => ''), // PropTypes.func,
        disabled: testProps.disabled,
    };
    return rtlRender(<LookupForm {...props} />);
}

describe('LookupForm tests ', () => {
    it('should render lookup form', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should add key value item', () => {
        const onAddFn = jest.fn();
        const { getByRole } = setup({
            onAdd: onAddFn,
        });
        fireEvent.change(getByRole('textbox'), { target: { value: 'test' } });
        expect(onAddFn).toHaveBeenCalled();
    });

    it('should set default value on receiving new props', () => {
        const { rerender, getByRole } = setup();

        rerender(
            <LookupForm
                inputField={({ input }) => <TextField value={input.value} onChange={input.onChange} />}
                onAdd={jest.fn()}
                itemSelectedToEdit={{ key: 23, value: 'Testing' }}
            />,
        );
        expect(getByRole('textbox').value).toEqual('Testing');
    });
});
