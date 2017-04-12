jest.dontMock('./About');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import About from './About';

function setup() {

    const props = {};
    return shallow(<About {...props} />);
}

describe('About page snapshots tests', () => {
    it('renders default about page', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});