jest.dontMock('./ListForm');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ListForm from './ListForm';
import injectTapEventPlugin from 'react-tap-event-plugin';

beforeAll(() => {
    injectTapEventPlugin();
});

function setup({onAdd, isValid, disabled}){

    const props = {
        onAdd: onAdd || jest.fn(), // : PropTypes.func.isRequired,
        isValid: isValid || jest.fn(() => ('')), // PropTypes.func,
        disabled // : PropTypes.bool
        //locale, // : PropTypes.object,
    };
    return shallow(<ListForm {...props} />);
}

describe('ListForm tests ', () => {
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
});
