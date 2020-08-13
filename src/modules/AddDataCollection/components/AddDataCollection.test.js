import AddDataCollection, { licenseText } from './AddDataCollection';
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
        submitAsSideEffect: false,
        // common immutable props above
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        submitting: testProps.submitting || false, // : PropTypes.bool
        submitSucceeded: testProps.submitSucceeded || false, // : PropTypes.bool
        invalid: testProps.invalid || false, // : PropTypes.bool
        pristine: testProps.pristine || false, // : PropTypes.bool
        fileAccessId: testProps.fileAccessId || 3, // PropTypes.number
        actions: {
            logout: jest.fn(),
        },
        resetForm: testProps.resetForm || jest.fn(),
        ...testProps,
    };

    return getElement(AddDataCollection, props);
}

describe('AddDataCollection test', () => {
    it('should render data set form', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(28);
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });

    it('should disable submit button if invalid form data before submit', () => {
        const wrapper = setup({ disableSubmit: true });
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);

        wrapper.find('WithStyles(ForwardRef(Button))').forEach(field => {
            if (field.props().label === formLocale.addDataset.submit) {
                expect(field.props().disabled).toEqual(true);
            }
        });
    });

    it('should not disable submit button if form submit has failed', () => {
        const wrapper = setup({ submitFailed: true });
        expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toEqual(2);

        wrapper.find('WithStyles(ForwardRef(Button))').forEach(field => {
            if (field.props().label === formLocale.addDataset.submit) {
                expect(field.props().disabled).toEqual(false);
            }
        });
    });

    it('should redirect to cancel page', () => {
        const { location } = window;
        delete window.location;
        window.location = { reload: jest.fn() };
        setup({})
            .instance()
            ._restartWorkflow();
        expect(window.location.reload).toHaveBeenCalled();
        window.location = location;
    });

    it('should navigate to my datasets url', () => {
        const clearNewRecordFn = jest.fn();
        const pushFn = jest.fn();
        const wrapper = setup({
            actions: {
                clearNewRecord: clearNewRecordFn,
            },
            history: {
                push: pushFn,
            },
        });

        wrapper.instance()._navigateToMyDatasets();

        expect(clearNewRecordFn).toHaveBeenCalled();
        expect(pushFn).toHaveBeenCalledWith('/data-collections/mine');
    });

    it('should show confirmation on form submitted', () => {
        const showConfirmationFn = jest.fn();
        const wrapper = setup({});
        wrapper.instance().confirmationBox = { showConfirmation: showConfirmationFn };
        wrapper.setProps({
            submitSucceeded: true,
        });
        expect(showConfirmationFn).toHaveBeenCalled();

        showConfirmationFn.mockClear();
        wrapper.setProps({
            submitSucceeded: true,
        });
        expect(showConfirmationFn).not.toBeCalled();
    });

    it('should set confirmation box ref', () => {
        const wrapper = setup({});
        wrapper.instance()._handleRef({ ref: 'test' });
        expect(wrapper.instance().confirmationBox).toEqual({ ref: 'test' });
    });

    it('should get save confirmation locale correctly', () => {
        const wrapper = setup({
            newRecordFileUploadingOrIssueError: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with an invalid collection date range', () => {
        const wrapper = setup({
            initialValues: {
                fez_record_search_key_start_date: {
                    rek_start_date: '2018-06-30',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2018-04-30', // before the start date - invalid!
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with a valid collection date range', () => {
        const wrapper = setup({
            initialValues: {
                fez_record_search_key_start_date: {
                    rek_start_date: '2018-06-30',
                },
                fez_record_search_key_end_date: {
                    rek_end_date: '2018-07-30',
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not generate an error when licence locale is missing', () => {
        // licence text not supplied
        expect(toJson(licenseText())).toMatchSnapshot();

        // licence text lacks required internal structure
        expect(toJson(licenseText(['something']))).toMatchSnapshot();
    });
});
