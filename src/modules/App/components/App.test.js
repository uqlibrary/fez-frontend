import React from 'react';
import App, { StrictModeConditional } from './App';
import { accounts, authorDetails, currentAuthor } from 'mock/data';
import { pathConfig } from 'config';
import Cookies from 'js-cookie';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';

function setup(testProps = {}, renderMethod = render) {
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

    window.matchMedia = function matchMedia() {
        return {
            matches: testProps.isMobile || false,
            addListener: function addListener() {},
            removeListener: function removeListener() {},
        };
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <App {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
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

    afterEach(() => {
        // delete window.location;
        window.location = saveLocation;
    });

    it('should render loading screen while account is loading', () => {
        const { container } = setup({ accountLoading: true });
        expect(container).toMatchSnapshot();
    });

    it('should render for anon user', () => {
        const { container } = setup({ location: { pathname: '/' } });
        expect(container).toMatchSnapshot();
    });

    it('should render application with routing for the user and display loading screen while loading author', () => {
        const { container } = setup({
            account: account,
            accountAuthorLoading: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render alert if user is not fez author', () => {
        const { container } = setup({
            account: account,
            author: null,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render app for account with fez author with ORCID ID', () => {
        const { container } = setup({
            account: account,
            author: author,
        });

        expect(container).toMatchSnapshot();
    });

    it('should render thesis submission for HDR without menu', () => {
        const { conatiner } = setup({
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

        expect(conatiner).toMatchSnapshot();
    });

    it('should render app for HDR with ORCID ID', () => {
        const { container } = setup({
            account: accounts.s2222222,
            author: {
                ...author,
                aut_org_username: null,
                aut_student_username: 's2222222',
                aut_orcid_id: '1234-1234-1234',
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('redirects user to login if not Authorized', () => {
        const assignFn = jest.fn();
        delete window.location;
        window.location = { assign: assignFn };
        setup({ account: null, location: { pathname: '/rhdsubmission' } });
        expect(assignFn).toBeCalledWith('https://fez-staging.library.uq.edu.au/login.php?url=dW5kZWZpbmVk');
    });

    // If the system is behind Lambda@Edge scripts then public users will go straight through to public files.
    // A user will only get to the fez-frontend app for a file if they are not logged in and
    // the file is not public, or they are logged in and the the file requires higher privs e.g. needs admin,
    // but they are a student.
    it('redirects user to login if going to a secure file url and not user logged in yet', () => {
        window.location = { assign: jest.fn() };
        const { container } = setup({
            accountLoading: false,
            account: null,
            location: { pathname: '/view/UQ:1/test.pdf' },
        });
        expect(container).toMatchSnapshot();
    });

    it('should redirect to logout page', () => {
        const assignFn = jest.fn();
        delete global.window.location;
        global.window.location = {
            assign: assignFn,
        };
        const { getByRole } = setup({
            account: account,
            author: author,
        });

        fireEvent.click(getByRole('button', { name: /Log out/i }));
        expect(assignFn).toBeCalledWith(
            'https://auth.library.uq.edu.au/logout?url=aHR0cHM6Ly9mZXotc3RhZ2luZy5saWJyYXJ5LnVxLmVkdS5hdS8=',
        );
    });

    it('should not render alert if user is not fez author and on the journal search page', () => {
        const { queryByTestId } = setup({
            location: {
                pathname: pathConfig.journals.search,
            },
            account: account,
            author: null,
        });

        expect(queryByTestId('not-registered-author')).not.toBeInTheDocument();
    });

    it('should not render alert if user is not fez author and on the journal view page', () => {
        const { queryByTestId } = setup({
            location: {
                pathname: pathConfig.journal.view(1),
            },
            account: account,
            author: null,
        });
        expect(queryByTestId('not-registered-author')).not.toBeInTheDocument;
    });

    it('should render orcid alert for account with fez author without ORCID ID', () => {
        const pushFn = jest.fn();
        const { getByTestId } = setup({
            account: account,
            author: {
                ...author,
                aut_orcid_id: null,
            },
            authorDetails: {},
            history: { push: pushFn, location: { pathname: '/' } },
        });

        expect(getByTestId('orcid-optional')).toBeInTheDocument();

        fireEvent.click(getByTestId('action-button'));
        expect(pushFn).toBeCalledWith('/author-identifiers/orcid/link');
    });

    it('should render orcid alert for account with fez author without ORCID ID and redirect when receiving orcid response', () => {
        const assignFn = jest.fn();
        delete global.window.location;
        global.window.location = {
            href: 'http://fez-staging.library.uq.edu.au?code=010101',
            search: '?code=010101',
            assign: assignFn,
        };
        const { getByTestId } = setup({
            account: account,
            author: {
                ...author,
                aut_orcid_id: null,
            },
            authorDetails: {},
        });

        expect(getByTestId('orcid-optional')).toBeInTheDocument();

        fireEvent.click(getByTestId('action-button'));
        expect(assignFn).toBeCalledWith('http://fez-staging.library.uq.edu.au/author-identifiers/orcid/link');
    });

    it('should not show orcid alert for a student without an author account', () => {
        const { queryByTestId } = setup({
            account: account.s2222222,
            author: {
                ...currentAuthor.s2222222.data,
                aut_orcid_id: null,
            },
            location: { pathname: '/' },
            authorDetails: {},
        });
        expect(queryByTestId('orcid-optional')).not.toBeInTheDocument();
    });

    it('should not show orcid alert for a student without an author account', () => {
        const { queryByTestId } = setup({
            account: account.s3333333,
            author: currentAuthor.s3333333.data,
            location: { pathname: '/' },
            authorDetails: {},
        });
        expect(queryByTestId('orcid-optional')).not.toBeInTheDocument();
    });

    it('should not render orcid alert for account with fez author without ORCID ID but is an admin', () => {
        const { queryByTestId } = setup({
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

        expect(queryByTestId('orcid-optional')).not.toBeInTheDocument();
    });

    it('should not render orcid alert for account with fez author without ORCID ID but is a super admin', () => {
        const { queryByTestId } = setup({
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

        expect(queryByTestId('orcid-optional')).not.toBeInTheDocument();
    });

    it('should not render orcid alert for account with fez author with ORCID ID but is an admin', () => {
        const { queryByTestId } = setup({
            account: account,
            author: author,
            authorDetails: {
                is_administrator: 1,
                is_super_administrator: 0,
            },
        });
        expect(queryByTestId('orcid-optional')).not.toBeInTheDocument();
    });

    it('should not render orcid alert for account with fez author with ORCID ID but is a super admin', () => {
        const { queryByTestId } = setup({
            account: account,
            author: author,
            authorDetails: {
                is_administrator: 0,
                is_super_administrator: 1,
            },
        });
        expect(queryByTestId('orcid-optional')).not.toBeInTheDocument();
    });

    it('should render orcid alert for account with author account without a ORCID ID', () => {
        const { getByTestId } = setup({
            account: account,
            author: {
                ...author,
                aut_orcid_id: null,
            },
            authorDetails: authorDetails.uqresearcher,
        });

        expect(getByTestId('orcid-optional')).toBeInTheDocument();
    });

    it('should not render orcid alert for account with fez author without ORCID ID on thesis submission page', () => {
        const { queryByTestId } = setup({
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

        expect(queryByTestId('orcid-optional')).not.toBeInTheDocument();
    });

    it('should render orcid alert for HDR student', () => {
        const { getByTestId } = setup({
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

        expect(getByTestId('orcid-required')).toBeInTheDocument();
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

    it('Should show confirmation when the session expires', () => {
        const { getByText, rerender } = setup({ isSessionExpired: false });
        setup({ isSessionExpired: true }, rerender);

        expect(getByText(/Session Expired/i)).toBeInTheDocument();
        expect(getByText(/Redirect to login/i)).toBeInTheDocument();
    });

    it('should load the incomplete publications list when the author is loaded', () => {
        const testMethod = jest.fn();
        const { rerender } = setup({
            account: { name: 'test1' },
            actions: {
                loadCurrentAccount: jest.fn(),
            },
        });

        setup(
            {
                account: { name: 'test1' },
                actions: {
                    loadCurrentAccount: jest.fn(),
                    searchAuthorPublications: testMethod,
                },
                author: { aut_id: 1 },
            },
            rerender,
        );
        expect(testMethod).toHaveBeenCalled();
    });

    it('should determine if it has incomplete works from props and hide menu item', () => {
        const { container } = setup({
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
        expect(container).toMatchSnapshot();
    });

    it('should determine if it has incomplete works from props and show menu item', () => {
        const { container } = setup({
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
        expect(container).toMatchSnapshot();
    });

    it('should toggleDrawer', () => {
        const { getByRole } = setup({
            account: account,
            author: author,
        });

        fireEvent.click(getByRole('button', { name: /Click to open the main navigation/i }));
        expect(getByRole('button', { name: /Close menu/i }));
    });

    it('Should display mobile correctly', () => {
        // current URL is set to testUrl which is set in package.json as http://fez-staging.library.uq.edu.au
        const { container } = setup({ isMobile: true });
        expect(container).toMatchSnapshot();
    });

    it('StrictModeConditional should wrap the App JSX', () => {
        const { getByTestId, getByText } = render(
            <StrictModeConditional condition wrapper={children => <div data-testid="wrapper">{children}</div>}>
                <div>content here</div>
            </StrictModeConditional>,
        );

        expect(getByTestId('wrapper')).toBeInTheDocument();
        expect(getByText('content here')).toBeInTheDocument();
    });
    it('StrictModeConditional should not wrap the App JSX', () => {
        const { queryByTestId, getByText } = render(
            <StrictModeConditional condition={false} wrapper={children => <div data-testid="wrapper">{children}</div>}>
                <div>content here</div>
            </StrictModeConditional>,
        );

        expect(queryByTestId('wrapper')).not.toBeInTheDocument();
        expect(getByText('content here')).toBeInTheDocument();
    });
});
