import React from 'react';
import Orcid from './Orcid';
import { accounts, currentAuthor } from 'mock/data/account';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}, renderMethod = rtlRender) {
    const props = {
        ...testProps,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        // accountAuthorSaving: testProps.accountAuthorSaving || false,
        accountAuthorError: testProps.accountAuthorError || null,
        account: testProps.account || null,
        author: testProps.author || null,
        actions: testProps.actions || {
            linkAuthorOrcidId: jest.fn(),
            showAppAlert: jest.fn(),
            dismissAppAlert: jest.fn(),
            resetSavingAuthorState: jest.fn(),
        },
        navigate: testProps.navigate || jest.fn(),
    };
    return renderMethod(<Orcid {...props} />);
}

describe('Component Orcid ', () => {
    const saveLocation = window.location;

    afterEach(() => {
        window.location = saveLocation;
    });

    it('should render nothing if account/author is not loaded', () => {
        const { container } = setup({ accountAuthorLoading: true });
        expect(container).toMatchSnapshot();
    });

    it('should render nothing if account is set, but author is null', () => {
        const { container } = setup({ account: accounts.uqresearcher });
        expect(container).toMatchSnapshot();
    });

    it('should render nothing if account is set, but author is null', () => {
        const { container } = setup({ account: accounts.uqresearcher });
        expect(container).toMatchSnapshot();
    });

    it('should render if account doesnt have first name and last name', () => {
        const { container, rerender } = setup({ accountAuthorLoading: true });

        setup(
            {
                account: { ...accounts.uqresearcher, lastName: null, firstName: null },
                author: currentAuthor.uqresearcher.data,
            },
            rerender,
        );
        expect(container).toMatchSnapshot();
    });

    it('should redirect to the dashbaord', () => {
        const testMethod = jest.fn();
        delete window.location;
        window.location = {
            assign: testMethod,
            hash: '',
            search: '',
        };
        setup({ author: { aut_orcid_id: '11111' } });
        expect(testMethod).toHaveBeenCalledWith('/dashboard');
    });

    it('should construct ORCID url for linking existing orcid', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));
        const assignFn = jest.fn();
        delete window.location;
        window.location = {
            assign: assignFn,
            hash: 'http://localhost:3000?code=123&state=b650667a7eb582897f036e66099b78c7',
        };
        const { getByRole, getByTestId } = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });

        fireEvent.click(getByRole('button', { name: /Link your existing ORCID iD/i }));
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(assignFn).toBeCalledWith(
            'http://orcid.org/oauth/authorize?client_id=12345XYZ&response_type=code&scope=%2Fread-limited%20%2Factivities%2Fupdate%20%2Fperson%2Fupdate&redirect_uri=http%3A%2F%2Ffez-staging.library.uq.edu.au%2Fauthor-identifiers%2Forcid%2Flink&state=b650667a7eb582897f036e66099b78c7&show_login=true',
        );
    });

    it('should construct ORCID url for creating a new orcid', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));
        const assignFn = jest.fn();
        delete window.location;
        window.location = {
            assign: assignFn,
            hash: 'http://localhost:3000?code=123&state=b650667a7eb582897f036e66099b78c7',
        };
        const { getByRole, getByTestId } = setup({
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });

        fireEvent.click(getByRole('button', { name: /Create a new ORCID iD/i }));
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(assignFn).toBeCalledWith(
            'http://orcid.org/oauth/authorize?client_id=12345XYZ&response_type=code&scope=%2Fread-limited%20%2Factivities%2Fupdate%20%2Fperson%2Fupdate&redirect_uri=http%3A%2F%2Ffez-staging.library.uq.edu.au%2Fauthor-identifiers%2Forcid%2Flink&state=b650667a7eb582897f036e66099b78c7&show_login=false&family_names=Researcher&given_names=J',
        );
    });

    it('should display appropriate alert message', () => {
        const { getByText } = setup({
            accountAuthorSaving: true,
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });

        expect(getByText(/Request is being processed/i));
    });

    it('should display appropriate error message', () => {
        const { getByText } = setup({
            accountAuthorSaving: true,
            accountAuthorError: 'submitFailed',
            account: accounts.uqresearcher,
            author: currentAuthor.uqresearcher.data,
        });

        expect(getByText(/submitFailed/i));
    });

    it('should display error if ORCID url redirect STATE response is invalid', () => {
        delete window.location;
        window.location = {
            hash: 'http://localhost:3000?code=123&state=invalid',
        };
        const { getByText } = setup({
            accountAuthorSaving: true,
            account: accounts.uqresearcher,
            author: { ...currentAuthor.uqresearcher.data, aut_orcid_id: null },
        });

        expect(getByText(/Invalid authorisation state response from ORCID/i));
    });

    it('should navigate back to dashboard if author already has orcid', () => {
        const { rerender } = setup({ accountAuthorLoading: true });

        const navigateFn = jest.fn();
        // account/author has been loaded
        setup(
            {
                account: accounts.uqresearcher,
                author: currentAuthor.uqresearcher.data,
                navigate: navigateFn,
            },
            rerender,
        );

        expect(navigateFn).toHaveBeenCalledWith('/dashboard');
    });

    it("should navigate back to dashboard if author's orcid id was updated successfully", () => {
        const author = { ...currentAuthor.uqnoauthid.data, aut_orcid_id: null };
        const showAppAlertFn = jest.fn();
        const navigateFn = jest.fn();
        const { rerender } = setup({
            account: accounts.uqresearcher,
            author: author,
        });

        // account/author has been loaded
        setup(
            {
                account: accounts.uqresearcher,
                author: currentAuthor.uqresearcher.data,
                actions: {
                    showAppAlert: showAppAlertFn,
                    resetSavingAuthorState: jest.fn(),
                },
                navigate: navigateFn,
            },
            rerender,
        );

        expect(showAppAlertFn).toHaveBeenCalled();
        expect(navigateFn).toHaveBeenCalledWith('/dashboard');
    });

    it('should start author update when author is loaded on mount and orcid response received', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));
        const linkAuthorOrcidIdFn = jest.fn();
        delete window.location;
        window.location = {
            hash: 'http://localhost:3000?code=123&state=b650667a7eb582897f036e66099b78c7',
        };
        setup({
            account: accounts.uqresearcher,
            author: { ...currentAuthor.uqnoauthid.data, aut_orcid_id: null },
            actions: {
                linkAuthorOrcidId: linkAuthorOrcidIdFn,
                resetSavingAuthorState: jest.fn(),
            },
        });

        expect(linkAuthorOrcidIdFn).toBeCalledWith('uqresearcher', 4101, '123');
    });

    it('should start author update when author is loaded and orcid response received', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));
        const linkAuthorOrcidIdFn = jest.fn();
        delete window.location;
        window.location = {
            hash: 'http://localhost:3000?code=123&state=b650667a7eb582897f036e66099b78c7',
        };

        const { rerender } = setup({
            accountAuthorLoading: true,
            account: null,
            author: null,
        });

        setup(
            {
                account: accounts.uqresearcher,
                author: { ...currentAuthor.uqnoauthid.data, aut_orcid_id: null },
                actions: {
                    linkAuthorOrcidId: linkAuthorOrcidIdFn,
                    resetSavingAuthorState: jest.fn(),
                },
            },
            rerender,
        );

        expect(linkAuthorOrcidIdFn).toBeCalledWith('uqresearcher', 4101, '123');
    });
});
