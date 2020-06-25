import CollectionForm from './CollectionForm';
import Immutable from 'immutable';
import { default as formLocale } from 'locale/publicationForm';

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

    return getElement(CollectionForm, props);
}

describe('Collection form', () => {
    it('should render form with only the community dropdown', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
    });

    it('should render the full form', () => {
        const wrapper = setup({
            formValues: {
                get: () => {
                    return [1, 2, 3];
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(4);
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
    });

    it('should render success panel', () => {
        const wrapper = setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not disable submit button if form submit has failed', () => {
        const wrapper = setup({ submitFailed: true });
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
        wrapper.find('WithStyles(ForwardRef(Button))').forEach(field => {
            if (field.props().label === formLocale.thesisSubmission.submit) {
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
        expect(wrapper.find('NavigationDialogBox').length).toEqual(1);
    });

    it('should display successfull submission screen', () => {
        const wrapper = setup({});
        wrapper.setProps({ submitSucceeded: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('Collection form - redirections', () => {
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
        expect(window.location.assign).toBeCalledWith('/');
    });

    it('should redirect to after submit page', () => {
        setup({})
            .instance()
            .afterSubmit();
        expect(window.location.assign).toBeCalledWith('/');
    });

    it('should reload the page', () => {
        setup({})
            .instance()
            .reloadForm();
        expect(window.location.reload).toBeCalled();
    });
});
