import FixRecord from './FixRecord';
import { mockRecordToFix } from 'mock/data/testing/records';
import Immutable from 'immutable';

function setup(testProps) {
    const props = {
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        dirty: true,
        form: 'form',
        initialized: false,
        submitFailed: false,
        valid: true,
        pure: true,
        pristine: true,
        submitAsSideEffect: false,
        submitting: false,
        invalid: false,
        submitSucceeded: false,
        recordToFix: testProps.recordToFix,
        loadingRecordToFix: testProps.loadingRecordToFix || false,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        author: testProps.author || { aut_id: 410 },

        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues:
            testProps.initialValues ||
            Immutable.Map({
                publication: Immutable.Map(testProps.recordToFix || mockRecordToFix),
                author: Immutable.Map(testProps.author || { aut_id: 410 }),
            }),
        actions: testProps.actions || {},
        history: testProps.history || { go: jest.fn() },
        match: testProps.match || {},

        publicationToFixFileUploadingError: testProps.publicationToFixFileUploadingError || false,
        ...testProps,
    };
    return getElement(FixRecord, props);
}

describe('Component FixRecord', () => {
    it('should render loader when author is loading', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix, accountAuthorLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loader when record is loading', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix, loadingRecordToFix: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect if author not linked', () => {
        const testMethod = jest.fn();
        setup({ author: { aut_id: 1001 }, recordToFix: mockRecordToFix, history: { go: testMethod } });
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix });
        expect(toJson(wrapper)).toMatchSnapshot();

        // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);
    });

    it('should render fix record form', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix });
        wrapper.setState({ selectedRecordAction: 'fix' });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(5);
    });

    it('should set action for form', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix });
        wrapper.instance()._actionSelected('', 'fix');
        expect(wrapper.state().selectedRecordAction).toEqual('fix');
    });

    it('should render unclaim form', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix });
        wrapper.setState({ selectedRecordAction: 'unclaim' });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
    });

    it('should set local variables', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix });
        wrapper.setState({ selectedRecordAction: 'unclaim' });
        wrapper.instance()._setSuccessConfirmation('successBox');
        expect(wrapper.instance().successConfirmationBox).toEqual('successBox');
    });

    it('should redirect to other pages', () => {
        const testMethod = jest.fn();
        const goBack = jest.fn();

        const wrapper = setup({ recordToFix: mockRecordToFix, history: { push: testMethod, goBack: goBack } });
        wrapper.instance()._navigateToMyResearch();
        expect(testMethod).toHaveBeenCalledWith('/records/mine');

        wrapper.instance()._navigateToDashboard();
        expect(testMethod).toHaveBeenCalledWith('/dashboard');

        wrapper.instance()._cancelFix();
        expect(goBack).toHaveBeenCalled();
    });

    it('should clear record to fix when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ recordToFix: mockRecordToFix, actions: { clearFixRecord: actionFunction } });
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should load record if record is not loaded', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({
            loadingRecordToFix: false,
            recordToFix: null,
            actions: { loadRecordToFix: actionFunction },
            match: { params: { pid: 'UQ:1001' } },
        });
        wrapper.update;
        wrapper.instance().componentDidMount();
        expect(actionFunction).toHaveBeenCalledWith('UQ:1001');
    });

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ recordToFix: mockRecordToFix });
        wrapper.instance().successConfirmationBox = { showConfirmation: testMethod };
        wrapper.instance().UNSAFE_componentWillReceiveProps({ submitSucceeded: true });
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render the confirm dialog box with an alert due to a file upload failure', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix, publicationToFixFileUploadingError: true });
        wrapper.setState({ selectedRecordAction: 'fix' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render the confirm dialog box without an alert due to a file upload success', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix, publicationToFixFileUploadingError: false });
        wrapper.setState({ selectedRecordAction: 'fix' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix, publicationToFixFileUploadingError: false });
        const testFN = jest.fn();
        const event = { preventDefault: testFN };
        wrapper.instance()._handleDefaultSubmit(event);
        expect(testFN).toHaveBeenCalled();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({ recordToFix: mockRecordToFix, publicationToFixFileUploadingError: false });
        wrapper.instance()._handleDefaultSubmit();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('UNSAFE_componentWillReceiveProps()', () => {
        const wrapper = setup({
            submitSucceeded: true,
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false,
        });
        const nextProps = { submitSucceeded: true };
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('componentWillUnmount()', () => {
        const testFN = jest.fn();
        const wrapper = setup({
            actions: { clearFixRecord: testFN },
            submitSucceeded: true,
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false,
        });
        wrapper.instance().componentWillUnmount();
        expect(testFN).toHaveBeenCalled();
    });
});
