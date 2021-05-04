import React from 'react';
import ManageUsers from './index';
import { act, render, WithReduxStore, waitFor, waitForElementToBeRemoved, fireEvent } from 'test-utils';
import * as ManageUsersActions from 'actions/manageUsers';
import * as repository from 'repositories';

const setup = (testProps = {}) => {
    return render(
        <WithReduxStore>
            <ManageUsers {...testProps} />
        </WithReduxStore>,
    );
};

describe('ManageUsers', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
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

        try {
            const { getByText } = setup({});
            expect(getByText('No records to display')).toBeInTheDocument();
        } catch (e) {
            expect(e).toEqual({
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                status: 500,
            });
        }
    });

    it('should change call an api with updated page size', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({ page: 1, pageSize: 20, query: '' }).apiUrl))
            .replyOnce(200, {
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
            })
            .onGet(new RegExp(repository.routes.MANAGE_USERS_LIST_API({ page: 1, pageSize: 50, query: '' }).apiUrl))
            .replyOnce(200, {
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
                        usr_student_username: 'uqppun',
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
                    {
                        usr_id: 2032,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2032,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                    {
                        usr_id: 2033,
                        usr_full_name: 'Pun, PaulKang K.',
                        usr_username: 'uqppun',
                        usr_email: 'test@uq.edu.au',
                    },
                ],
                total: 23,
                pageSize: 20,
                current_page: 1,
            });

        const { getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('users-list-row-0')).toBeInTheDocument();
        expect(getByTestId('users-list-row-19')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByText('20 rows'));
        });

        act(() => {
            fireEvent.click(getByText('50'));
        });

        await act(() => waitFor(() => getByTestId('users-list-row-22')));

        expect(getByTestId('users-list-row-0')).toBeInTheDocument();
        expect(getByTestId('users-list-row-22')).toBeInTheDocument();
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

        const { getByText, getByTestId, queryByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('users-list-row-0')).toBeInTheDocument();
        expect(getByTestId('users-list-row-2')).toBeInTheDocument();

        fireEvent.click(getByTestId('select-all-users'));
        fireEvent.click(getByTestId('users-delete-selected-users'));

        await waitFor(() => getByTestId('alert-success-user-bulk-delete'));

        expect(queryByTestId('users-list-row-0')).not.toBeInTheDocument();
        expect(queryByTestId('users-list-row-2')).not.toBeInTheDocument();
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

        const { getByText, getByTestId } = setup({});

        await waitForElementToBeRemoved(() => getByText('No records to display'));

        expect(getByTestId('users-list-row-0')).toBeInTheDocument();
        expect(getByTestId('users-list-row-2')).toBeInTheDocument();

        fireEvent.click(getByTestId('select-all-users'));
        fireEvent.click(getByTestId('users-delete-selected-users'));

        await waitFor(() => {
            expect(getByTestId('users-list-row-0')).toBeInTheDocument();
            expect(getByTestId('users-list-row-2')).toBeInTheDocument();
        });
    });
});
