import React from 'react';

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {MemoryRouter} from 'react-router-dom'
import {Provider} from 'react-redux';

import GoogleScholar from './GoogleScholar';
import {testAuthor} from 'mock/data/testing/authorIdentifiers';
import {locale} from 'locale';

const create = () => {
    const initialState = Immutable.Map();

    const store = {
        getState: jest.fn(() => (initialState)),
        dispatch: jest.fn(),
        subscribe: jest.fn()
    };
    const next = jest.fn();
    const invoke = (action) => thunk(store)(next)(action);
    return {store, next, invoke}
};

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        author: testProps.author || testAuthor,
        actions: testProps.actions || {showAppAlert: jest.fn()},
        history: testProps.history || {push: jest.fn()},

        // redux form props
        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues: testProps.initialValues || {
            aut_id: !!testProps.author ? testProps.author.aut_id : testAuthor.aut_id,
            aut_google_scholar_id: !!testProps.author ? testProps.author.aut_google_scholar_id : testAuthor.aut_google_scholar_id
        },
        submitSucceeded: testProps.submitSucceeded || false,
        submitFailed: testProps.submitFailed || false,
        error: testProps.error || null
    };

    if(isShallow) {
        return shallow(<GoogleScholar {...props} />);
    }

    return mount(
        <Provider store={create().store}>
            <MemoryRouter>
                <GoogleScholar {...props} />
            </MemoryRouter>
        </Provider>, {
            context: {
                muiTheme: getMuiTheme(),

            },
            childContextTypes: {
                muiTheme: PropTypes.object.isRequired
            }
        });
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('Component GoogleScholar ', () => {

    it('should render nothing if author is not loaded', () => {
        const wrapper = setup({accountAuthorLoading: true, author: null});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render form if author doesn\'t have google scholar id', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.requiredField').length).toEqual(1);
    });

    it('should render form if author has google scholar id', () => {
        const wrapper = setup({author: { ...testAuthor, aut_google_scholar_id: 'abc123'}});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.requiredField').length).toEqual(1);
    });

    it('should redirect to the dashbaord', () => {
        const testMethod = jest.fn();
        const wrapper = setup({history: {push: testMethod}});
        wrapper.instance()._navigateToDashboard();
        expect(testMethod).toHaveBeenCalledWith('/dashboard');
    });

    it('should submit form when user hits Enter', () => {
        const testMethod = jest.fn();
        const wrapper = setup({handleSubmit: testMethod});
        wrapper.instance()._handleKeyboardFormSubmit({key: 'Enter', preventDefault: jest.fn()});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should NOT submit the form when user hits shift+Enter', () => {
        const testMethod = jest.fn();
        const wrapper = setup({handleSubmit: testMethod});
        wrapper.instance()._handleKeyboardFormSubmit({key: 'Enter', shiftKey: true, preventDefault: jest.fn()});
        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should go back to the dashboard if the submission succeeded', () => {
        const testMethod = jest.fn();
        const wrapper = setup({history: {push: testMethod}});
        wrapper.setProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalledWith('/dashboard');
    });

    it('should dispatch action to display success alert', () => {
        const testMethod = jest.fn();
        const wrapper = setup({actions: {showAppAlert: testMethod}});
        wrapper.setProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should display submission error if saving failed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({submitFailed: true, error: 'failed!'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display submission in progress alert', () => {
        const testMethod = jest.fn();
        const wrapper = setup({submitting: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
