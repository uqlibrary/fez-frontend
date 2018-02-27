jest.unmock('./FixRecord');

import FixRecord from './FixRecord';
import {mockRecordToFix} from 'mock/data/testing/records';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        recordToFix: testProps.recordToFix || mockRecordToFix,
        loadingRecordToFix: testProps.loadingRecordToFix || false,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        author: testProps.author || {aut_id: 410},

        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues: testProps.initialValues ||
            Immutable.Map({
                publication: Immutable.Map(testProps.recordToFix || mockRecordToFix),
                author: Immutable.Map(testProps.author || {aut_id: 410})
            }),
        actions: testProps.actions || {},
        history: testProps.history || {},
        match: testProps.match || {},

        publicationToFixFileUploadingError: testProps.publicationToFixFileUploadingError || false
    };
    return getElement(FixRecord, props, isShallow);
}

describe('Component FixRecord', () => {

    it('should render loader when author is loading', () => {
        const wrapper = setup({accountAuthorLoading: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loader when record is loading', () => {
        const wrapper = setup({loadingRecordToFix: true});
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

    it('should return the alert details correctly', () => {
        const wrapper = setup({}).instance();
        // submitting = false, submitSucceeded = false, alertLocale = {}, invalid = false, errors = {}}
        const testCases = [
            {
                parameters: {submitting: true, alertLocale: {progressAlert: {title: 'submitting' }}},
                expected: 'submitting'
            },
            {
                parameters: {submitSucceeded: true, alertLocale: {successAlert: {title: 'submitSucceeded' }}},
                expected: 'submitSucceeded'
            },
            {
                parameters: {submitFailed: true, error: 'This is an error', alertLocale: {errorAlert: {title: 'submitFailed', message: jest.fn() }}},
                expected: 'submitFailed'
            },
            {
                parameters: {invalid: true, errors: {one: 'one', two: 'two'}, alertLocale: {validationAlert: {title: 'validationError'}}},
                expected: 'validationError'
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

    it('should load record if record is not loaded', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({loadingRecordToFix: false, recordToFix: null, actions: {loadRecordToFix: actionFunction}, match: {params: {pid: 'UQ:1001'}}}, false);
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.instance().successConfirmationBox = {showConfirmation: testMethod};
        wrapper.instance().componentWillReceiveProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render the confirm dialog box with an alert due to a file upload failure', () => {
        const wrapper = setup({publicationToFixFileUploadingError: true});
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('should render the confirm dialog box without an alert due to a file upload success', () => {
        const wrapper = setup({publicationToFixFileUploadingError: false});
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

});
