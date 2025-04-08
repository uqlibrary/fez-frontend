import React from 'react';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';
import { render, fireEvent, act, waitFor, WithReduxStore, createMatchMedia, within, preview } from 'test-utils';

import { default as locale } from 'locale/components';

function setup(testProps = {}) {
    const props = {
        list: [],
        handleRowAdd: jest.fn(data => Promise.resolve(data)),
        handleRowUpdate: jest.fn(data => Promise.resolve(data)),
        handleRowDelete: jest.fn(() => Promise.resolve()),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <MyEditorialAppointmentsList {...props} />
        </WithReduxStore>,
    );
}

describe('MyEditorialAppointmentsList', () => {
    it('should render empty list', () => {
        const { getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for editorial appointments', () => {
        const { getAllByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '454148',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
            ],
        });
        expect(getAllByTestId('mtablebodyrow').length).toBe(1);
    });

    it('should render rows with red indicator for expired editorial appointments', () => {
        const { getAllByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '454148',
                    eap_start_year: '2006',
                    eap_end_year: '1970',
                    eap_role_name: 'Guest Editor',
                },
            ],
        });
        expect(getAllByTestId('mtablebodyrow').length).toBe(1);
    });

    it('should validate inputs and render added info after adding', async () => {
        const { getAllByTestId, getByTestId, getByText } = setup({
            list: [],
        });

        fireEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));

        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-role-cvo-id-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('my-editorial-appointments-add-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.mouseDown(getByTestId('eap-role-cvo-id-input'));
        fireEvent.click(getByText('Guest Editor'));
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2009' } });

        expect(getByTestId('my-editorial-appointments-list-add-row')).toHaveTextContent(
            locale.components.myEditorialAppointmentsList.form.locale.endYearErrorMessage,
        );

        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        expect(getByTestId('my-editorial-appointments-add-save').closest('button')).not.toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-add-save'));
        });

        await waitFor(() => expect(getAllByTestId('mtablebodyrow').length).toBe(1));
        const listItem = getByTestId('mtablebodyrow');

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2010');
    });

    it('should render previous list on unsuccessful add operation', async () => {
        const { queryAllByTestId, getByTestId, getByText } = setup({
            list: [],
            handleRowAdd: jest.fn(() => Promise.reject()),
        });

        fireEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.mouseDown(getByTestId('eap-role-cvo-id-input'));
        fireEvent.click(getByText('Guest Editor'));
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-add-save'));
        });

        await waitFor(() => getByText('No records to display'));

        expect(queryAllByTestId('mtablebodyrow').length).toBe(0);
    });

    it('should validate inputs and render updated info after editing', async () => {
        const { getByTestId, getByText } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '454145',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
            ],
        });
        const listItem = getByTestId('mtablebodyrow');

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('test');
        expect(getByTestId('eap-role-name-0', listItem)).toHaveTextContent('Guest Editor');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2006');
        expect(getByTestId('eap-end-year-0', listItem)).toHaveTextContent('2026');

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: '' } });
        preview.debug();
        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.click(
            getByTestId('eap-role-cvo-id-input')
                .closest('div')
                .querySelector('[aria-label=Clear]'),
        );

        expect(getByTestId('eap-role-cvo-id-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '' } });
        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '' } });
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('my-editorial-appointments-update-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.mouseDown(getByTestId('eap-role-cvo-id-input'));
        fireEvent.click(getByText('Other'));

        expect(getByTestId('eap-role-name-input')).toBeInTheDocument();
        fireEvent.change(getByTestId('eap-role-name-input'), { target: { value: 'Testing other role' } });
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-update-save'));
        });

        await waitFor(() => getByTestId('mtablebodyrow'));

        expect(getByTestId('eap-journal-name-0')).toHaveTextContent('testing');
        expect(getByTestId('eap-start-year-0')).toHaveTextContent('2010');
        expect(getByTestId('eap-role-name-0')).toHaveTextContent('Other (Testing other role)');

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: '' } });
        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.keyDown(getByTestId('eap-journal-name-input'), { key: 'Enter', keyCode: 13 });
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '454148',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Editor',
                },
            ],
            handleRowUpdate: jest.fn(() => Promise.reject()),
        });

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-update-save'));
        });

        await waitFor(() => getByTestId('mtablebodyrow'));

        expect(getByTestId('eap-journal-name-0')).toHaveTextContent('test');
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '454148',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Editor',
                },
            ],
        });

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-update-cancel'));
        });

        await waitFor(() => getByTestId('mtablebodyrow'));

        expect(getByTestId('eap-journal-name-0')).toHaveTextContent('test');
    });

    it('should delete my editorial appointment item', async () => {
        const { getAllByTestId, getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '454148',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
                {
                    eap_id: 2,
                    eap_journal_name: 'testing',
                    eap_jnl_id: 12345,
                    eap_role_cvo_id: '123457',
                    eap_start_year: '2016',
                    eap_end_year: '2020',
                    eap_role_name: 'Editor',
                },
            ],
        });

        expect(getAllByTestId('mtablebodyrow').length).toBe(2);

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-delete-this-editorial-appointment'));

        await act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-delete-save'));
        });
        await act(async () => {
            // coverage: allow time for the promise's timeout to update state
            await new Promise(res => setTimeout(res, 1100));
        });
        const listItem = await waitFor(() => getByTestId('mtablebodyrow'));

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        expect(getByTestId('eap-role-name-0', listItem)).toHaveTextContent('Editor');
    });

    it('should display "Current" for "eap_end_year" column if the year is same as current year', () => {
        global.mockDate.set('1/1/2022');
        const { getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '454148',
                    eap_start_year: '2006',
                    eap_end_year: '2022',
                    eap_role_name: 'Guest Editor',
                },
            ],
        });

        expect(getByTestId('mtablebodyrow')).toBeInTheDocument();
        expect(getByTestId('eap-end-year-0')).toHaveTextContent('Current');
    });

    it('should select "Current" year on clicking "Current" options from the year popup menu', async () => {
        global.mockDate.set('1/1/2022');
        const { getByTestId, getByText } = setup({
            list: [],
        });

        fireEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));

        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-role-cvo-id-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('my-editorial-appointments-add-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.click(getByTestId('eap-journal-name-input'));
        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.mouseDown(getByTestId('eap-role-cvo-id-input'));
        fireEvent.click(getByText('Guest Editor'));
        fireEvent.click(getByTestId('eap-start-year-input'));
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });

        fireEvent.click(getByTestId('eap-end-year-input'));
        fireEvent.click(getByTestId('eap-end-year-button-input'));

        await waitFor(() => getByTestId('eap-end-year-current'));
        fireEvent.click(getByTestId('eap-end-year-current'));

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-add-save'));
        });

        // const listItem = await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

        // expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        // expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2010');
        // expect(getByTestId('eap-end-year-0', listItem)).toHaveTextContent('Current');
    });

    describe('coverage', () => {
        beforeEach(() => {
            window.matchMedia = createMatchMedia(800);
        });
        it('should show mobile cell style', () => {
            const { getByTestId } = setup({
                list: [
                    {
                        eap_id: 1,
                        eap_journal_name: 'test',
                        eap_jnl_id: 1234,
                        eap_role_cvo_id: '454148',
                        eap_start_year: '2006',
                        eap_end_year: '2026',
                        eap_role_name: 'Guest Editor',
                    },
                ],
            });
            const row = getByTestId('mtablebodyrow');
            expect(
                within(row)
                    .getByText('test')
                    .closest('td'),
            ).toHaveStyle('width: 100%');
            expect(
                within(row)
                    .getByText('test')
                    .closest('td'),
            ).toHaveStyle('display: block');
            expect(
                within(row)
                    .getByText('test')
                    .closest('td'),
            ).toHaveStyle('box-sizing: border-box');
        });
    });
});
