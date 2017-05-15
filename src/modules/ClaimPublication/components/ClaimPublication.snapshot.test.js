jest.dontMock('./ClaimPublication');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import ClaimPublication from './ClaimPublication';

function setup() {
    const props = {
    };
    return shallow(<ClaimPublication {...props} />);
}

describe('Add record page snapshots tests', () => {
    it('renders default add record page', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
