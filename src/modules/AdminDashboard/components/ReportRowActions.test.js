import React from 'react';
import { render, fireEvent, waitFor, WithReduxStore } from 'test-utils';
import ReportRowActions from './ReportRowActions';
import { ADMIN_DASHBOARD_SYSTEM_ALERTS_API } from 'repositories/routes';

const setup = ({ row, gridApi }) => {
    return render(
        <WithReduxStore>
            <ReportRowActions row={row} gridApi={gridApi} />
        </WithReduxStore>,
    );
};

describe('RowActions', () => {
    let mockGridApi;
    beforeEach(() => {
        mockGridApi = {
            updateRows: jest.fn(),
        };
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('renders no button', () => {
        const row = { sat_id: '123' };
        const { queryByRole } = setup({ row, gridApi: mockGridApi });
        expect(queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders Unresolve button initially', () => {
        const row = { sat_id: '123', resolved_by_full_name: 'Test User' };
        const { getByRole } = setup({ row, gridApi: mockGridApi });
        const button = getByRole('button');
        expect(button).toHaveTextContent('Unresolve');
        expect(button).not.toBeDisabled();
    });

    it('should call api and update button text on click', async () => {
        const row = { sat_id: '123', resolved_by_full_name: 'Test User' };
        mockApi.onPut(new RegExp(ADMIN_DASHBOARD_SYSTEM_ALERTS_API({ id: '.*' }).apiUrl)).replyOnce(200, {});

        const { getByRole } = setup({ row, gridApi: mockGridApi });
        const button = getByRole('button');

        fireEvent.click(button);

        // Immediately shows updating
        await waitFor(() => {
            expect(button).toHaveTextContent('Updating...');
            expect(button).toBeDisabled();
        });

        // After success, row updated
        await waitFor(() => {
            expect(mockGridApi.updateRows).toHaveBeenCalledWith([
                expect.objectContaining({
                    sat_id: row.sat_id,
                    resolved_by_full_name: null,
                    sat_resolved_date: null,
                }),
            ]);
        });

        // Button text changes
        await waitFor(() => {
            expect(button).toHaveTextContent('Unresolved');
            expect(button).toBeDisabled();
        });
    });

    it('handles api failure gracefully', async () => {
        const row = { sat_id: '123', resolved_by_full_name: 'Test User' };
        mockApi.onPut(new RegExp(ADMIN_DASHBOARD_SYSTEM_ALERTS_API({ id: '.*' }).apiUrl)).replyOnce(500, {});

        const { getByRole } = setup({ row, gridApi: mockGridApi });
        const button = getByRole('button');

        fireEvent.click(button);

        // Immediately shows updating
        await waitFor(() => {
            expect(button).toHaveTextContent('Updating...');
            expect(button).toBeDisabled();
        });

        // Button text back to initial
        await waitFor(() => {
            expect(button).toHaveTextContent('Unresolve');
            expect(button).not.toBeDisabled();
        });
    });
});
