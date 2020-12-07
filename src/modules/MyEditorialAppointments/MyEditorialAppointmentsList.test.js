import React from 'react';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';
import { render, fireEvent, act, waitFor, WithReduxStore } from 'test-utils';

function setup(testProps = {}, renderer = render) {
    const props = {
        list: [],
        handleRowUpdate: jest.fn(() => Promise.resolve()),
        ...testProps,
    };

    return renderer(
        <WithReduxStore>
            <MyEditorialAppointmentsList {...props} />
        </WithReduxStore>,
    );
}

describe('MyEditorialAppointmentsList', () => {
    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });

    it('should render empty list', () => {
        const { getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for editorial appointments', () => {
        const { getByTestId } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123456',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
            ],
        });

        expect(getByTestId('my-editorial-appointments-list-row-0')).toBeInTheDocument();
    });

    it('should validate inputs and render updated info after editing', async () => {
        const { getByTestId, getByLabelText, getByText } = setup({
            list: [
                {
                    eap_id: 1,
                    eap_journal_name: 'test',
                    eap_jnl_id: 1234,
                    eap_role_cvo_id: '123456',
                    eap_start_year: '2006',
                    eap_end_year: '2026',
                    eap_role_name: 'Guest Editor',
                },
            ],
        });
        let listItem = getByTestId('my-editorial-appointments-list-row-0');

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('test');
        expect(getByTestId('eap-role-name-0', listItem)).toHaveTextContent('Guest Editor');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2006');
        expect(getByTestId('eap-end-year-0', listItem)).toHaveTextContent('2026');

        fireEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit'));

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: '' } });
        expect(getByTestId('eap-journal-name-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.click(getByLabelText('Clear'));
        expect(getByTestId('eap-role-name-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '' } });
        expect(getByTestId('eap-start-year-input')).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '' } });
        expect(getByTestId('eap-end-year-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('my-editorial-appointments-update-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('eap-journal-name-input'), { target: { value: 'testing' } });
        fireEvent.mouseDown(getByTestId('eap-role-name-input'));
        fireEvent.click(getByText('Guest Editor'));
        fireEvent.change(getByTestId('eap-start-year-input'), { target: { value: '2010' } });
        fireEvent.change(getByTestId('eap-end-year-input'), { target: { value: '2020' } });

        act(() => {
            fireEvent.click(getByTestId('my-editorial-appointments-update-save'));
        });

        listItem = await waitFor(() => getByTestId('my-editorial-appointments-list-row-0'));

        expect(getByTestId('eap-journal-name-0', listItem)).toHaveTextContent('testing');
        expect(getByTestId('eap-start-year-0', listItem)).toHaveTextContent('2010');
    });
});
