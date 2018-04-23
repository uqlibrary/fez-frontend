jest.dontMock('./ListRowHeader');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ListRowHeader from './ListRowHeader';

function setup({onDeleteAll, disabled}) {

    const props = {
        onDeleteAll: onDeleteAll || jest.fn(), // : PropTypes.func.isRequired,
        // locale, // : PropTypes.object,
        disabled: disabled || false // : PropTypes.bool
    };

    return shallow(<ListRowHeader {...props} />);
}

describe('ListRowHeader renders ', () => {

    it('header for contributor editor control with name and delete all button only', () => {
        const wrapper = setup({ });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with delete all disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
