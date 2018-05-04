jest.dontMock('./StandardPage');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import StandardPage from './StandardPage';

function setup(title) {
    const props = {title};
    return shallow(<StandardPage {...props} />);
}

describe('Snapshot tests for StandardPage component', () => {
    it('renders StandardPage with title', () => {
        const wrapper = setup('standard page title');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});