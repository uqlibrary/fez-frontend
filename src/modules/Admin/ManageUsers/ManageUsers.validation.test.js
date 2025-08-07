import React from 'react';
import ManageUsers from './index';
import { render, WithReduxStore, waitFor, waitForElementToBeRemoved, fireEvent, userEvent } from 'test-utils';
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

        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should validate and render updated info after editing', async () => {
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
                ],
                total: 1,
                per_page: 20,
                current_page: 1,
                from: 1,
                to: 20,
            })
            .onPut(new RegExp(repository.routes.USER_API().apiUrl))
            .replyOnce(200, {
                data: {
                    usr_id: 1000000293,
                    usr_full_name: 'Test',
                    usr_email: 'test@uq.edu.au',
                    usr_username: 'uqtname',
                },
            })
            .onGet(repository.routes.USERS_SEARCH_API({}).apiUrl, { params: { query: 'uqtest', rule: 'lookup' } })
            .replyOnce(200, {
                data: [
                    {
                        usr_id: 1234,
                        usr_full_name: 'Test',
                        usr_email: 'test@uq.edu.au',
                        usr_username: 'uqtest',
                        usr_auth_rule_groups:
                            '53733,57010,57293,57294,57830,57831,57832,57833,57834,57847,57848,57939,57940,3302,11',
                    },
                ],
                total: 1,
            })
            .onGet(repository.routes.USERS_SEARCH_API({}).apiUrl, { params: { query: 'uqtname', rule: 'lookup' } })
            .replyOnce(200, {
                data: [],
                total: 0,
            });

        const { getByTestId, findByTestId, queryByTestId, queryAllByText } = setup();

        await waitForElementToBeRemoved(() => document.querySelector('.MuiCircularProgress-svg'), { timeout: 2000 });

        fireEvent.click(getByTestId('users-list-row-0-edit-this-user'));
        await findByTestId('standard-card-user-information');

        expect(getByTestId('users-update-this-user-save')).toHaveAttribute('disabled');

        expect(getByTestId('usr-full-name-input')).toHaveAttribute('value', 'Test User');
        expect(getByTestId('usr-email-input')).toHaveAttribute('value', 't.user@library.uq.edu.au');
        expect(getByTestId('usr-username-input')).toHaveAttribute('value', 'uqvasai');

        fireEvent.change(getByTestId('usr-full-name-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('usr-email-input'), { target: { value: 'test@uq.edu.au' } });
        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtest' } });

        expect(getByTestId('users-update-this-user-save')).not.toHaveAttribute('disabled');

        await userEvent.click(getByTestId('users-update-this-user-save'));

        await waitFor(() => {
            const messages = queryAllByText('The supplied username is already on file for another user.');
            expect(messages.length).toBeGreaterThan(0);
            messages.forEach(message => expect(message).toBeInTheDocument());
        });

        fireEvent.change(getByTestId('usr-username-input'), { target: { value: 'uqtname' } });

        await userEvent.click(getByTestId('users-update-this-user-save'));

        await waitFor(() => {
            expect(queryByTestId('standard-card-user-information')).not.toBeInTheDocument();
        });

        expect(getByTestId('usr-full-name-0')).toHaveAttribute('value', 'Test');
        expect(getByTestId('usr-email-0')).toHaveAttribute('value', 'test@uq.edu.au');
        expect(getByTestId('usr-username-0')).toHaveAttribute('value', 'uqtname');
    });
});
