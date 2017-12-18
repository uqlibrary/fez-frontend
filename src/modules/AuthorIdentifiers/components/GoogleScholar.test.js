import GoogleScholar from './GoogleScholar';
import {currentAuthor} from 'mock/data/account';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        author: testProps.author || null,
        actions: testProps.actions || {
            showAppAlert: jest.fn(),
            dismissAppAlert: jest.fn(),
            resetSavingAuthorState: jest.fn()
        },
        history: testProps.history || {push: jest.fn()},

        // redux form props
        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues: testProps.initialValues || {
            aut_id: !!testProps.author ? testProps.author.aut_id : '',
            aut_google_scholar_id: !!testProps.author ? testProps.author.aut_google_scholar_id : ''
        },
        submitSucceeded: testProps.submitSucceeded || false,
        submitFailed: testProps.submitFailed || false,
        error: testProps.error || null
    };

    return getElement(GoogleScholar, props, isShallow);
}

describe('Component GoogleScholar ', () => {

    it('should render nothing if author is not loaded', () => {
        const wrapper = setup({
            accountAuthorLoading: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render form if author doesn\'t have google scholar id', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.requiredField').length).toEqual(1);
    });

    it('should render form if author has google scholar id', () => {
        const wrapper = setup({
            author: currentAuthor.uqresearcher.data
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.requiredField').length).toEqual(1);
    });

    it('should redirect to the dashbaord', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data
        });
        wrapper.instance()._navigateToDashboard();
        expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/dashboard');
    });

    it('should submit form when user hits Enter', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data
        });
        wrapper.instance()._handleKeyboardFormSubmit({key: 'Enter', preventDefault: jest.fn()});
        expect(wrapper.instance().props.handleSubmit).toHaveBeenCalled();
    });

    it('should NOT submit the form when user hits shift+Enter', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
        });
        wrapper.instance()._handleKeyboardFormSubmit({key: 'Enter', shiftKey: true, preventDefault: jest.fn()});
        expect(wrapper.instance().props.handleSubmit).not.toHaveBeenCalled();
    });

    it('should go back to the dashboard if the submission succeeded', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data
        });
        wrapper.setProps({submitSucceeded: true});
        expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/dashboard');
    });

    it('should dispatch action to display success alert', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data
        });
        wrapper.setProps({submitSucceeded: true});
        expect(wrapper.instance().props.actions.showAppAlert).toHaveBeenCalled();
    });

    it('should display submission error if saving failed', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
            submitFailed: true, error: 'failed!'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display submission in progress alert', () => {
        const wrapper = setup({
            author: currentAuthor.uqnoauthid.data,
            submitting: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to dashboard if user is not an author', () => {
        const wrapper = setup({});
        wrapper.instance().componentWillMount();
        expect(wrapper.instance().props.history.push).toHaveBeenCalled();
    });

    it('should reset author update state when component is unmounted', () => {
        const wrapper = setup({});
        wrapper.instance().componentWillUnmount();
        expect(wrapper.instance().props.actions.resetSavingAuthorState).toHaveBeenCalled();
    });
});
