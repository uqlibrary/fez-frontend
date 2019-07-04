import SbsSubmission from './SbsSubmission';
import Immutable from 'immutable';
import { default as formLocale } from 'locale/publicationForm';

function setup(testProps, isShallow = true) {
    const props = {
        'array': {
            insert: jest.fn(),
            move: jest.fn(),
            pop: jest.fn(),
            push: jest.fn(),
            remove: jest.fn(),
            removeAll: jest.fn(),
            shift: jest.fn(),
            splice: jest.fn(),
            swap: jest.fn(),
            unshift: jest.fn(),
        },
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        'anyTouched': true,
        'asyncValidating': false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        handleSubmit: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        'dirty': true,
        'form': 'form',
        'initialized': false,
        'submitFailed': false,
        'valid': true,
        pure: true,
        // common immutable props above
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        submitting: testProps.submitting || false, // : PropTypes.bool
        submitSucceeded: testProps.submitSucceeded || false, // : PropTypes.bool
        invalid: testProps.invalid || false, // : PropTypes.bool
        pristine: testProps.pristine || false, // : PropTypes.bool
        isHdrThesis: testProps.isHdrThesis || false, // : PropTypes.bool
        fileAccessId: testProps.fileAccessId || 3, // PropTypes.number
        actions: {
            logout: jest.fn(),
            checkSession: jest.fn(),
            clearSessionExpiredFlag: jest.fn(),
        },
        ...testProps,
    };

    return getElement(SbsSubmission, props, isShallow);
}

describe('SbsSubmission test', () => {
    it('should render sbs thesis submission form', () => {
        const wrapper = setup({ isHdrThesis: false });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(12);
        expect(wrapper.find('WithStyles(Button)').length).toEqual(2);
    });

    it('should render sbs thesis submission form', () => {
        const wrapper = setup({ isHdrThesis: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render sbs thesis submission acknowledgement', () => {
        const wrapper = setup({ isHdrThesis: false, submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });

    it('should disable submit button if invalid form data before submit', () => {
        const wrapper = setup({ disableSubmit: true });
        expect(wrapper.find('WithStyles(Button)').length).toEqual(2);

        wrapper.find('WithStyles(Button)').forEach(field => {
            if (field.props().label == formLocale.thesisSubmission.submit) {
                expect(field.props().disabled).toEqual(true);
            }
        });
    });

    it('should not disable submit button if form submit has failed', () => {
        const wrapper = setup({ submitFailed: true });
        expect(wrapper.find('WithStyles(Button)').length).toEqual(2);

        wrapper.find('WithStyles(Button)').forEach(field => {
            if (field.props().label == formLocale.thesisSubmission.submit) {
                expect(field.props().disabled).toEqual(false);
            }
        });
    });

    it('should ask when redirecting from form with data (even if submit failed)', () => {
        const wrapper = setup({ dirty: true, submitSucceeded: false });
        expect(wrapper.find('NavigationDialogBox').length).toEqual(1);
    });

    it('should not ask when redirecting from form with data after successful submit', () => {
        const wrapper = setup({ dirty: true, submitSucceeded: true });
        expect(wrapper.find('NavigationDialogBox').length).toEqual(0);
    });

    it('should display successfull submission screen', () => {
        const wrapper = setup({});
        wrapper.setProps({ submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to after submit page', () => {
        window.location.assign = jest.fn();
        const wrapper = setup({}).instance()
            .afterSubmit();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(formLocale.thesisSubmission.afterSubmitLink));
    });

    it('should display confirmation box before submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.instance().depositConfirmationBox = { showConfirmation: testMethod };
        wrapper.instance().openDepositConfirmation();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should display confirmation box after submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.instance().openDepositConfirmation = testMethod;
        wrapper.setProps({ isSessionValid: true, submitting: false });
        wrapper.update();
        expect(testMethod).toHaveBeenCalled();
    });

    it('deposit() method', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ actions: { checkSession: testMethod } });
        wrapper.instance().deposit();
        expect(testMethod).toHaveBeenCalled();
    });

    it('cancelSubmit() method', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        delete global.window.location;
        global.window.location = { reload: testMethod };
        wrapper.instance().cancelSubmit();
        expect(testMethod).toHaveBeenCalled();
    });

    it('setDepositConfirmation(ref) method', () => {
        const ref = 'Hello';
        const wrapper = setup({});
        wrapper.instance().setDepositConfirmation(ref);
        expect(wrapper.instance().depositConfirmationBox).toEqual(ref);
    });

    it('should reload when told to', () => {
        const wrapper = setup({ initialValues: {} });
        wrapper.instance().afterFailedSubmit();
    });

    it('should render sbs thesis submission form', () => {
        const wrapper = setup({ newRecordFileUploadingOrIssueError: true, submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
