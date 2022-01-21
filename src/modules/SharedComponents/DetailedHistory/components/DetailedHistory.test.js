import React from 'react';
import DetailedHistory from './DetailedHistory';
import { render, WithReduxStore, waitFor, screen } from 'test-utils';
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
        // mockApi.onAny().reply(200, {
        //     data: [
        //         {
        //             pre_id: 1,
        //             pre_date: 'Mon, 1 Jan 2020, 01:00:00 EST',
        //             pre_detail: 'First Element of the mock data',
        //         },
        //         {
        //             pre_id: 2,
        //             pre_date: 'Tue, 2 Jan 2020, 02:00:00 EST',
        //             pre_detail: 'Second Element of the mock data',
        //         },
        //     ],
        // });
        const { getByText } = setup({ record: { rek_pid: 'UQ:1' } });

        expect(loadDetailedHistoryFn).toBeCalled();

        expect(getByText('Date')).toBeInTheDocument();

        await waitFor(() => getByText('First Element of the mock data'));

        screen.debug(undefined, 100000);
    });
});
