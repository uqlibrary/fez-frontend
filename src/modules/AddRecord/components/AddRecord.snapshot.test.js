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

describe('About page snapshots tests', () => {
    it('renders default about page', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();

        wrapper.setState({finished: true});
        const tree2 = toJson(wrapper);
        expect(tree2).toMatchSnapshot();
    });
});
