jest.dontMock('./AddRecord');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import AddRecord from './AddRecord';

function setup() {
    const props = {
    };
    return shallow(<AddRecord {...props} />);
}

describe('Add record page snapshots tests', () => {
    it('renders default add record page', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setState({finished: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
