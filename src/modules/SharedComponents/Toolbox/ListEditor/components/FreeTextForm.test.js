import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import FreeTextForm from './FreeTextForm';

function setup({onAdd, isValid, disabled}){

    const props = {
        onAdd: onAdd || jest.fn(), // : PropTypes.func.isRequired,
        isValid: isValid || jest.fn(() => ('')), // PropTypes.func,
        disabled // : PropTypes.bool
        //locale, // : PropTypes.object,
    };
    return shallow(<FreeTextForm {...props} />);
}

describe('FreeTextForm tests ', () => {
    it('rendering active form', () => {
        const wrapper = setup({ });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('rendering disabled form', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });


    it('adding item method is called', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ onAdd: testMethod });
        wrapper.setState({itemName: 'one'});
        wrapper.instance().addItem({});
        expect(testMethod).toBeCalled;
    });

    it('adding item method is not called on disabled form', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ disabled: true, onAdd: testMethod });
        wrapper.setState({itemName: 'one'});
        wrapper.instance().addItem({});
        expect(testMethod).not.toBeCalled;
    });

    it('setting state', () => {
        const wrapper = setup({ });
        expect(wrapper.state().itemName).toBeFalsy();
        wrapper.instance().onNameChanged({}, 'one');
        expect(wrapper.state().itemName).toEqual('one');
    });

    it('rendering reminder to add input', () => {
        const isValid = jest.fn(() => false);
        const wrapper = setup({});
        wrapper.setProps({isValid: isValid, locale: {remindToAdd: 'reminder text'}, remindToAdd: true});
        wrapper.setState({itemName: 'one'});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
