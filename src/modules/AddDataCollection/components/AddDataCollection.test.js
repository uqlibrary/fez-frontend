import AddDataCollection from './AddDataCollection';
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
        fileAccessId: testProps.fileAccessId || 3, // PropTypes.number
        actions: {
            logout: jest.fn(),
        },
        ...testProps,
    };

    return getElement(AddDataCollection, props, isShallow);
}

describe('AddDataCollection test', () => {
    it('should render data set form', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(28);
        expect(wrapper.find('WithStyles(Button)').length).toEqual(2);
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
            if (field.props().label === formLocale.addDataset.submit) {
                expect(field.props().disabled).toEqual(true);
            }
        });
    });

    it('should not disable submit button if form submit has failed', () => {
        const wrapper = setup({ submitFailed: true });
        expect(wrapper.find('WithStyles(Button)').length).toEqual(2);

        wrapper.find('WithStyles(Button)').forEach(field => {
            if (field.props().label === formLocale.addDataset.submit) {
                expect(field.props().disabled).toEqual(false);
            }
        });
    });

    it('should redirect to cancel page', () => {
        window.location.reload = jest.fn();
        setup({}).instance()
            ._restartWorkflow();
        expect(window.location.reload).toHaveBeenCalled();
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
});
