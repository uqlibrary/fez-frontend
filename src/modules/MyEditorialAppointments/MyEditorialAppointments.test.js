import React from 'react';
import MyEditorialAppointments from './index';
import { render, WithReduxStore, waitFor, createMatchMedia, fireEvent } from 'test-utils';
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
        window.matchMedia = createMatchMedia(1024);

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

    it('should render eap role name field', async () => {
        mockApi.onGet(repository.routes.MY_EDITORIAL_APPOINTMENT_LIST_API().apiUrl).replyOnce(200, {
            data: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: 454148,
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Test Editor',
                },
            ],
        });
        const loadMyEditorialAppointmentsListFn = jest.spyOn(
            MyEditorialAppointmentsActions,
            'loadMyEditorialAppointmentsList',
        );

        const { getAllByTestId, getByText, getByTestId, getByRole } = setup({});
        expect(getByText('Loading editorial appointments')).toBeInTheDocument();
        expect(loadMyEditorialAppointmentsListFn).toBeCalled();

        await waitFor(() => getByText('My editorial appointments'));
        expect(getByTestId('my-editorial-appointments-list')).toBeInTheDocument();

        expect(getAllByTestId('mtablebodyrow').length).toBe(1);

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        expect(getByRole('textbox', { name: 'Other role name' })).toHaveAttribute('value', 'Test Editor');
    });

    it('should render table in desktop width', async () => {
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

        const { getAllByTestId, getByText, getByTestId } = setup({});
        expect(getByText('Loading editorial appointments')).toBeInTheDocument();
        expect(loadMyEditorialAppointmentsListFn).toBeCalled();

        await waitFor(() => getByText('My editorial appointments'));
        expect(getByTestId('my-editorial-appointments-list')).toBeInTheDocument();

        expect(getAllByTestId('mtablebodyrow').length).toBe(2);
        expect(document.querySelector('#my-editorial-appointments-list-row-0 td:first-of-type')).not.toHaveAttribute(
            'style',
            expect.stringContaining('display: block'),
        );
    });

    it('should render table in phone width', async () => {
        window.matchMedia = createMatchMedia(320);

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

        const { getAllByTestId, getByText, getByTestId } = setup({});
        expect(getByText('Loading editorial appointments')).toBeInTheDocument();
        expect(loadMyEditorialAppointmentsListFn).toBeCalled();

        await waitFor(() => getByText('My editorial appointments'));
        expect(getByTestId('my-editorial-appointments-list')).toBeInTheDocument();
        expect(getAllByTestId('mtablebodyrow').length).toBe(2);

        expect(document.querySelector('#my-editorial-appointments-list-row-0 td:first-of-type')).toHaveAttribute(
            'style',
            expect.stringContaining('display: block'),
        );
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
