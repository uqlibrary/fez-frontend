import React from 'react';
import ManageUsers from './index';
import { render, WithReduxStore, waitFor, waitForElementToBeRemoved, fireEvent } from 'test-utils';
import * as ManageUsersActions from 'actions/manageUsers';
import * as repository from 'repositories';
import * as AppActions from 'actions/app';

const setup = (testProps = {}) => {
    return render(
        <React.StrictMode>
            <WithReduxStore>
                <ManageUsers {...testProps} />
            </WithReduxStore>
        </React.StrictMode>,
    );
};

describe('ManageUsers', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());

        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render default view', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({ page: 1, pageSize: 1, search: '' }).apiUrl))
            .replyOnce(200, {
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
        const loadAuthorListFn = jest.spyOn(ManageUsersActions, 'loadUserList');

        const { getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(loadAuthorListFn).toBeCalled();

        await waitFor(() => getByText('Manage users'));
        expect(getByTestId('users-list')).toBeInTheDocument();

        // Expect table column titles
        expect(getByText('ID')).toBeInTheDocument();
        expect(getByText('Full name')).toBeInTheDocument();
        expect(getByText('Email')).toBeInTheDocument();
        expect(getByText('Username')).toBeInTheDocument();
    });

    it('should render error message', async () => {
        mockApi
            .onGet(repository.routes.MANAGE_USERS_LIST_API({ page: 1, pageSize: 1, query: '' }).apiUrl)
            .replyOnce(500);

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('Loading users'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());

        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should change call an api with updated page size', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .reply(200, {
                data: [
                    {
                        usr_id: 2011,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2012,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2013,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2014,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2015,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2016,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2017,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2018,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2019,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2020,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2021,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2022,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2023,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2024,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2025,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },

                    {
                        usr_id: 2026,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2027,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2028,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2029,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2030,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                ],
                total: 23,
                pageSize: 20,
                current_page: 1,
            });

        const { getAllByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(20);

        fireEvent.mouseDown(getByText('20 rows'));
        fireEvent.click(getByText('50'));

        // await waitFor(() => getByTestId('users-list-row-22'));

        // expect(getByTestId('users-list-row-0')).toBeInTheDocument();
        // expect(getByTestId('users-list-row-22')).toBeInTheDocument();
    });

    it('should render added info after adding and display "Never" for last login date', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        usr_id: 1,
                        usr_full_name: 'Test Name',
                        usr_username: 'uqtest',
                        usr_created_date: '2017-02-16T23:11:37Z',
                    },
                ],
                total: 1,
            })
            .onPost(new RegExp(repository.routes.USER_API().apiUrl))
            .replyOnce(200, {
                data: {
                    usr_full_name: 'Test Name',
                    usr_username: 'uqtest',
                    usr_id: 1,
                    usr_created_date: '2017-02-16T23:11:37Z',
                    usr_last_login_date: '2017-02-16T23:11:38Z',
                },
            });
        const { getAllByTestId, getByTestId } = setup();

        fireEvent.click(getByTestId('users-add-new-user'));

        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test Name' } });
        fireEvent.change(getByTestId('usr-email-input'), { target: { value: 'test@uq.edu.au' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtest' } });
        fireEvent.click(getByTestId('usr-administrator-input'));
        fireEvent.click(getByTestId('usr-administrator-input'));
        fireEvent.click(getByTestId('users-add-this-user-save'));

        await waitFor(() => expect(getAllByTestId('mtablebodyrow').length).toBe(1));

        expect(getByTestId('usr-full-name-0')).toHaveAttribute('value', 'Test Name');
        expect(getByTestId('usr-last-login-date-0')).toHaveTextContent('Never');
    });

    it('should render previous list on unsuccessful add operation', async () => {
        mockApi
            .onGet(repository.routes.USERS_SEARCH_API({}).apiUrl, { params: { query: 'uqtest', rule: 'lookup' } })
            .replyOnce(200, {})
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            })
            .onPost(new RegExp(repository.routes.USER_API().apiUrl))
            .replyOnce(500);

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getByTestId, queryByTestId } = setup({});

        fireEvent.click(getByTestId('users-add-new-user'));

        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test Name' } });
        fireEvent.change(getByTestId('usr-email-input'), { target: { value: 'test@uq.edu.au' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtest' } });
        fireEvent.click(getByTestId('users-add-this-user-save'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());
        expect(queryByTestId('usr-username-0')).not.toBeInTheDocument();
    });

    it('should render updated info after editing', async () => {
        mockApi
            .onGet(repository.routes.USERS_SEARCH_API({}).apiUrl, { params: { query: 'uqtname', rule: 'lookup' } })
            .replyOnce(200, {})
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl))
            .replyOnce(200, {
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
            })
            .onPut(new RegExp(repository.routes.USER_API().apiUrl))
            .replyOnce(200, {
                data: {
                    usr_id: 1000000293,
                    usr_full_name: 'Test',
                    usr_email: 'test@uq.edu.au',
                    usr_username: 'uqtname',
                },
            });
        const { getAllByTestId, getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        fireEvent.click(getByTestId('users-list-row-0-edit-this-user'));

        expect(getByTestId('usr-full-name-input')).toHaveAttribute('value', 'Test User');
        expect(getByTestId('usr-email-input')).toHaveAttribute('value', 't.user@library.uq.edu.au');
        expect(getByTestId('usr-username-input')).toHaveAttribute('value', 'uqvasai');

        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('usr-email-input'), { target: { value: 'test@uq.edu.au' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtname' } });
        fireEvent.click(getByTestId('users-update-this-user-save'));

        await waitFor(() => expect(getAllByTestId('mtablebodyrow').length).toBe(1));

        expect(getByTestId('usr-full-name-0')).toHaveAttribute('value', 'Test');
        expect(getByTestId('usr-email-0')).toHaveAttribute('value', 'test@uq.edu.au');
        expect(getByTestId('usr-username-0')).toHaveAttribute('value', 'uqtname');
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        console.log('search url=', new RegExp(repository.routes.USERS_SEARCH_API({}).apiUrl));
        mockApi
            .onGet(repository.routes.USERS_SEARCH_API({}).apiUrl, { params: { query: 'uqtname', rule: 'lookup' } })
            .replyOnce(200, {})
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl))
            .replyOnce(200, {
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
            })
            .onPut(new RegExp(repository.routes.USER_API().apiUrl))
            .replyOnce(500);
        const { getAllByTestId, getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        fireEvent.click(getByTestId('users-list-row-0-edit-this-user'));
        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test, Name' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtname' } });
        fireEvent.click(getByTestId('users-update-this-user-save'));

        await waitFor(() => expect(getAllByTestId('mtablebodyrow').length).toBe(1));

        expect(getByTestId('usr-full-name-0')).toHaveAttribute('value', 'Test User');
        expect(getByTestId('usr-username-0')).toHaveAttribute('value', 'uqvasai');
    });

    it('should delete an user item', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl))
            .replyOnce(200, {
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
            })
            .onDelete(new RegExp(repository.routes.USER_API({}).apiUrl))
            .replyOnce(200, { data: { usr_id: 1000000293 } });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getAllByTestId, getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('users-list-row-0-delete-this-user'));
        fireEvent.click(getByTestId('confirm-users-delete-this-user-confirmation'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());

        // await waitFor(() => expect(getByTestId('usr-full-name-0')).toBeInTheDocument());
        // await new Promise(r => setTimeout(r, 2000));
        // expect(getByTestId('usr-full-name-0')).toHaveAttribute('value', 'Testing User');
        // expect(getByTestId('usr-username-0')).toHaveAttribute('value', 'uqvasai');
    });

    it('should render same list after unsuccessful delete operation', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({}).apiUrl))
            .replyOnce(200, {
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
            })
            .onDelete(new RegExp(repository.routes.USER_API({}).apiUrl))
            .replyOnce(422, { data: 'Error' });

        const showAppAlert = jest.spyOn(AppActions, 'showAppAlert');

        const { getAllByTestId, getByTestId, getByText } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(getByTestId('users-list-row-0-delete-this-user'));
        fireEvent.click(getByTestId('confirm-users-delete-this-user-confirmation'));

        await waitFor(() => expect(showAppAlert).toHaveBeenCalled());
        expect(getByTestId('usr-username-0')).toHaveAttribute('value', 'uqvasai');
        expect(getByTestId('usr-full-name-0')).toHaveAttribute('value', 'Test User');
        expect(getByTestId('usr-username-1')).toHaveAttribute('value', 'uqvdesai');
        expect(getByTestId('usr-full-name-1')).toHaveAttribute('value', 'Testing User');
    });

    it('should bulk delete all users', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.USER_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        usr_id: 2011,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                    },
                    {
                        usr_id: 2012,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                    },
                    {
                        usr_id: 2013,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                    },
                ],
                total: 3,
                pageSize: 20,
                current_page: 1,
            })
            .onPost(`${repository.routes.USER_API().apiUrl}/delete-list`)
            .replyOnce(200, {
                data: {
                    '2011': 'User deleted',
                    '2012': 'User deleted',
                    '2013': 'User deleted',
                },
            });

        const { queryAllByTestId, getAllByTestId, getByText, getByTestId, queryByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(3);

        fireEvent.click(getByTestId('select-user-0'));
        fireEvent.click(getByTestId('select-user-1'));
        fireEvent.click(getByTestId('select-user-2'));
        fireEvent.click(getByTestId('users-delete-selected-users'));
        fireEvent.click(getByTestId('confirm-bulk-delete-users-confirmation'));

        await waitFor(() => {
            expect(queryAllByTestId('mtablebodyrow').length).toBe(0);
        });
    });

    it('should fail to bulk delete all users', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.USER_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        usr_id: 2011,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                    },
                    {
                        usr_id: 2012,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                    },
                    {
                        usr_id: 2013,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                    },
                ],
                total: 3,
                pageSize: 20,
                current_page: 1,
            })
            .onPost('fez-users/delete-list')
            .replyOnce(500);

        const { getAllByTestId, getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(3);

        fireEvent.click(getByTestId('select-user-0'));
        fireEvent.click(getByTestId('select-user-1'));
        fireEvent.click(getByTestId('select-user-2'));
        fireEvent.click(getByTestId('users-delete-selected-users'));
        fireEvent.click(getByTestId('confirm-bulk-delete-users-confirmation'));

        await waitFor(() => {
            expect(getAllByTestId('mtablebodyrow').length).toBe(3);
            expect(getByText('Add new user')).toBeInTheDocument();
        });
    });

    it('should exit from editing author mode', async () => {
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
        const { getAllByTestId, getByTestId, getByText, queryByTestId, queryByText } = setup();

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        const tableRows = getAllByTestId('mtablebodyrow');
        expect(tableRows.length).toBe(2);

        fireEvent.click(tableRows[0]);
        fireEvent.keyDown(getByTestId('user-edit-row'), { key: 'Escape' });

        expect(queryByTestId('user-edit-row')).not.toBeInTheDocument();
        expect(queryByText('Name information')).not.toBeInTheDocument();
    });

    it('should copy author id to clipboard', async () => {
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
        Object.assign(navigator, {
            clipboard: {
                writeText: () => {
                    return Promise.resolve();
                },
            },
        });
        jest.spyOn(navigator.clipboard, 'writeText');

        const { getByTestId, getByText } = setup();

        await waitForElementToBeRemoved(() => getByText('Loading users'));

        fireEvent.click(getByTestId('usr-username-0-copy-text'));

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('uqvasai');

        await waitFor(() => getByTestId('copied-text-snackbar'));
    });
});
