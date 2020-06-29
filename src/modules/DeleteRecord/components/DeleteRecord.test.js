import DeleteRecord from './DeleteRecord';
import { mockRecordToDelete, mockRecordToFix } from 'mock/data/testing/records';
import Immutable from 'immutable';
import { UQDOIPrefix } from 'config/general';

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
        recordToDelete: testProps.recordToDelete,
        loadingRecordToDelete: testProps.loadingRecordToDelete || false,

        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues:
            testProps.initialValues ||
            Immutable.Map({
                publication: Immutable.Map(testProps.recordToDelete || mockRecordToDelete),
            }),
        actions: testProps.actions || {},
        history: testProps.history || { go: jest.fn() },
        match: testProps.match || {},

        ...testProps,
    };
    return getElement(DeleteRecord, props);
}

describe('Component DeleteRecord', () => {
    it('should render loader when record is loading', () => {
        const wrapper = setup({ recordToDelete: mockRecordToDelete, loadingRecordToDelete: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render delete record form with record citation', () => {
        const wrapper = setup({ recordToDelete: mockRecordToDelete });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
    });

    it('should display alert and disable delete button on records with UQ DOIs', () => {
        const wrapper = setup({
            recordToDelete: { ...mockRecordToDelete, fez_record_search_key_doi: { rek_doi: `${UQDOIPrefix}12345` } },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('#submit-delete-record').props().disabled).toEqual(true);
        expect(wrapper.find('Field').length).toEqual(0);
    });

    it('should redirect to other pages', () => {
        const testMethod = jest.fn();
        const goBack = jest.fn();
        const loadRecordToDelete = jest.fn();
        const pid = 'UQ:1';
        const wrapper = setup({
            recordToDelete: mockRecordToDelete,
            actions: { loadRecordToDelete: loadRecordToDelete },
            match: { params: { pid: pid } },
            history: { push: testMethod, goBack: goBack },
        });
        wrapper.instance()._navigateToViewPage();
        wrapper.instance()._navigateToSearchPage();
        expect(testMethod.mock.calls.length).toBe(2);
        expect(testMethod.mock.calls[0][0]).toBe(`/view/${pid}`);
        expect(testMethod.mock.calls[1][0]).toBe('/records/search');

        wrapper.instance()._cancel();
        expect(goBack).toHaveBeenCalled();
    });

    it('should clear record to delete when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ recordToDelete: mockRecordToDelete, actions: { clearDeleteRecord: actionFunction } });
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should load record if record is not loaded', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({
            loadingRecordToDelete: false,
            recordToDelete: null,
            actions: { loadRecordToDelete: actionFunction },
            match: { params: { pid: 'UQ:1001' } },
        });
        wrapper.update;
        wrapper.instance().componentDidMount();
        expect(actionFunction).toHaveBeenCalledWith('UQ:1001');
    });

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ recordToDelete: mockRecordToDelete });
        wrapper.instance().successConfirmationBox = { showConfirmation: testMethod };
        wrapper.instance().UNSAFE_componentWillReceiveProps({ submitSucceeded: true });
        expect(testMethod).toHaveBeenCalled();
    });

    it('should set local variables', () => {
        const wrapper = setup({ recordToDelete: mockRecordToDelete });
        wrapper.instance()._setSuccessConfirmation('successBox');
        expect(wrapper.instance().successConfirmationBox).toEqual('successBox');
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({ recordToDelete: mockRecordToDelete });
        const testFN = jest.fn();
        const event = { preventDefault: testFN };
        wrapper.instance()._handleDefaultSubmit(event);
        expect(testFN).toHaveBeenCalled();
    });

    it('UNSAFE_componentWillReceiveProps()', () => {
        const wrapper = setup({
            submitSucceeded: true,
            recordToDelete: mockRecordToDelete,
        });
        const nextProps = { submitSucceeded: true };
        wrapper.instance().UNSAFE_componentWillReceiveProps(nextProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('componentWillUnmount()', () => {
        const testFN = jest.fn();
        const wrapper = setup({
            actions: { clearDeleteRecord: testFN },
            submitSucceeded: true,
            recordToDelete: mockRecordToDelete,
        });
        wrapper.instance().componentWillUnmount();
        expect(testFN).toHaveBeenCalled();
    });
});
