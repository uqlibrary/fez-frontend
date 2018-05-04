jest.dontMock('./AppLoader');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AppLoader from './AppLoader';

function setup(title, logoImage, logoText, progressColor) {
    const props = {title, logoImage, logoText, progressColor};
    return shallow(<AppLoader {...props} />);
}

describe('AppLoader snapshots tests', () => {
    it('renders loader without image', () => {
        const wrapper = setup('Fez frontend');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders loader with image', () => {
        const wrapper = setup('Fez frontend', 'http://image/image.svg', 'Fez logo', '#CCC');
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});