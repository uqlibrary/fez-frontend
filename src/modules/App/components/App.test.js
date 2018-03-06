import App from './App';
import {accounts, authorDetails} from 'mock/data';
import {routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT} from 'config';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        account: testProps.account || null,
        author: testProps.author || null,
        accountLoading: testProps.accountLoading || false,
        accountAuthorLoading: testProps.accountAuthorLoading || false,
        actions: testProps.actions || {
            loadCurrentAccount: jest.fn()
        },
        location: testProps.location || {},
        history: testProps.history || {}
    };

    window.matchMedia = window.matchMedia || function () {
        return {
            matches: false,
            addListener: function () {
            },
            removeListener: function () {
            }
        };
    };

    return getElement(App, props, isShallow);
}

describe('Application component', () => {
    let account, author;

    beforeEach(() => {
        account =  {
            "id": "uqauthor1",
            "class": ["libstaff", "IS_CURRENT"],
        };
        author = {
            "aut_id": 1,
            "aut_org_username": "uqauthor1",
            "aut_orcid_id": "abc-abc-abc"
        };
    });

    it('should redirect to login page with correct return url if rhd submission route accessed', () => {
        window.location.assign = jest.fn();

        // current URL is set to testUrl which is set in package.json as http://fez-staging.library.uq.edu.au
        const wrapper = setup({});
        wrapper.instance().redirectUserToLogin(true, true)();

        const currentUrl = window.btoa(window.location.href);
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(currentUrl));

        const appUrl = window.btoa('https://fez-staging.library.uq.edu.au/');
        wrapper.instance().redirectUserToLogin(true, false)();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(appUrl));
    });

    it('should render for anon user', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading screen while account is loading', () => {
        const wrapper = setup({accountLoading: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render application with routing for the user and display loading screen while loading author', () => {
        const wrapper = setup({
            account: account,
            accountAuthorLoading: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render alert if user is not fez author', () => {
        const wrapper = setup({
            account: account,
            author: null
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render app for account with fez author with ORCID ID', () => {
        const wrapper = setup({
            account: account,
            author: author
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render app for account with fez author without ORCID ID', () => {
        const wrapper = setup({
            account: account,
            author: {
                ...author,
                aut_orcid_id: null
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render app for HDR without ORCID ID', () => {
        const wrapper = setup({
            account: account,
            author: {
                ...author,
                aut_org_username: null,
                aut_student_username: 's222222',
                aut_orcid_id: null
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render thesis submission for HDR without menu', () => {
        const wrapper = setup({
            location: {
                pathname: routes.pathConfig.hdrSubmission
            },
            account: account,
            author: {
                ...author,
                aut_org_username: null,
                aut_student_username: 's222222',
                aut_orcid_id: null
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render app for HDR with ORCID ID', () => {
        const wrapper = setup({
            account: account,
            author: {
                ...author,
                aut_org_username: null,
                aut_student_username: 's222222',
                aut_orcid_id: '1234-1234-1234'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to login page', () => {
        window.location.assign = jest.fn();
        const wrapper = setup({}).instance().redirectUserToLogin()();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(AUTH_URL_LOGIN));
    });

    it('should redirect to logout page', () => {
        window.location.assign = jest.fn();
        const wrapper = setup({
            account: account,
            author: author
        }).instance().redirectUserToLogin(true)();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(AUTH_URL_LOGOUT));
    });

    it('should handleResize', () => {
        const wrapper = setup({});
        expect(wrapper.state().docked).toBeFalsy();
        wrapper.instance().handleResize({matches: true});
        expect(wrapper.state().docked).toBeTruthy();
        wrapper.instance().handleResize({matches: false});
        expect(wrapper.state().docked).toBeFalsy();
    });

    it('should toggleDrawer', () => {
        const wrapper = setup({});
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
                push: testMethod
            }
        });

        wrapper.instance().redirectToOrcid();
        expect(testMethod).toHaveBeenCalledWith(routes.pathConfig.authorIdentifiers.orcid.link);
    });

    it('should start loading current user', () => {
        const testMethod = jest.fn();
        const wrapper = setup({
            actions: {
                loadCurrentAccount: testMethod
            }
        }, false);
        expect(testMethod).toHaveBeenCalledWith();
    });


});
