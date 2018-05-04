import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import LookupForm from './LookupForm';

function setup({onAdd, isValid, disabled}){

    const props = {
        inputField: () => (<span />),
        onAdd: onAdd || jest.fn(), // : PropTypes.func.isRequired,
        isValid: isValid || jest.fn(() => ('')), // PropTypes.func,
        disabled // : PropTypes.bool
        //locale, // : PropTypes.object,
    };
    return shallow(<LookupForm {...props} />);
}

describe('LookupForm tests ', () => {
    it('should render lookup form', () => {
        const wrapper = setup({ });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
