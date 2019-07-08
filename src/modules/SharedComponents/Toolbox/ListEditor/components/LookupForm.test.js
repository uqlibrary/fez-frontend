import React from 'react';
import LookupForm from './LookupForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        inputField: () => <span />,
        onAdd: testProps.onAdd || jest.fn(), // : PropTypes.func.isRequired,
        isValid: testProps.isValid || jest.fn(() => ''), // PropTypes.func,
        disabled: testProps.disabled,
    };
    return getElement(LookupForm, props, isShallow);
}

describe('LookupForm tests ', () => {
    it('should render lookup form', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should add key value item', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn,
        });
        wrapper.instance().addKeyValueItem('test');
        expect(onAddFn).toHaveBeenCalledWith('test');
    });
});
