jest.dontMock('./Authors');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Authors from './Authors';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({});

function setup() {
    return shallow(<Provider store={store}><Authors form="aTestForm" /></Provider>);
}

describe('Authors snapshots tests', () => {
    it('renders authors field', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
