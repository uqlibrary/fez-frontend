import React from 'react';
import Orcid from './Orcid';
import { accounts, currentAuthor } from 'mock/data/account';
import { rtlRender, WithReduxStore, fireEvent, WithRouter } from 'test-utils';
import { useNavigate } from 'react-router-dom';
import * as AuthorAction from 'actions/authors';

let mockUseLocation = { pathname: '/' };
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => mockUseLocation,
    useNavigate: jest.fn(() => jest.fn()),
}));

function setup({ state = {} } = {}, renderMethod = rtlRender) {
    return renderMethod(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <Orcid />
            </WithRouter>
        </WithReduxStore>,
    );
}

const navigateMock = jest.fn();
useNavigate.mockImplementation(() => navigateMock);

describe('Component Orcid ', () => {
    const saveLocation = window.location;

    beforeEach(() => {
        mockUseLocation = { pathname: '/', hash: '', search: '' };
    });

    afterEach(() => {
        window.location = saveLocation;
        jest.clearAllMocks();
    });

    it('should render nothing if account/author is not loaded', () => {
        const { container } = setup({
            state: {
                accountReducer: {
                    accountAuthorLoading: true,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render nothing if account is set, but author is null', () => {
        setup({
            state: {
                accountReducer: {
                    accountAuthorLoading: false,
                    account: accounts.uqresearcher,
                },
            },
        });
        expect(navigateMock).toHaveBeenCalledWith('/dashboard', { state: { showOrcidLinkingConfirmation: false } });
    });

    it('should render if account doesnt have first name and last name', () => {
        const { container, rerender } = setup({ state: { accountReducer: { accountAuthorLoading: true } } });

        setup(
            {
                state: {
                    accountReducer: {
                        accountAuthorLoading: false,
                        account: { ...accounts.uqresearcher, lastName: null, firstName: null },
                        author: { ...currentAuthor.uqresearcher.data, aut_orcid_id: null },
                    },
                },
            },
            rerender,
        );
        expect(container).toMatchSnapshot();
    });

    it('should redirect to the dashboard', () => {
        setup({ state: { accountReducer: { author: { aut_orcid_id: '11111' } } } });
        expect(navigateMock).toHaveBeenCalledWith('/dashboard', { state: { showOrcidLinkingConfirmation: false } });
    });

    it('should construct ORCID url for linking existing orcid', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));
        const assignFn = jest.fn();
        delete window.location;
        window.location = {
            assign: assignFn,
        };

        const { getByRole, getByTestId } = setup({
            state: {
                accountReducer: {
                    account: accounts.uqresearcher,
                    author: { ...currentAuthor.uqresearcher.data, aut_orcid_id: null },
                },
            },
        });

        fireEvent.click(getByRole('button', { name: /Link your existing ORCID iD/i }));
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(assignFn).toBeCalledWith(
            'https://orcid.org/oauth/authorize?client_id=12345XYZ&response_type=code&scope=%2Fread-limited%20%2Factivities%2Fupdate%20%2Fperson%2Fupdate&redirect_uri=http%3A%2F%2Ffez-staging.library.uq.edu.au%2Fauthor-identifiers%2Forcid%2Flink&state=b650667a7eb582897f036e66099b78c7&show_login=true',
        );
    });

    it('should construct ORCID url for creating a new orcid', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));
        const assignFn = jest.fn();
        delete window.location;
        window.location = {
            assign: assignFn,
        };
        const { getByRole, getByTestId } = setup({
            state: {
                accountReducer: {
                    account: accounts.uqresearcher,
                    author: { ...currentAuthor.uqresearcher.data, aut_orcid_id: null },
                },
            },
        });

        fireEvent.click(getByRole('button', { name: /Create a new ORCID iD/i }));
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(assignFn).toBeCalledWith(
            'https://orcid.org/oauth/authorize?client_id=12345XYZ&response_type=code&scope=%2Fread-limited%20%2Factivities%2Fupdate%20%2Fperson%2Fupdate&redirect_uri=http%3A%2F%2Ffez-staging.library.uq.edu.au%2Fauthor-identifiers%2Forcid%2Flink&state=b650667a7eb582897f036e66099b78c7&show_login=false&family_names=Researcher&given_names=J',
        );
    });

    it('should display appropriate alert message', () => {
        const { getByText } = setup({
            state: {
                accountReducer: {
                    accountAuthorSaving: true,
                    account: accounts.uqresearcher,
                    author: { ...currentAuthor.uqresearcher.data, aut_orcid_id: null },
                },
            },
        });

        expect(getByText(/Request is being processed/i));
    });

    it('should display appropriate error message', () => {
        const { getByText } = setup({
            state: {
                accountReducer: {
                    accountAuthorSaving: true,
                    accountAuthorError: 'submitFailed',
                    account: accounts.uqresearcher,
                    author: { ...currentAuthor.uqresearcher.data, aut_orcid_id: null },
                },
            },
        });

        expect(getByText(/submitFailed/i));
    });

    it('should display error if ORCID url redirect STATE response is invalid', () => {
        mockUseLocation = { ...mockUseLocation, search: '?code=123&state=invalid' };
        const { getByText } = setup({
            state: {
                accountReducer: {
                    accountAuthorSaving: true,
                    account: accounts.uqresearcher,
                    author: { ...currentAuthor.uqresearcher.data, aut_orcid_id: null },
                },
            },
        });

        expect(getByText(/Invalid authorisation state response from ORCID/i));
    });

    it('should navigate back to dashboard if author already has orcid', () => {
        const { rerender } = setup({
            state: {
                accountReducer: { accountAuthorLoading: true },
            },
        });

        // account/author has been loaded
        setup(
            {
                state: {
                    accountReducer: {
                        accountAuthorLoading: false,
                        account: accounts.uqresearcher,
                        author: currentAuthor.uqresearcher.data,
                    },
                },
            },
            rerender,
        );

        expect(navigateMock).toHaveBeenCalledWith('/dashboard', { state: { showOrcidLinkingConfirmation: false } });
    });

    it("should navigate back to dashboard if author's orcid id was updated successfully", () => {
        const author = { ...currentAuthor.uqnoauthid.data, aut_orcid_id: null };

        mockUseLocation = { ...mockUseLocation, search: '?code=123&state=5ea13ef0dad88453242fcc8f65a0f90a' };
        const { rerender } = setup({
            state: {
                accountReducer: {
                    account: accounts.uqresearcher,
                    author: author,
                },
            },
        });

        // account/author has been loaded
        setup(
            {
                state: {
                    accountReducer: {
                        account: accounts.uqresearcher,
                        author: currentAuthor.uqresearcher.data,
                    },
                },
            },
            rerender,
        );

        expect(navigateMock).toHaveBeenCalledWith('/dashboard', { state: { showOrcidLinkingConfirmation: true } });
    });

    it('should start author update when author is loaded on mount and orcid response received', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));
        const linkAuthorOrcidIdFn = jest.spyOn(AuthorAction, 'linkAuthorOrcidId');

        mockUseLocation = { ...mockUseLocation, search: '?code=123&state=b650667a7eb582897f036e66099b78c7' };

        const { getByRole } = setup({
            state: {
                accountReducer: {
                    account: accounts.uqresearcher,
                    author: { ...currentAuthor.uqnoauthid.data, aut_orcid_id: null },
                },
            },
        });

        fireEvent.click(getByRole('button', { name: /Link your existing ORCID iD/i }));
        expect(linkAuthorOrcidIdFn).toBeCalledWith('uqresearcher', 4101, '123');
    });

    it('should start author update when author is loaded and orcid response received', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));
        const linkAuthorOrcidIdFn = jest.spyOn(AuthorAction, 'linkAuthorOrcidId');
        mockUseLocation = { ...mockUseLocation, search: '?code=123&state=b650667a7eb582897f036e66099b78c7' };

        const { getByRole, rerender } = setup({
            state: {
                accountReducer: {
                    accountAuthorLoading: true,
                    account: null,
                    author: null,
                },
            },
        });

        setup(
            {
                state: {
                    accountReducer: {
                        account: accounts.uqresearcher,
                        author: { ...currentAuthor.uqnoauthid.data, aut_orcid_id: null },
                    },
                },
            },
            rerender,
        );

        fireEvent.click(getByRole('button', { name: /Link your existing ORCID iD/i }));
        expect(linkAuthorOrcidIdFn).toBeCalledWith('uqresearcher', 4101, '123');
    });
});
