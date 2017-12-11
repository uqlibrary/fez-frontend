import { shallow, mount } from 'enzyme';
import React from 'react';
import GoogleScholar from './GoogleScholar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {MemoryRouter} from 'react-router-dom'
import {Provider} from 'react-redux';
import {locale} from 'locale';
import toJson from 'enzyme-to-json';

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
let currentAuthor = {
    "aut_id": 410,
    "aut_org_username": "uqresearcher",
    "aut_org_staff_id": "0001952",
    "aut_org_student_id": null,
    "aut_email": "",
    "aut_display_name": "Researcher, J",
    "aut_fname": "J",
    "aut_mname": "",
    "aut_lname": "Researcher",
    "aut_title": "Professor",
    "aut_position": "",
    "aut_homepage_link": "",
    "aut_created_date": null,
    "aut_update_date": "2017-07-23",
    "aut_external_id": "0000040357",
    "aut_ref_num": "",
    "aut_researcher_id": "A-1137-2007",
    "aut_scopus_id": "35478294000",
    "aut_mypub_url": "",
    "aut_rid_password": "",
    "aut_people_australia_id": "",
    "aut_description": "",
    "aut_orcid_id": "0000-0001-1111-1111",
    "aut_google_scholar_id": null, // "kUemDfMAAAAJ",
    "aut_rid_last_updated": "2013-05-17",
    "aut_publons_id": null,
    "aut_student_username": null
};

function setup({accountAuthorLoading, handleSubmit, match, initialValues, actions, author = currentAuthor, history = {go: jest.fn()}, isShallow = true, submitSucceeded}){
    const props = {

        accountAuthorLoading: accountAuthorLoading || false,
        author: author || null,

        handleSubmit: handleSubmit || jest.fn(),
        initialValues: initialValues ||
            Immutable.Map({
                author: Immutable.Map(author)
            }),
        actions: actions || {},
        history: history || {},
        match: match || {},

        submitSucceeded: submitSucceeded || false
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

    it('component remders with a loaded author, with a Field, a RaisedButton and a FlatButton with correct labels', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
        expect(wrapper.find('RaisedButton').node.props.label).toEqual(locale.pages.authorIdentifiers.googleScholar.buttonLabels.add);
        expect(wrapper.find('FlatButton').length).toEqual(1);
        expect(wrapper.find('FlatButton').node.props.label).toEqual(locale.pages.authorIdentifiers.googleScholar.buttonLabels.cancel);
    });

    it('should render inline loader when author is still loading', () => {
        const wrapper = setup({accountAuthorLoading: true, author: null, initialValues: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should load author if author is not loaded', () => {
        const testMethod = jest.fn();
        const wrapper = setup({isShallow: false, accountAuthorLoading: false, author: null, actions: {loadCurrentAccount: testMethod}});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render the form, with an input, a update and a cancel button', () => {
        const wrapper = setup({
            accountAuthorLoading: false,
            author: {aut_google_scholar_id: '12345'},
            initialValues: {
                author: {aut_google_scholar_id: '12345'}
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
        expect(wrapper.find('RaisedButton').node.props.label).toEqual(locale.pages.authorIdentifiers.googleScholar.buttonLabels.edit);
        expect(wrapper.find('FlatButton').length).toEqual(1);
        expect(wrapper.find('FlatButton').node.props.label).toEqual(locale.pages.authorIdentifiers.googleScholar.buttonLabels.cancel);

    });

    it('redirects to the dashbaord', () => {
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

    it('it should go back to the dashboard if the submission succeeded', () => {
        const testMethod = jest.fn();
        const wrapper = setup({accountAuthorLoading: false, submitSucceeded: false, history: {push: testMethod}});
        wrapper.setProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalledWith('/dashboard');
    });

    it('should render an empty div if there is no author data after loading', () => {
        const wrapper = setup({accountAuthorLoading: false, author: null, initialValues: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
