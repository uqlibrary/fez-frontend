import React from 'react';
import DetailedHistory from './DetailedHistory';
import { render, WithReduxStore, waitFor, fireEvent } from 'test-utils';
import * as viewRecordActions from 'actions/viewRecord';

const setup = (testProps = {}) => {
    return render(
        <WithReduxStore>
            <DetailedHistory {...testProps} />
        </WithReduxStore>,
    );
};
describe('Detailed History', () => {
    beforeEach(() => {
        mockApi.onGet().reply(200, {
            data: [
                {
                    pre_id: 1,
                    pre_date: '2020-01-01 00:00:00',
                    pre_detail: 'First Element of the mock data',
                },
                {
                    pre_id: 2,
                    pre_date: '2020-01-02 14:00:00',
                    pre_detail: 'Second Element of the mock data',
                },
                {
                    pre_id: 3,
                    pre_date: '2020-01-03 10:00:00 UTC',
                    pre_detail: 'Third Element of the mock data',
                },
            ],
        });
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should render default view', async () => {
        const loadDetailedHistoryFn = jest.spyOn(viewRecordActions, 'loadDetailedHistory');

        const { getByText } = setup({ record: { rek_pid: 'UQ:1' } });

        expect(loadDetailedHistoryFn).toBeCalled();

        await waitFor(() => getByText('First Element of the mock data'));
        expect(getByText('Date')).toBeInTheDocument();
        expect(getByText('Event')).toBeInTheDocument();
    });

    it('should expand and collapse correctly', async () => {
        const { getByText, getByTestId, container } = setup({ record: { rek_pid: 'UQ:1' } });

        await waitFor(() => getByText('First Element of the mock data'));
        expect(container.getElementsByClassName('MuiCollapse-hidden').length).toBe(1);
        fireEvent.click(getByTestId('detailed-history-header'));
        expect(container.getElementsByClassName('MuiCollapse-hidden').length).toBe(0);
    });
    it('should contain the correct content', async () => {
        const { getByText, getByTestId } = setup({ record: { rek_pid: 'UQ:1' } });

        await waitFor(() => getByText('First Element of the mock data'));
        expect(getByText('First Element of the mock data')).toBeInTheDocument();
        fireEvent.click(getByTestId('detailed-history-header'));
        expect(getByText('Second Element of the mock data')).toBeInTheDocument();
    });

    it('should render the correct dates for the timezone', async () => {
        const { getByText, getByTestId } = setup({ record: { rek_pid: 'UQ:1' } });
        await waitFor(() => getByText('First Element of the mock data'));
        expect(getByTestId('detailed-history-date-1')).toHaveTextContent('Wed Jan 01 2020, 10:00:00 AM');
        expect(getByTestId('detailed-history-date-2')).toHaveTextContent('Fri Jan 03 2020, 12:00:00 AM');
    });
});
