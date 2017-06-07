jest.dontMock('./GettingStarted');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import GettingStarted from './GettingStarted';

function setup() {
    const props = {
        form: 'testForm',
        closeDialog: jest.fn(),
        nextPage: jest.fn()
    };
    return shallow(<GettingStarted {...props} />);
}

describe('File upload getting started snapshots tests', () => {
    it('renders default getting started component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
