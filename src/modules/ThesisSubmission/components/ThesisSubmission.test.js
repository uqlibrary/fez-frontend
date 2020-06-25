import ThesisSubmission from './ThesisSubmission';
import Immutable from 'immutable';
import { default as formLocale } from 'locale/publicationForm';

function setup(testProps, isShallow = true) {
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
        handleSubmit: jest.fn(),
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
        // common immutable props above
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        submitAsSideEffect: false,
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

    return getElement(ThesisSubmission, props, isShallow);
}

describe('ThesisSubmission', () => {
    it('should render sbs thesis submission form', () => {
        const wrapper = setup({ isHdrThesis: false });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(9);
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
    });

    it('should render hdr thesis submission form', () => {
        const wrapper = setup({ isHdrThesis: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render hdr thesis submission acknowledgement', () => {
        const wrapper = setup({ isHdrThesis: true, submitSucceeded: true });
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
        const submitButton = wrapper.find('#submit-thesis');
        expect(submitButton.props().disabled).toEqual(true);
    });

    it('should not disable submit button if form submit has failed', () => {
        const wrapper = setup({ error: true });
        const submitButton = wrapper.find('#submit-thesis');
        expect(submitButton.props().disabled).toBeFalsy();
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

    it('should display confirmation box before submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({});
        wrapper.instance().depositConfirmationBox = { showConfirmation: testMethod };
        wrapper.instance().openDepositConfirmation();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should trigger openDepositConfirmation() when conditions are met', () => {
        const wrapper = setup({});
        wrapper.instance().openDepositConfirmation = jest.fn();
        wrapper.instance().UNSAFE_componentWillReceiveProps({
            isSessionValid: true,
            submitting: false,
        });
        expect(wrapper.instance().openDepositConfirmation).toBeCalled();
    });

    it('should invoke callback for session check', () => {
        const wrapper = setup({});
        wrapper.instance().deposit();
        expect(wrapper.instance().props.actions.checkSession).toBeCalled();
    });

    it('should set depositConfirmationBox properly', () => {
        const wrapper = setup({});
        wrapper.instance().depositConfirmationBox = null;
        const test = 'test setDepositConfirmation';
        wrapper.instance().setDepositConfirmation(test);
        expect(wrapper.instance().depositConfirmationBox).toEqual(test);
    });

    it('should show the file upload alert', () => {
        const wrapper = setup({
            author: { aut_fname: 'First', aut_lname: 'Last', aut_org_student_id: '1234567' },
            newRecordFileUploadingOrIssueError: true,
            submitSucceeded: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a helper to generate alert props', () => {
        const wrapper = setup({ error: true });
        expect(wrapper.instance().getFormSubmitAlertProps()).toMatchSnapshot();
    });
});

describe('ThesisSubmission form - redirections', () => {
    const { location } = window;

    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };
    });

    afterAll(() => {
        window.location = location;
    });

    it('should redirect to cancel page', () => {
        setup({})
            .instance()
            .cancelSubmit();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(formLocale.thesisSubmission.cancelLink));
    });

    it('should redirect to after submit page', () => {
        setup({})
            .instance()
            .afterSubmit();
        expect(window.location.assign).toBeCalledWith(
            expect.stringContaining(formLocale.thesisSubmission.afterSubmitLink),
        );
    });
});
