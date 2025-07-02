import React from 'react';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';
import {
    render,
    fireEvent,
    userEvent,
    act,
    waitFor,
    WithReduxStore,
    createMatchMedia,
    within,
    selectDropDownOption,
} from 'test-utils';

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
    beforeEach(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render empty list', () => {
        const { getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for editorial appointments', () => {
        const { container } = setup({
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
        expect(container.querySelectorAll('.MuiTableRow-root').length - 1).toBe(1);
    });

    it('should render rows with red indicator for expired editorial appointments', () => {
        const { container } = setup({
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
        expect(container.querySelectorAll('.MuiTableRow-root').length - 1).toBe(1);
    });

    it('should validate inputs and render added info after adding', async () => {
        jest.resetAllMocks();
        const { container, getByTestId } = setup({
            list: [],
        });
        fireEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));

        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-role-cvo-id-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        await userEvent.type(getByTestId('eap-journal-name-input'), 'testing');
        await selectDropDownOption('eap-role-cvo-id-input', 'Guest Editor');
        await userEvent.type(getByTestId('eap-start-year-input'), '2010');
        await userEvent.type(getByTestId('eap-end-year-input'), '2009');
        expect(getByTestId('my-editorial-appointments-list-row-add').textContent).toContain(
            locale.components.myEditorialAppointmentsList.form.locale.endYearErrorMessage,
        );

        await userEvent.type(getByTestId('eap-end-year-input'), '{Control>}a{/Control}{Backspace}2020');

        expect(getByTestId('my-editorial-appointments-list-row-add')).not.toHaveTextContent(
            locale.components.myEditorialAppointmentsList.form.locale.endYearErrorMessage,
        );

        await userEvent.click(getByTestId('my-editorial-appointments-add-save'));

        await waitFor(() => expect(container.querySelectorAll('.MuiTableRow-root').length - 1).toBe(1));
        const listItem = container.querySelectorAll('.MuiTableRow-root');

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2010');
    });

    it('should allow input of dates into eap-start-year and eap-end-year datepickers', async () => {
        const { getByTestId, container } = setup({ list: [] });

        // Start add flow
        fireEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));

        // Fill required fields except years
        await userEvent.type(getByTestId('eap-journal-name-input'), 'Journal of Testing');
        await selectDropDownOption('eap-role-cvo-id-input', 'Guest Editor');

        // Input start year
        const startYearInput = getByTestId('eap-start-year-input');
        await userEvent.type(getByTestId('eap-start-year-input'), '2015');
        // fireEvent.change(startYearInput, { target: { value: '2015' } });
        await waitFor(() => expect(startYearInput.value).toBe('2015'));

        // Input end year
        const endYearInput = getByTestId('eap-end-year-input');
        await userEvent.type(getByTestId('eap-end-year-input'), '2020');
        // fireEvent.change(endYearInput, { target: { value: '2020' } });
        expect(endYearInput.value).toBe('2020');

        await userEvent.click(getByTestId('my-editorial-appointments-add-save'));

        await waitFor(() => container.querySelectorAll('.MuiTableRow-root'));
        expect(getByTestId('eap-journal-name-0')).toHaveTextContent('Journal of Testing');
        expect(getByTestId('eap-start-year-0')).toHaveTextContent('2015');
        expect(getByTestId('eap-end-year-0')).toHaveTextContent('2020');
    });

    it('should render previous list on unsuccessful add operation', async () => {
        const { container, getByTestId, getByText } = setup({
            list: [],
            handleRowAdd: jest.fn(() => Promise.reject()),
        });

        fireEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));

        await userEvent.type(getByTestId('eap-journal-name-input'), 'testing');
        await selectDropDownOption('eap-role-cvo-id-input', 'Guest Editor');
        await userEvent.type(getByTestId('eap-start-year-input'), '2010');
        await userEvent.type(getByTestId('eap-end-year-input'), '2020');

        await userEvent.click(getByTestId('my-editorial-appointments-add-save'));

        await waitFor(() => getByText('No records to display'));

        expect(container.querySelectorAll('.MuiTableRow-root').length - 1).toBe(0);
    });

    it('should validate inputs and render updated info after editing', async () => {
        const { container, getByTestId } = setup({
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
        const listItem = container.querySelector('.MuiTableRow-root');

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('test');
        expect(getByTestId('eap-role-name-0', listItem)).toHaveTextContent('Guest Editor');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2006');
        expect(getByTestId('eap-end-year-0', listItem)).toHaveTextContent('2026');

        await userEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        await userEvent.clear(getByTestId('eap-journal-name-input'));

        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');

        await userEvent.click(
            getByTestId('eap-role-cvo-id-input')
                .closest('div')
                .querySelector('[aria-label=Clear]'),
        );

        expect(getByTestId('eap-role-cvo-id-input')).toHaveAttribute('aria-invalid', 'true');

        await userEvent.clear(getByTestId('eap-start-year-input'));

        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');

        await userEvent.clear(getByTestId('eap-end-year-input'));
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        await userEvent.type(getByTestId('eap-journal-name-input'), 'testing');
        await selectDropDownOption('eap-role-cvo-id-input', 'Other');

        expect(getByTestId('eap-role-name-input')).toBeInTheDocument();
        await userEvent.type(getByTestId('eap-role-name-input'), 'Testing other role');
        await userEvent.type(getByTestId('eap-start-year-input'), '2010');
        await userEvent.type(getByTestId('eap-end-year-input'), '2020');

        await userEvent.click(getByTestId('my-editorial-appointments-edit-save').closest('button'));

        await waitFor(() => container.querySelector('.MuiTableRow-root'));

        expect(getByTestId('eap-journal-name-0')).toHaveTextContent('testing');
        expect(getByTestId('eap-start-year-0')).toHaveTextContent('2010');
        expect(getByTestId('eap-role-name-0')).toHaveTextContent('Other (Testing other role)');

        await userEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        await userEvent.clear(getByTestId('eap-journal-name-input'));
        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.keyDown(getByTestId('eap-journal-name-input'), { key: 'Enter', keyCode: 13 });
    });

    it('should render previous list on unsuccessful edit operation', async () => {
        const { getByTestId, findByTestId } = setup({
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

        await userEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        await userEvent.type(getByTestId('eap-journal-name-input'), 'testing');
        await userEvent.type(getByTestId('eap-start-year-input'), '2010');
        await userEvent.type(getByTestId('eap-end-year-input'), '2020');

        await userEvent.click(getByTestId('my-editorial-appointments-edit-save').closest('button'));
        expect(await findByTestId('eap-journal-name-0')).toHaveTextContent('test');
    });

    it('should render previous list when edit operation cancelled', async () => {
        const { getByTestId, findByTestId } = setup({
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

        await userEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));

        await userEvent.type(getByTestId('eap-journal-name-input'), 'testing');
        await userEvent.type(getByTestId('eap-start-year-input'), '2010');
        await userEvent.type(getByTestId('eap-end-year-input'), '2020');

        await userEvent.click(getByTestId('my-editorial-appointments-edit-cancel').closest('button'));
        expect(await findByTestId('eap-journal-name-0')).toHaveTextContent('test');
    });

    it('should delete my editorial appointment item', async () => {
        const { container, getByTestId, findByTestId, queryByTestId } = setup({
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

        expect(container.querySelectorAll('.MuiTableRow-root').length - 1).toBe(2);
        await userEvent.click(getByTestId('my-editorial-appointments-list-row-0-delete-this-editorial-appointment'));

        await findByTestId('my-editorial-appointments-delete-appointment-confirmation'); // wait for the delete popup to appear

        await userEvent.click(getByTestId('confirm-my-editorial-appointments-delete-appointment-confirmation'));

        await act(async () => {
            // coverage: allow time for the promise's timeout to update state
            await new Promise(res => setTimeout(res, 1100));
        });
        expect(queryByTestId('my-editorial-appointments-delete-appointment-confirmation')).not.toBeInTheDocument();

        const listItem = await waitFor(() => container.querySelectorAll('.MuiTableRow-root'));
        expect(listItem.length - 1).toBe(1);
        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        expect(getByTestId('eap-role-name-0', listItem)).toHaveTextContent('Editor');
    });

    it('should display "Current" for "eap_end_year" column if the year is same as current year', () => {
        global.mockDate.set('1/1/2022');
        const { container, getByTestId } = setup({
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

        expect(container.querySelectorAll('.MuiTableRow-root').length - 1).toBe(1);
        expect(getByTestId('eap-end-year-0')).toHaveTextContent('Current');
    });

    it('should select "Current" year on clicking "Current" options from the year popup menu', async () => {
        global.mockDate.set('1/1/2022');
        const { getByTestId } = setup({
            list: [],
        });

        fireEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));

        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-role-cvo-id-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        await userEvent.type(getByTestId('eap-journal-name-input'), 'testing');
        await selectDropDownOption('eap-role-cvo-id-input', 'Guest Editor');
        await userEvent.type(getByTestId('eap-start-year-input'), '2010');

        await userEvent.click(within(getByTestId('eap-end-year-button-input')).getByTestId('CalendarIcon'));

        await waitFor(() => getByTestId('eap-end-year-current'));
        await userEvent.click(getByTestId('eap-end-year-current'));

        await userEvent.click(getByTestId('my-editorial-appointments-add-save').closest('button'));
        const listItem = document.querySelector('#my-editorial-appointments-list-row-0');

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2010');
        expect(getByTestId('eap-end-year-0', listItem)).toHaveTextContent('Current');
    });

    describe('coverage', () => {
        beforeEach(() => {
            window.matchMedia = createMatchMedia(320);
        });
        it('should show mobile add dialog', async () => {
            const { getByTestId, findByTestId } = setup({
                list: [],
            });
            await userEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));
            await findByTestId('my-editorial-appointments-dialog-add-new-editorial-appointment');
        });
        it('should show mobile edit dialog', async () => {
            const { getByTestId, findByTestId } = setup({
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
            await userEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));
            await findByTestId('my-editorial-appointments-dialog-edit-this-editorial-appointment');
        });
    });
});
