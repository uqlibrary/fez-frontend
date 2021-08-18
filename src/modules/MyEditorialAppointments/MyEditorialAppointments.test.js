import React from 'react';
import MyEditorialAppointments from './index';
import { render, WithReduxStore, waitFor } from 'test-utils';
import * as MyEditorialAppointmentsActions from 'actions/myEditorialAppointments';
import * as repository from 'repositories';

const setup = (testProps = {}) => {
    return render(
        <WithReduxStore>
            <MyEditorialAppointments {...testProps} />
        </WithReduxStore>,
    );
};

describe('MyEditorialAppointments', () => {
    beforeEach(() => {
        mockApi
            .onGet(new RegExp(repository.routes.MY_EDITORIAL_APPOINTMENT_LIST_API({ id: '.*' }).apiUrl))
            .replyOnce(200, {
                data: {
                    eap_id: 2,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123453',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Editor',
                },
            });
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render default view', async () => {
        mockApi.onGet(repository.routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl).replyOnce(200, {
            data: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123456',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
                {
                    eap_id: 2,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123453',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Editor',
                },
            ],
        });
        const loadMyEditorialAppointmentsListFn = jest.spyOn(
            MyEditorialAppointmentsActions,
            'loadMyEditorialAppointmentsList',
        );

        const { getByText, getByTestId } = setup({});
        expect(getByText('Loading editorial appointments')).toBeInTheDocument();
        expect(loadMyEditorialAppointmentsListFn).toBeCalled();

        await waitFor(() => getByText('My editorial appointments'));
        expect(getByTestId('my-editorial-appointments-list')).toBeInTheDocument();

        // Expect table column titles
        expect(getByText('Journal name')).toBeInTheDocument();
        expect(getByText('Editorial role')).toBeInTheDocument();
        expect(getByText('Start year')).toBeInTheDocument();
        expect(getByText('End year')).toBeInTheDocument();
    });

    it('should render error message', async () => {
        mockApi.onGet(repository.routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl).replyOnce(500);

        try {
            const { getByText } = setup({});
            expect(getByText('Loading editorial appointments')).toBeInTheDocument();
        } catch (e) {
            expect(e).toEqual({
                message:
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                status: 500,
            });
        }
    });
});
