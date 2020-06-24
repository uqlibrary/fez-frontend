import GoogleScholar from './GoogleScholar';
import { currentAuthor } from 'mock/data/account';

jest.mock('redux-form/immutable');

function setup(testProps = {}, args = {}) {
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
        invalid: false,
        valid: true,
        pure: true,
        pristine: true,
        submitting: false,
        accountAuthorLoading: testProps.accountAuthorLoading || false,
        author: testProps.author || null,
        actions: testProps.actions || {
            showAppAlert: jest.fn(),
            dismissAppAlert: jest.fn(),
            resetSavingAuthorState: jest.fn(),
        },
        history: testProps.history || { push: jest.fn() },

        // redux form props
        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues: testProps.initialValues || {
            aut_id: !!testProps.author ? testProps.author.aut_id : '',
            aut_google_scholar_id: !!testProps.author ? testProps.author.aut_google_scholar_id : '',
        },
        submitSucceeded: testProps.submitSucceeded || false,
        submitFailed: testProps.submitFailed || false,
        error: testProps.error || null,
        ...testProps,
    };

    return getElement(GoogleScholar, props, args);
}

describe('Component GoogleScholar ', () => {
    it('should render nothing if author is not loaded', () => {
        const wrapper = setup({
            accountAuthorLoading: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it("should render form if author doesn't have google scholar id", () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.requiredField').length).toEqual(1);
    });

    it('should render form if author has google scholar id', () => {
        const wrapper = setup({
            author: currentAuthor.uqresearcher.data,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.requiredField').length).toEqual(1);
    });

    it('should redirect to the dashbaord', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
        });
        wrapper.instance()._navigateToDashboard();
        expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/dashboard');
    });

    it('should go back to the dashboard if the submission succeeded', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
        });
        wrapper.setProps({ submitSucceeded: true });
        expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/dashboard');
    });

    it('should dispatch action to display success alert', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
        });
        wrapper.setProps({ submitSucceeded: true });
        expect(wrapper.instance().props.actions.showAppAlert).toHaveBeenCalled();
    });

    it('should display submission error if saving failed', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
            submitFailed: true,
            error: 'failed!',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display submission in progress alert', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
            submitting: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to dashboard if user is not an author', () => {
        const wrapper = setup();
        wrapper.instance().UNSAFE_componentWillMount();
        expect(wrapper.instance().props.history.push).toHaveBeenCalled();
    });

    it('should not redirect to dashboard if submit success state has not changed', () => {
        const wrapper = setup();
        wrapper.instance().UNSAFE_componentWillReceiveProps({
            submitSucceeded: wrapper.instance().props.submitSucceeded,
        });
        const testFn = jest.spyOn(wrapper.instance(), '_navigateToDashboard');
        expect(testFn).not.toBeCalled();
    });

    it('should reset author update state when component is unmounted', () => {
        const wrapper = setup();
        wrapper.instance().componentWillUnmount();
        expect(wrapper.instance().props.actions.resetSavingAuthorState).toHaveBeenCalled();
    });

    it('should handle keyboard form submit event', () => {
        const handleSubmitFn = jest.fn();
        const wrapper = setup(
            {
                author: currentAuthor.uqnoauthid.data,
                handleSubmit: handleSubmitFn,
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('form').simulate('keyDown', { key: 'Enter' });
        expect(handleSubmitFn).toHaveBeenCalled();

        handleSubmitFn.mockClear();
        wrapper.find('form').simulate('keyDown', { key: 'A' });
        expect(handleSubmitFn).not.toBeCalled();
    });

    it('should get correct alert message', () => {
        const wrapper = setup();
        const alert1 = wrapper.instance().getAlert({});
        expect(alert1).toBeNull();
        const Alert = wrapper.instance().getAlert({
            submitFailed: true,
            error: 'test',
        });
        expect(Alert.props.message).toEqual('test');
    });
});
