import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import FixRecord from './FixRecord';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {mockRecordToFix} from 'mock/data/testing/records';
import {MemoryRouter } from 'react-router-dom'
import {Provider} from 'react-redux';


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

function setup({recordToFix = mockRecordToFix, recordToFixLoading, accountAuthorLoading, handleSubmit, match,
                   initialValues, actions, author = {aut_id: 410}, history = {go: jest.fn()}, isShallow = true}){
    const props = {
        recordToFix: recordToFix,
        recordToFixLoading: recordToFixLoading || false,

        accountAuthorLoading: accountAuthorLoading || false,
        author: author,

        handleSubmit: handleSubmit || jest.fn(),
        initialValues: initialValues ||
            Immutable.Map({
                publication: Immutable.Map(recordToFix),
                author: Immutable.Map(author)
            }),
        actions: actions || {},
        history: history || {},
        match: match || {}
    };

    if(isShallow) {
        return shallow(<FixRecord {...props} />);
    }

    return mount(
        <Provider store={create().store}>
            <MemoryRouter><FixRecord {...props} /></MemoryRouter>
        </Provider>, {
            context: {
                muiTheme: getMuiTheme()
            },
            childContextTypes: {
                muiTheme: PropTypes.object.isRequired
            }
        });
}

beforeAll(() => {
    injectTapEventPlugin();
});


describe('Component FixRecord ', () => {
    it('should render loader when author is loading', () => {
        const wrapper = setup({accountAuthorLoading: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loader when record is loading', () => {
        const wrapper = setup({recordToFixLoading: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect if author not linked', () => {
        const testMethod = jest.fn();
        const wrapper = setup({author: {aut_id: 1001}, recordToFix: mockRecordToFix, history: {go: testMethod}});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('MenuItem').length).toEqual(2);
        expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('MenuItem').length).toEqual(2);
        expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
    });

    it('should render fix record form', () => {
        const wrapper = setup({});
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(4);
        expect(wrapper.find('RaisedButton').length).toEqual(2);

    });

    it('should set action for form', () => {
        const wrapper = setup({});
        wrapper.instance()._actionSelected('', 'fix');
        expect(wrapper.state().selectedRecordAction).toEqual('fix');
    });

    it('should render unclaim form', () => {
        const wrapper = setup({});
        wrapper.setState({selectedRecordAction: 'unclaim'});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        expect(wrapper.find('Field').length).toEqual(1);
    });

    it('should set local variables', () => {
        const wrapper = setup({});
        wrapper.setState({selectedRecordAction: 'unclaim'});
        wrapper.instance()._setSuccessConfirmation('successBox');
        expect(wrapper.instance().successConfirmationBox).toEqual('successBox');
    });

    it('should submit form when user hits Enter', () => {
        const testMethod = jest.fn();
        const wrapper = setup({handleSubmit: testMethod});
        wrapper.setState({selectedRecordAction: 'unclaim'});
        wrapper.instance()._handleKeyboardFormSubmit({key: 'Enter', preventDefault: jest.fn()});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should not submit form when user hits shift+Enter', () => {
        const testMethod = jest.fn();
        const wrapper = setup({handleSubmit: testMethod});
        wrapper.setState({selectedRecordAction: 'unclaim'});
        wrapper.instance()._handleKeyboardFormSubmit({key: 'Enter', shiftKey: true, preventDefault: jest.fn()});
        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should redirect to other pages', () => {
        const testMethod = jest.fn();

        const wrapper = setup({history: {push: testMethod}});
        wrapper.instance()._navigateToMyResearch();
        expect(testMethod).toHaveBeenCalledWith('/records/mine');

        wrapper.instance()._navigateToDashboard();
        expect(testMethod).toHaveBeenCalledWith('/dashboard');
    });

    it('should display alert', () => {
        const wrapper = setup({}).instance();
        const testCases = [
            {
                parameters: {submitFailed: true, error: true, alertLocale: {errorAlert: {title: 'submitFailed' }}},
                expected: 'submitFailed'
            },
            {
                parameters: {dirty: true, invalid: true, alertLocale: {validationAlert: {title: 'validationFailed'}}},
                expected: 'validationFailed'
            },
            {
                parameters: {submitting: true, alertLocale: {progressAlert: {title: 'submitting' }}},
                expected: 'submitting'
            },
            {
                parameters: {submitSucceeded: true, alertLocale: {successAlert: {title: 'submitSucceeded' }}},
                expected: 'submitSucceeded'
            }
        ];

        testCases.forEach(testCase => {
            const alert = wrapper.getAlert({...testCase.parameters});
            expect(alert.props.title).toEqual(testCase.expected);
        });
    });

    it('should clear record to fix when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({actions: {clearFixRecord: actionFunction}});
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should load author if author is not loaded', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({isShallow: false, accountAuthorLoading: false, author: null, actions: {loadCurrentAccount: actionFunction}});
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should load record if record is not loaded', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({isShallow: false, recordToFixLoading: false,
            recordToFix: null, actions: {loadRecordToFix: actionFunction}, match: {params: {pid: 'UQ:1001'}}});
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.instance().successConfirmationBox = {showConfirmation: testMethod};
        wrapper.instance().componentWillReceiveProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });
});
