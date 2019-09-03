import PublicationForm from './PublicationForm';
import Immutable from 'immutable';

jest.mock('config/general', () => ({
    NEW_DOCTYPES_OPTIONS: [1, 2, 3],
    DOCTYPE_SUBTYPE_MAPPING: {
        1: { name: 'test1Name' },
        2: { name: 'test2Name' },
    },
}));

function setup(testProps = {}) {
    const props = {
        anyTouched: true,
        asyncValidate: jest.fn(),
        asyncValidating: false,
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        clearFields: jest.fn(),
        clearSubmit: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dirty: true,
        dispatch: jest.fn(),
        form: 'form',
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        handleSubmit: jest.fn(),
        initialize: jest.fn(),
        initialized: false,
        invalid: false,
        onFormCancel: testProps.onFormCancel || jest.fn(),
        onFormSubmitSuccess: testProps.onFormSubmitSuccess || jest.fn(),
        pristine: testProps.pristine || false,
        pure: true,
        reset: jest.fn(),
        resetSection: jest.fn(),
        submit: jest.fn(),
        submitAsSideEffect: false,
        submitFailed: false,
        submitSucceeded: false,
        submitting: testProps.submitting || false,
        touch: jest.fn(),
        untouch: jest.fn(),
        valid: true,
        ...testProps,
    };
    return getElement(PublicationForm, props);
}

describe('Component PublicationForm', () => {
    it('should render properly with non-matching doctype data arrays', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
