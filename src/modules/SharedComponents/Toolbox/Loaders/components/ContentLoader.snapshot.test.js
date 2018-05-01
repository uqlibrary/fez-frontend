jest.dontMock('./ContentLoader');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ContentLoader from './ContentLoader';

function setup(message) {
    const props = {message};
    return shallow(<ContentLoader {...props} />);
}

describe('ContentLoader snapshots tests', () => {
    it('renders loader', () => {
        const wrapper = setup('Waiting to load...');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});