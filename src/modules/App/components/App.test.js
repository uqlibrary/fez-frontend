import App, { AppClass } from './App';
import { accounts, authorDetails, currentAuthor } from 'mock/data';
import mui1theme, { AUTH_URL_LOGIN, AUTH_URL_LOGOUT, pathConfig, routes } from 'config';
import Cookies from 'js-cookie';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {},
        theme: { palette: { white: { main: '#FFFFFF' } } },
        account: testProps.account || null,
        author: testProps.author || null,
        accountLoading: testProps.accountLoading || false,
        accountAuthorLoading: testProps.accountAuthorLoading || false,
        actions: testProps.actions || {
            loadCurrentAccount: jest.fn(),
            logout: jest.fn(),
            searchAuthorPublications: jest.fn(),
        },
        location: testProps.location || {},
        history: testProps.history || { location: {} },
    };

    window.matchMedia =
        window.matchMedia ||
        function matchMedia() {
            return {
                matches: false,
                addListener: function addListener() {},
                removeListener: function removeListener() {},
            };
        };

    return getElement(AppClass, props);
}

beforeAll(() => {
    delete global.window.location;
    global.window.location = { href: jest.fn(), assign: jest.fn() };
});

describe('Application component', () => {
    let account;
    let author;
    const saveLocation = window.location;

    beforeEach(() => {
        account = {
            id: 'uqauthor1',
            class: ['libstaff', 'IS_CURRENT'],
        };
        author = {
            aut_id: 1,
            aut_org_username: 'uqauthor1',
            aut_orcid_id: 'abc-abc-abc',
        };
    });

    afterAll(() => {
        delete window.location;
        window.location = saveLocation;
    });

    it('redirects user to login if not Authorized', () => {
        const wrapper = setup();
        const redirectUserToLogin = jest.spyOn(wrapper.instance(), 'redirectUserToLogin');
        wrapper.setProps({ accountLoading: true, account: null, location: { pathname: '/rhdsubmission' } });
        expect(redirectUserToLogin).not.toHaveBeenCalled();

        wrapper.setProps({ accountLoading: false, account: null, location: { pathname: '/rhdsubmission' } });
        expect(redirectUserToLogin).toHaveBeenCalled();
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not show orcid alert for a student without an author account', () => {
        const wrapper = setup({
            account: account.s2222222,
            author: {
                ...currentAuthor.s2222222.data,
                aut_orcid_id: null,
            },
            location: { pathname: '/' },
            authorDetails: {},
        });
        expect(wrapper.find('[alertId*="orcid"]').length).toBe(0);
    });

    it('should not show orcid alert for a student without an author account', () => {
        const wrapper = setup({
            account: account.s3333333,
            author: currentAuthor.s3333333.data,
            location: { pathname: '/' },
            authorDetails: {},
        });
        expect(wrapper.find('[alertId*="orcid"]').length).toBe(0);
    });

    it('should assign the correct ref to setSessionExpiredConfirmation', () => {
        const wrapper = setup();

        wrapper.instance().setSessionExpiredConfirmation('hello');
        expect(wrapper.instance().sessionExpiredConfirmationBox).toEqual('hello');
    });

    it(
        'when calling redirectToOrcid, it should redirect appropriately ' +
            'if user already received an orcid response',
        () => {
            const testFn = jest.fn();
            const testFn2 = jest.fn();
            delete global.window.location;
            global.window.location = {
                href: 'http://fez-staging.library.uq.edu.au?code=010101',
                search: '?code=010101',
                assign: testFn,
            };
            const wrapper = setup({ history: { push: testFn2, location: { pathname: 'test' } } });

            wrapper.instance().redirectToOrcid();
            expect(testFn).toBeCalledWith('http://fez-staging.library.uq.edu.au/author-identifiers/orcid/link');
            expect(testFn2).not.toBeCalled();
        },
    );
    // If the system is behind Lambda@Edge scripts then public users will go straight through to public files.
    // A user will only get to the fez-frontend app for a file if they are not logged in and
    // the file is not public, or they are logged in and the the file requires higher privs e.g. needs admin,
    // but they are a student.
    it('redirects user to login if going to a secure file url and not user logged in yet', () => {
        const wrapper = setup({});
        const redirectUserToLogin = jest.spyOn(wrapper.instance(), 'redirectUserToLogin');
        wrapper.setProps({ accountLoading: true, account: null, location: { pathname: '/view/UQ:1/test.pdf' } });
        expect(redirectUserToLogin).not.toHaveBeenCalled();

        wrapper.setProps({ accountLoading: false, account: null, location: { pathname: '/view/UQ:1/test.pdf' } });
        expect(redirectUserToLogin).toHaveBeenCalled();
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should assign the correct ref to setSessionExpiredConfirmation', () => {
        const wrapper = setup({});

        wrapper.instance().setSessionExpiredConfirmation('hello');
        expect(wrapper.instance().sessionExpiredConfirmationBox).toEqual('hello');
    });

    it(
        'when calling redirectToOrcid, it should redirect appropriately ' +
            'if user already received an orcid response',
        () => {
            const testFn = jest.fn();
            const testFn2 = jest.fn();
            delete global.window.location;
            global.window.location = {
                href: 'http://fez-staging.library.uq.edu.au?code=010101',
                search: '?code=010101',
                assign: testFn,
            };
            const wrapper = setup({ history: { push: testFn2, location: { pathname: 'test' } } });

            wrapper.instance().redirectToOrcid();
            expect(testFn).toBeCalledWith('http://fez-staging.library.uq.edu.au/author-identifiers/orcid/link');
            expect(testFn2).not.toBeCalled();
        },
    );

    it('when calling redirectToOrcid, it should redirect appropriately', () => {
        const testFn = jest.fn();
        const testFn2 = jest.fn();
        delete global.window.location;
        global.window.location = {
            href: 'http://fez-staging.library.uq.edu.au?name=none',
            search: '?name=none',
            assign: testFn,
        };
        const wrapper = setup({ history: { push: testFn2, location: { pathname: 'test' } } });

        wrapper.instance().redirectToOrcid();
        expect(testFn).not.toBeCalled();
        expect(testFn2).toBeCalledWith('/author-identifiers/orcid/link');
    });

    it('should call componentWillUnmount', () => {
        const wrapper = setup();
        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');
        wrapper.unmount();
        expect(componentWillUnmount).toHaveBeenCalled();
    });

    it('Should show confirmation when the session expires', () => {
        const testFn = jest.fn();
        const wrapper = setup({ isSessionExpired: false });
        wrapper.instance().sessionExpiredConfirmationBox = { showConfirmation: testFn };
        wrapper.update();
        expect(testFn).not.toHaveBeenCalled();
        wrapper.setProps({ isSessionExpired: true });
        expect(testFn).toHaveBeenCalled();
    });

    it('Should get the childContext correctly', () => {
        // current URL is set to testUrl which is set in package.json as http://fez-staging.library.uq.edu.au
        const wrapper = setup();
        expect(wrapper.instance().getChildContext()).toEqual({
            userCountry: 'AU',
            isMobile: false,
            selectFieldMobileOverrides: {
                autoWidth: true,
                fullWidth: false,
                menuItemStyle: {},
                style: { width: '100%' },
            },
        });
    });

    it('Should display mobile correctly', () => {
        // current URL is set to testUrl which is set in package.json as http://fez-staging.library.uq.edu.au
        const wrapper = setup();
        wrapper.setState({ isMobile: true });
        wrapper.instance().getChildContext();
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to login page with correct return url if rhd submission route accessed', () => {
        window.location.assign = jest.fn();

        // current URL is set to testUrl which is set in package.json as http://fez-staging.library.uq.edu.au
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.instance().redirectUserToLogin(true, true)();
        const currentUrl = window.btoa(window.location.href);
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(currentUrl));
        const appUrl = window.btoa('https://fez-staging.library.uq.edu.au/');
        wrapper.instance().redirectUserToLogin(true, false)();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(appUrl));
    });

    it('should render for anon user', () => {
        const wrapper = setup({ location: { pathname: '/' } });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading screen while account is loading', () => {
        const wrapper = setup({ accountLoading: true });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render application with routing for the user and display loading screen while loading author', () => {
        const wrapper = setup({
            account: account,
            accountAuthorLoading: true,
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render alert if user is not fez author', () => {
        const wrapper = setup({
            account: account,
            author: null,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render alert if user is not fez author and on the journal search page', () => {
        const wrapper = setup({
            location: {
                pathname: pathConfig.journals.search,
            },
            account: account,
            author: null,
        });
        expect(wrapper.find('[alertId*="not-registered-author"]').length).toBe(0);
    });

    it('should not render alert if user is not fez author and on the journal view page', () => {
        const wrapper = setup({
            location: {
                pathname: pathConfig.journal.view(1),
            },
            account: account,
            author: null,
        });
        expect(wrapper.find('[alertId*="not-registered-author"]').length).toBe(0);
    });

    it('should render app for account with fez author with ORCID ID', () => {
        const wrapper = setup({
            account: account,
            author: author,
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render orcid alert for account with fez author without ORCID ID', () => {
        const wrapper = setup({
            account: account,
            author: {
                ...author,
                aut_orcid_id: null,
            },
            authorDetails: {},
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(wrapper.find('[alertId="orcid-optional"]').length).toBe(1);
    });

    it('should not render orcid alert for account with fez author without ORCID ID but is an admin', () => {
        const wrapper = setup({
            account: account,
            author: {
                ...author,
                aut_orcid_id: null,
            },
            authorDetails: {
                is_administrator: 1,
                is_super_administrator: 0,
            },
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(wrapper.find('[alertId*="orcid"]').length).toBe(0);
    });

    it('should not render orcid alert for account with fez author without ORCID ID but is a super admin', () => {
        const wrapper = setup({
            account: account,
            author: {
                ...author,
                aut_orcid_id: null,
            },
            authorDetails: {
                is_administrator: 0,
                is_super_administrator: 1,
            },
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(wrapper.find('[alertId*="orcid"]').length).toBe(0);
    });

    it('should not render orcid alert for account with fez author with ORCID ID but is an admin', () => {
        const wrapper = setup({
            account: account,
            author: author,
            authorDetails: {
                is_administrator: 1,
                is_super_administrator: 0,
            },
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(wrapper.find('[alertId*="orcid"]').length).toBe(0);
    });

    it('should not render orcid alert for account with fez author with ORCID ID but is a super admin', () => {
        const wrapper = setup({
            account: account,
            author: author,
            authorDetails: {
                is_administrator: 0,
                is_super_administrator: 1,
            },
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(wrapper.find('[alertId*="orcid"]').length).toBe(0);
    });

    it('should render orcid alert for account with author account without a ORCID ID', () => {
        const wrapper = setup({
            account: account,
            author: {
                ...author,
                aut_orcid_id: null,
            },
            authorDetails: authorDetails.uqresearcher,
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(wrapper.find('[alertId="orcid-optional"]').length).toBe(1);
    });

    it('should not render orcid alert for account with fez author without ORCID ID on thesis submission page', () => {
        const wrapper = setup({
            location: {
                pathname: pathConfig.hdrSubmission,
            },
            account: account,
            author: {
                ...author,
                aut_orcid_id: null,
            },
            authorDetails: {},
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(wrapper.find('[alertId*="orcid"]').length).toBe(0);
    });

    it('should render orcid alert for HDR student', () => {
        const wrapper = setup({
            account: accounts.s2222222,
            author: {
                ...author,
                aut_org_username: null,
                aut_student_username: 's2222222',
                aut_orcid_id: null,
            },
            authorDetails: {
                is_administrator: 0,
                is_super_administrator: 0,
            },
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(wrapper.find('[alertId="orcid-required"]').length).toBe(1);
    });

    it('should render thesis submission for HDR without menu', () => {
        const wrapper = setup({
            location: {
                pathname: pathConfig.hdrSubmission,
            },
            account: accounts.s2222222,
            author: {
                ...author,
                aut_org_username: null,
                aut_student_username: 's2222222',
                aut_orcid_id: null,
            },
            authorDetails: {},
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render app for HDR with ORCID ID', () => {
        const wrapper = setup({
            account: accounts.s2222222,
            author: {
                ...author,
                aut_org_username: null,
                aut_student_username: 's2222222',
                aut_orcid_id: '1234-1234-1234',
            },
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to login page', () => {
        window.location.assign = jest.fn();
        setup({})
            .instance()
            .redirectUserToLogin()();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(AUTH_URL_LOGIN));
    });

    it('should redirect to logout page', () => {
        window.location.assign = jest.fn();
        setup({
            account: account,
            author: author,
        })
            .instance()
            .redirectUserToLogin(true)();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(AUTH_URL_LOGOUT));
    });

    it('should handleResize', () => {
        const wrapper = setup({});
        expect(wrapper.state().docked).toBeFalsy();
        wrapper.instance().handleResize({ matches: true });
        expect(wrapper.state().docked).toBeTruthy();
        wrapper.instance().handleResize({ matches: false });
        expect(wrapper.state().docked).toBeFalsy();
    });

    it('should toggleDrawer', () => {
        const wrapper = setup();
        expect(wrapper.state().menuDrawerOpen).toBeFalsy();
        wrapper.instance().toggleDrawer();
        expect(wrapper.state().menuDrawerOpen).toBeTruthy();
        wrapper.instance().toggleDrawer();
        expect(wrapper.state().menuDrawerOpen).toBeFalsy();
    });

    it('should redirectToOrcid', () => {
        const testMethod = jest.fn();
        const wrapper = setup({
            account: account,
            author: author,
            history: {
                push: testMethod,
                location: {},
            },
        });

        wrapper.instance().redirectToOrcid();
        expect(testMethod).toHaveBeenCalledWith(pathConfig.authorIdentifiers.orcid.link);
    });

    it('should start loading current user', () => {
        const testMethod = jest.fn();
        jest.spyOn(Cookies, 'get').mockImplementation(() => true);

        setup({
            actions: {
                loadCurrentAccount: testMethod,
            },
        });
        expect(testMethod).toHaveBeenCalledWith();
    });

    it('should return true if user is on public page', () => {
        const menuItems = routes.getMenuConfig(true, false);

        const getWrapper = pathname =>
            setup({
                location: { pathname },
            });

        const pathExpectations = [
            {
                pathname: '/contact',
                isPublic: true,
            },
            {
                pathname: '/dashboard',
                isPublic: false,
            },
            {
                pathname: '/view/UQ:123432',
                isPublic: true,
            },
            {
                pathname: `/view/${routes.notFound}`,
                isPublic: true,
            },
            {
                pathname: '/',
                isPublic: true,
            },
            {
                pathname: '/data-collections/mine',
                isPublic: false,
            },
        ];

        pathExpectations.map(path => {
            expect(
                getWrapper(path.pathname)
                    .instance()
                    .isPublicPage(menuItems),
            ).toEqual(path.isPublic);
        });
    });

    it('should load the incomplete publications list when the author is loaded', () => {
        const testMethod = jest.fn();
        const wrapper = setup({
            account: { name: 'test1' },
            actions: {
                loadCurrentAccount: jest.fn(),
                searchAuthorPublications: testMethod,
            },
        });
        wrapper.update();
        wrapper.setProps({ author: { aut_id: 1 } });
        expect(testMethod).toHaveBeenCalled();
    });

    it('should determine if it has incomplete works from props and hide menu item', () => {
        const wrapper = setup({
            account: { name: 'test1' },
            accountLoading: false,
            actions: {
                loadCurrentAccount: jest.fn(),
                searchAuthorPublications: jest.fn(),
            },
            incompleteRecordList: {
                incomplete: {
                    publicationsListPagingData: {
                        total: 10,
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should determine if it has incomplete works from props and show menu item', () => {
        const wrapper = setup({
            account: { name: 'test1' },
            accountLoading: false,
            actions: {
                loadCurrentAccount: jest.fn(),
                searchAuthorPublications: jest.fn(),
            },
            incompleteRecordList: {
                incomplete: {
                    publicationsListPagingData: {
                        total: 10,
                    },
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('Testing wrapped App component', () => {
    it('Mounts', () => {
        const wrappedProps = {
            history: {
                push: jest.fn(),
                go: jest.fn(),
                location: { pathname: '/' },
            },
            actions: {
                logout: jest.fn(),
                loadCurrentAccount: jest.fn(),
            },
            account: { name: 'Ky' },
            location: { pathname: '/' },
            classes: {},
            theme: {
                ...mui1theme,
                palette: {
                    primary: {
                        main: 'red',
                    },
                },
            },
        };
        const wrapper = getElement(App, wrappedProps, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
