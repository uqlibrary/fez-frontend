import React from 'react';
import LookupForm from './LookupForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        inputField: () => <span />,
        onAdd: testProps.onAdd || jest.fn(), // : PropTypes.func.isRequired,
        isValid: testProps.isValid || jest.fn(() => ''), // PropTypes.func,
        disabled: testProps.disabled,
    };
    return getElement(LookupForm, props);
}

describe('LookupForm tests ', () => {
    it('should render lookup form', () => {
        const wrapper = setup();
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

    it('should set default value on receiving new props', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({ itemSelectedToEdit: { key: 23, value: 'Testing' } });
        expect(wrapper.state().defaultValue).toEqual('Testing');
    });
});
