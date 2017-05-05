jest.dontMock('./AddRecord');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';
import sinon from 'sinon';

import AddRecord from './AddRecord';

function setup() {
    const props = {
        snackbar: Immutable.fromJS({
            open: false,
            message: 'test message'}),
        hideSnackbar: sinon.spy(),
        showSnackbar: sinon.spy()
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
