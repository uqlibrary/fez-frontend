jest.dontMock('../components/Alert');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Alert from '../components/Alert';

function setup({...props}) {
    return shallow(<Alert {...props} />);
}

describe('Alert snapshots test', () => {
    it('renders Alert of error type', () => {
        const title = "This is a title";
        const message = "This is the message";
        const type = "error";

        const wrapper = setup({title, message, type});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders Alert of error type should render action button', () => {
        const wrapper = setup({action: jest.fn(), actionButtonLabel: 'Do something'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders Alert of error type should render dismiss icon button', () => {
        const wrapper = setup({allowDismiss: true, dismissAction: jest.fn()});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders Alert of error type should render dismiss icon button and action button', () => {
        const wrapper = setup({action: jest.fn(), actionButtonLabel: 'Do something', allowDismiss: true, dismissAction: jest.fn()});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders Alert of error type should render dismiss icon button and action button and spinner', () => {
        const wrapper = setup({showLoader: true, action: jest.fn(), actionButtonLabel: 'Do something', allowDismiss: true, dismissAction: jest.fn()});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
