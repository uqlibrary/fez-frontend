import Orcid from './Orcid';
import { accounts, currentAuthor } from 'mock/data/account';

function setup(testProps = {}) {
    const props = {
        ...testProps,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        accountAuthorSaving: testProps.accountAuthorSaving || false,
        accountAuthorError: testProps.accountAuthorError || null,
        account: testProps.account || null,
        author: testProps.author || null,
        actions: testProps.actions || {
            linkAuthorOrcidId: jest.fn(),
            showAppAlert: jest.fn(),
            dismissAppAlert: jest.fn(),
            resetSavingAuthorState: jest.fn(),
        },
        history: testProps.history || {
            push: jest.fn(),
        },
    };
    return getElement(Orcid, props);
}

describe('Component Orcid ', () => {
    const saveLocation = window.location;

    afterEach(() => {
        window.location = saveLocation;
    });

    it('should render nothing if account/author is not loaded', () => {
        const wrapper = setup({ accountAuthorLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render nothing if account is set, but author is null', () => {
        const wrapper = setup({ account: accounts.uqresearcher });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render form uf account/author is set', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to the dashbaord', () => {
        const testMethod = jest.fn();
        const wrapper = setup({ history: { push: testMethod } });
        wrapper.instance()._navigateToDashboard();
        expect(testMethod).toHaveBeenCalledWith('/dashboard');
    });

    it('should construct ORCID url', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });

        wrapper.setState({
            orcidRequest: {
                ...wrapper.state().orcidRequest,
                redirect_uri: 'http://localhost:3000/#/author-identifiers/orcid/link', // dynamic value constructed from window.location
                state: '1234_MOCK_STATE', // dynamic value constructed from date/time
            },
        });

        const expected =
            'http://orcid.org/oauth/authorize?client_id=12345XYZ&response_type=code&scope=%2Fread-limited%20%2Factivities%2Fupdate%20%2Fperson%2Fupdate&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%23%2Fauthor-identifiers%2Forcid%2Flink&state=1234_MOCK_STATE&show_login=true';
        const output = wrapper.instance().getOrcidUrl();
        expect(output).toEqual(expected);
    });

    it('should show confirmation box', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });
        const showConfirmation = jest.fn();
        const getOrcidUrl = jest.spyOn(wrapper.instance(), 'getOrcidUrl');

        wrapper.instance().authoriseConfirmationBox = {
            showConfirmation: showConfirmation,
        };
        wrapper.instance()._showAuthoriseConfirmation();
        expect(showConfirmation).toBeCalled();
        expect(getOrcidUrl).toHaveBeenCalledWith(true);

        delete global.window.location;
        const assignFn = jest.fn();
        global.window.location = {
            assign: assignFn,
        };

        wrapper.instance().authoriseConfirmationBox._onAction();
        expect(assignFn).toHaveBeenCalledWith(
            'http://orcid.org/oauth/authorize?client_id=12345XYZ&response_type=code&scope=%2Fread-limited%20%2Factivities%2Fupdate%20%2Fperson%2Fupdate&redirect_uri=http%3A%2F%2Ffez-staging.library.uq.edu.au%2Fauthor-identifiers%2Forcid%2Flink&state=5a13512116718ae7fbebaf5ce5fcfa83&show_login=true',
        );

        wrapper.instance()._showAuthoriseConfirmation(false);
        wrapper.instance().authoriseConfirmationBox._onAction();

        expect(getOrcidUrl).toHaveBeenCalledWith(false);
        expect(assignFn).toHaveBeenCalledWith(
            'http://orcid.org/oauth/authorize?client_id=12345XYZ&response_type=code&scope=%2Fread-limited%20%2Factivities%2Fupdate%20%2Fperson%2Fupdate&redirect_uri=http%3A%2F%2Ffez-staging.library.uq.edu.au%2Fauthor-identifiers%2Forcid%2Flink&state=5a13512116718ae7fbebaf5ce5fcfa83&show_login=false&family_names=Researcher&given_names=J',
        );
    });

    it('should display appropriate alert message', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });

        const testCases = [
            {
                parameters: { submitFailed: true, error: true, alertLocale: { errorAlert: { title: 'submitFailed' } } },
                expected: 'submitFailed',
            },
            {
                parameters: { submitting: true, alertLocale: { progressAlert: { title: 'submitting' } } },
                expected: 'submitting',
            },
        ];

        testCases.forEach(testCase => {
            const alert = wrapper.instance().getAlert({ ...testCase.parameters });
            expect(alert.props.title).toEqual(testCase.expected);
        });

        expect(wrapper.instance().getAlert({})).toBeNull();
    });

    it('should set ref of confirmation box', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });
        wrapper.instance()._setAuthoriseConfirmation('test');
        expect(wrapper.instance().authoriseConfirmationBox).toEqual('test');
    });

    it('should update state when account is updated via props', () => {
        const wrapper = setup();

        // orcid request state is not set because account hasn't been loaded yet
        expect(wrapper.state().orcidRequest.state).toBeFalsy();

        // existing orcid parameters have names as empty strings because account hasn't been loaded yet
        const expectedBeforeState = { show_login: false, family_names: '', given_names: '' };
        expect(wrapper.state().existingOrcidRequest).toEqual(expectedBeforeState);

        // account has been loaded
        wrapper.instance().UNSAFE_componentWillReceiveProps({ account: accounts.uqresearcher });

        // orcid state should be updated
        expect(wrapper.state().orcidRequest.state).toBeTruthy();

        // user name should be set
        const expectedStateAfter = { show_login: false, family_names: 'Researcher', given_names: 'J' };
        expect(wrapper.state().existingOrcidRequest).toEqual(expectedStateAfter);
    });

    it('should navigate back to dashboard if author already has orcid', () => {
        const wrapper = setup();

        // account/author has been loaded
        wrapper.instance().UNSAFE_componentWillReceiveProps({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });

        expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/dashboard');
    });

    it("should navigate back to dashboard if author's orcid id was updated successfully", () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqnoauthid.data,
        });

        // account/author has been loaded
        wrapper.instance().UNSAFE_componentWillReceiveProps({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });

        expect(wrapper.instance().props.actions.showAppAlert).toHaveBeenCalled();
        expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/dashboard');
    });

    it('should start author update when author is loaded and orcid response received', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: null,
        });

        // mock orcid response
        wrapper.instance().setState({
            orcidRequest: {
                state: 'XYZ',
            },
            orcidResponse: {
                code: '123',
                state: 'XYZ',
            },
        });

        // account/author has been loaded
        wrapper.instance().UNSAFE_componentWillReceiveProps({
            account: accounts.uqresearcher,
            author: currentAuthor.uqnoauthid.data,
        });

        expect(wrapper.instance().props.actions.linkAuthorOrcidId).toHaveBeenCalled();
    });

    it(
        'should NOT start author update when author is loaded and ' +
            "orcid response received but doesn't match the state",
        () => {
            const wrapper = setup({
                account: accounts.uqresearcher,
                author: null,
            });

            // mock orcid response
            wrapper.instance().setState({
                orcidRequest: {
                    state: 'XYZ',
                },
                orcidResponse: {
                    code: '123',
                    state: 'ABC',
                },
            });

            // account/author has been loaded
            wrapper.instance().UNSAFE_componentWillReceiveProps({
                account: accounts.uqresearcher,
                author: currentAuthor.uqnoauthid.data,
            });

            expect(wrapper.instance().props.actions.linkAuthorOrcidId).not.toHaveBeenCalled();
        },
    );

    it('should display error if ORCID url redirect STATE response is invalid', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqnoauthid.data,
        });

        // mock orcid response
        wrapper.instance().setState({
            orcidRequest: {
                state: 'XYZ',
            },
            orcidResponse: {
                code: '123',
                state: 'ABC',
            },
        });

        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display error if author update failed', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqnoauthid.data,
            accountAuthorError: 'API IS NOT AVAILABLE',
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should start author update in componentDidMount() when orcid response received', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqnoauthid.data,
        });

        // mock orcid response
        wrapper.instance().setState({
            orcidRequest: {
                state: 'XYZ',
            },
            orcidResponse: {
                code: '123',
                state: 'XYZ',
            },
        });

        wrapper.instance().componentDidMount();
        expect(wrapper.instance().props.actions.linkAuthorOrcidId).toHaveBeenCalled();
    });

    it('should NOT start author update in componentDidMount() when orcid invalid response received', () => {
        const wrapper = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqnoauthid.data,
        });

        // mock orcid response
        wrapper.instance().setState({
            orcidRequest: {
                state: 'XYZ',
            },
            orcidResponse: {
                code: '123',
                state: 'XYZAAA',
            },
        });

        wrapper.instance().componentDidMount();
        expect(wrapper.instance().props.actions.linkAuthorOrcidId).not.toHaveBeenCalled();
    });

    it('should reset author update state when component is unmounted', () => {
        const wrapper = setup();
        wrapper.instance().componentWillUnmount();
        expect(wrapper.instance().props.actions.resetSavingAuthorState).toHaveBeenCalled();
    });

    it('should set query params correctly with code and state', () => {
        delete window.location;
        global.window.location = { hash: 'http://localhost:3000?code=123&state=testing' };
        const wrapper = setup();
        expect(wrapper.state().orcidResponse).toMatchObject({
            code: '123',
            state: 'testing',
        });
    });

    it('should check condition for account id on receiving new props', () => {
        const author = {
            aut_id: 123,
        };
        const wrapper = setup({
            account: {
                id: 123,
            },
            author,
        });
        const UNSAFE_componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'UNSAFE_componentWillReceiveProps');
        wrapper.setProps({
            account: {
                id: 2323,
            },
            author,
        });
        expect(UNSAFE_componentWillReceiveProps).toHaveBeenCalled();
    });
});
