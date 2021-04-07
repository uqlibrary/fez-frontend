import React from 'react';
import ManageUsersList from './ManageUsersList';
import { render, fireEvent, act, waitFor, WithReduxStore, waitForElementToBeRemoved } from 'test-utils';
import * as repository from 'repositories';

function setup(testProps = {}) {
    const props = {
        onRowAdd: jest.fn(data => Promise.resolve(data)),
        onRowUpdate: jest.fn(data => Promise.resolve(data)),
        onRowDelete: jest.fn(() => Promise.resolve()),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <ManageUsersList {...props} />
        </WithReduxStore>,
    );
}

describe('ManageUsersList', () => {
    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });

        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

        jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    });

    it('should render empty list', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
        });
        const { getByText } = setup();

        await waitFor(() => getByText('No records to display'));
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for users', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
                {
                    usr_id: 1000000293,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_status: 'active',
                    usr_given_names: null,
                    usr_family_name: null,
                    usr_full_name: 'Test User',
                    usr_email: 't.user@library.uq.edu.au',
                    usr_preferences: null,
                    usr_sms_email: null,
                    usr_username: 'uqvasai',
                    usr_shib_username: null,
                    usr_administrator: true,
                    usr_ldap_authentication: false,
                    usr_login_count: 157,
                    usr_shib_login_count: 0,
                    usr_last_login_date: '2021-02-23T04:44:06Z',
                    usr_external_usr_id: null,
                    usr_super_administrator: true,
                    usr_auth_rule_groups:
                        '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    usr_real_last_login_date: '2021-02-22T11:49:49Z',
                },
            ],
            total: 1,
        });
        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('users-list-row-0')).toBeInTheDocument();
    });

    it('should render added info after adding', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });
        const { getByTestId } = setup();

        fireEvent.click(getByTestId('users-add-new-user'));

        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test Name' } });
        fireEvent.change(getByTestId('usr-email-input'), { target: { value: 'test@uq.edu.au' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtest' } });
        fireEvent.click(getByTestId('usr-administrator-input'));

        act(() => {
            fireEvent.click(getByTestId('usr-administrator-input'));
        });

        act(() => {
            fireEvent.click(getByTestId('users-add-this-user-save'));
        });

        await waitFor(() => getByTestId('users-list-row-0'));

        expect(getByTestId('usr-full-name-0')).toHaveTextContent('Test Name');
    });

    it('should render previous list on unsuccessful add operation', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [],
            total: 0,
        });
        const { getByTestId, queryByTestId } = setup({
            onRowAdd: jest.fn(() => Promise.reject({ code: 500 })),
        });

        fireEvent.click(getByTestId('users-add-new-user'));

        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test Name' } });
        fireEvent.change(getByTestId('usr-email-input'), { target: { value: 'test@uq.edu.au' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtest' } });

        act(() => {
            fireEvent.click(getByTestId('users-add-this-user-save'));
        });

        expect(queryByTestId('usr-username-0')).not.toBeInTheDocument();
    });

    it('should render updated info after editing', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
                {
                    usr_id: 1000000293,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_status: 'active',
                    usr_given_names: null,
                    usr_family_name: null,
                    usr_full_name: 'Test User',
                    usr_email: 't.user@library.uq.edu.au',
                    usr_preferences: null,
                    usr_sms_email: null,
                    usr_username: 'uqvasai',
                    usr_shib_username: null,
                    usr_administrator: true,
                    usr_ldap_authentication: false,
                    usr_login_count: 157,
                    usr_shib_login_count: 0,
                    usr_last_login_date: '2021-02-23T04:44:06Z',
                    usr_external_usr_id: null,
                    usr_super_administrator: true,
                    usr_auth_rule_groups:
                        '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    usr_real_last_login_date: '2021-02-22T11:49:49Z',
                },
            ],
            total: 1,
        });
        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        act(() => {
            fireEvent.click(getByTestId('users-list-row-0-edit-this-user'));
        });

        expect(getByTestId('usr-full-name-input')).toHaveAttribute('value', 'Test User');
        expect(getByTestId('usr-email-input')).toHaveAttribute('value', 't.user@library.uq.edu.au');
        expect(getByTestId('usr-username-input')).toHaveAttribute('value', 'uqvasai');

        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('usr-email-input'), { target: { value: 'test@uq.edu.au' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtname' } });

        act(() => {
            fireEvent.click(getByTestId('users-update-this-user-save'));
        });

        await waitFor(() => getByTestId('users-list-row-0'));

        expect(getByTestId('usr-full-name-0')).toHaveTextContent('Test');
        expect(getByTestId('usr-email-0')).toHaveTextContent('test@uq.edu.au');
        expect(getByTestId('usr-username-0')).toHaveTextContent('uqtname');
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
                {
                    usr_id: 1000000293,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_status: 'active',
                    usr_given_names: null,
                    usr_family_name: null,
                    usr_full_name: 'Test User',
                    usr_email: 't.user@library.uq.edu.au',
                    usr_preferences: null,
                    usr_sms_email: null,
                    usr_username: 'uqvasai',
                    usr_shib_username: null,
                    usr_administrator: true,
                    usr_ldap_authentication: false,
                    usr_login_count: 157,
                    usr_shib_login_count: 0,
                    usr_last_login_date: '2021-02-23T04:44:06Z',
                    usr_external_usr_id: null,
                    usr_super_administrator: true,
                    usr_auth_rule_groups:
                        '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    usr_real_last_login_date: '2021-02-22T11:49:49Z',
                },
            ],
            total: 1,
        });
        const { getByTestId, getByText } = setup({
            onRowUpdate: jest.fn(() => Promise.reject({ code: 500 })),
        });

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        act(() => {
            fireEvent.click(getByTestId('users-list-row-0-edit-this-user'));
        });

        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtname' } });

        act(() => {
            fireEvent.click(getByTestId('users-update-this-user-save'));
        });

        await waitFor(() => getByTestId('users-list-row-0'));

        expect(getByTestId('usr-full-name-0')).toHaveTextContent('Test User');
        expect(getByTestId('usr-username-0')).toHaveTextContent('uqvasai');
    });

    it('should render previous list on cancelling edit operation', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
                {
                    usr_id: 1000000293,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_status: 'active',
                    usr_given_names: null,
                    usr_family_name: null,
                    usr_full_name: 'Test User',
                    usr_email: 't.user@library.uq.edu.au',
                    usr_preferences: null,
                    usr_sms_email: null,
                    usr_username: 'uqvasai',
                    usr_shib_username: null,
                    usr_administrator: true,
                    usr_ldap_authentication: false,
                    usr_login_count: 157,
                    usr_shib_login_count: 0,
                    usr_last_login_date: '2021-02-23T04:44:06Z',
                    usr_external_usr_id: null,
                    usr_super_administrator: true,
                    usr_auth_rule_groups:
                        '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    usr_real_last_login_date: '2021-02-22T11:49:49Z',
                },
            ],
            total: 1,
        });
        const { getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        act(() => {
            fireEvent.click(getByTestId('users-list-row-0'));
        });

        act(() => {
            fireEvent.click(getByTestId('users-update-this-user-cancel'));
        });

        await waitFor(() => getByTestId('users-list-row-0'));

        expect(getByTestId('usr-username-0')).toHaveTextContent('uqvasai');
        expect(getByTestId('usr-full-name-0')).toHaveTextContent('Test User');
    });

    it('should delete an user item', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
                {
                    usr_id: 1000000293,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_status: 'active',
                    usr_given_names: null,
                    usr_family_name: null,
                    usr_full_name: 'Test User',
                    usr_email: 't.user@library.uq.edu.au',
                    usr_preferences: null,
                    usr_sms_email: null,
                    usr_username: 'uqvasai',
                    usr_shib_username: null,
                    usr_administrator: true,
                    usr_ldap_authentication: false,
                    usr_login_count: 157,
                    usr_shib_login_count: 0,
                    usr_last_login_date: '2021-02-23T04:44:06Z',
                    usr_external_usr_id: null,
                    usr_super_administrator: true,
                    usr_auth_rule_groups:
                        '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    usr_real_last_login_date: '2021-02-22T11:49:49Z',
                },
                {
                    usr_id: 1000000293,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_status: 'active',
                    usr_given_names: null,
                    usr_family_name: null,
                    usr_full_name: 'Testing User',
                    usr_email: 't.user@library.uq.edu.au',
                    usr_preferences: null,
                    usr_sms_email: null,
                    usr_username: 'uqvasai',
                    usr_shib_username: null,
                    usr_administrator: true,
                    usr_ldap_authentication: false,
                    usr_login_count: 157,
                    usr_shib_login_count: 0,
                    usr_last_login_date: '2021-02-23T04:44:06Z',
                    usr_external_usr_id: null,
                    usr_super_administrator: true,
                    usr_auth_rule_groups:
                        '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    usr_real_last_login_date: '2021-02-22T11:49:49Z',
                },
            ],
            total: 2,
        });
        const { getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const listItem0 = getByTestId('users-list-row-0');
        expect(listItem0).toBeInTheDocument();

        const listItem1 = getByTestId('users-list-row-1');
        expect(listItem1).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('users-list-row-0-delete-this-user'));
        });
        act(() => {
            fireEvent.click(getByTestId('confirm-action'));
        });

        await waitFor(() => getByTestId('users-list-row-0'));

        expect(getByTestId('usr-full-name-0')).toHaveTextContent('Testing User');
        expect(getByTestId('usr-username-0')).toHaveTextContent('uqvasai');
    });

    it('should render same list after unsuccessful delete operation', async () => {
        mockApi.onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl)).replyOnce(200, {
            data: [
                {
                    usr_id: 1000000293,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_status: 'active',
                    usr_given_names: null,
                    usr_family_name: null,
                    usr_full_name: 'Test User',
                    usr_email: 't.user@library.uq.edu.au',
                    usr_preferences: null,
                    usr_sms_email: null,
                    usr_username: 'uqvasai',
                    usr_shib_username: null,
                    usr_administrator: true,
                    usr_ldap_authentication: false,
                    usr_login_count: 157,
                    usr_shib_login_count: 0,
                    usr_last_login_date: '2021-02-23T04:44:06Z',
                    usr_external_usr_id: null,
                    usr_super_administrator: true,
                    usr_auth_rule_groups:
                        '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    usr_real_last_login_date: '2021-02-22T11:49:49Z',
                },
                {
                    usr_id: 1000000293,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_status: 'active',
                    usr_given_names: null,
                    usr_family_name: null,
                    usr_full_name: 'Testing User',
                    usr_email: 't.user@library.uq.edu.au',
                    usr_preferences: null,
                    usr_sms_email: null,
                    usr_username: 'uqvdesai',
                    usr_shib_username: null,
                    usr_administrator: true,
                    usr_ldap_authentication: false,
                    usr_login_count: 157,
                    usr_shib_login_count: 0,
                    usr_last_login_date: '2021-02-23T04:44:06Z',
                    usr_external_usr_id: null,
                    usr_super_administrator: true,
                    usr_auth_rule_groups:
                        '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    usr_real_last_login_date: '2021-02-22T11:49:49Z',
                },
            ],
            total: 2,
        });
        const { getByTestId, getByText } = setup({
            onRowDelete: jest.fn(() => Promise.reject()),
        });

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const listItem0 = getByTestId('users-list-row-0');
        expect(listItem0).toBeInTheDocument();

        const listItem1 = getByTestId('users-list-row-1');
        expect(listItem1).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('users-list-row-0-delete-this-user'));
        });
        act(() => {
            fireEvent.click(getByTestId('confirm-action'));
        });

        await waitFor(() => getByTestId('users-list-row-0'));

        expect(getByTestId('usr-username-0')).toHaveTextContent('uqvasai');
        expect(getByTestId('usr-full-name-0')).toHaveTextContent('Test User');
        expect(getByTestId('usr-username-1')).toHaveTextContent('uqvdesai');
        expect(getByTestId('usr-full-name-1')).toHaveTextContent('Testing User');
    });
});
