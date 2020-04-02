import Immutable from 'immutable';
import CreativeWorkForm from './CreativeWorkForm';

function setup(testProps = {}) {
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
        invalid: false,
        submitFailed: false,
        submitSucceeded: false,
        valid: true,
        pure: true,
        // above are common immutable default props
        formValues: testProps.initialValues ? Immutable.Map(testProps.initialValues) : Immutable.Map({}),
        onFormCancel: testProps.onFormCancel || jest.fn(),
        onFormSubmitSuccess: testProps.onFormSubmitSuccess || jest.fn(),
        submitting: testProps.submitting || false,
        pristine: testProps.pristine || false,
        author: testProps.author || null,
        actions: testProps.actions || {},
        history: testProps.history || {
            push: jest.fn(),
        },
        ...testProps,
    };
    return getElement(CreativeWorkForm, props);
}

describe('CreativeWorkForm validation ', () => {
    it('should validate dates correctly', () => {
        const testProps = {
            initialValues: {
                rek_date: '2018-06-01',
                fez_record_search_key_end_date: {
                    rek_end_date: '2018-01-01', // before the start date - invalid!
                },
            },
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
