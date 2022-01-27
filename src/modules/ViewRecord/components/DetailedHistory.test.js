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
                    pre_date: 'Mon, 1 Jan 2020, 01:00:00 EST',
                    pre_detail: 'First Element of the mock data',
                },
                {
                    pre_id: 2,
                    pre_date: 'Tue, 2 Jan 2020, 02:00:00 EST',
                    pre_detail: 'Second Element of the mock data',
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
});
