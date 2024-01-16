import React from 'react';
import BulkUpdatesList from './BulkUpdatesList';
import { rtlRender } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        list: [],
        ...testProps,
    };

    return renderer(<BulkUpdatesList {...props} />);
}

describe('BulkUpdatesList', () => {
    it('should render empty list', () => {
        const { getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for bulk updates', () => {
        const { getByTestId } = setup({
            list: [
                {
                    buj_created_at: '2020-09-03 00:30:08',
                    buj_started_at: '2020-09-03 00:30:05',
                    buj_finished_at: '2020-09-03 00:30:11',
                    buj_status: 'Done',
                    buj_usr_id: 1234567,
                    buj_failed_records: '',
                    buj_processed_count: 5,
                    buj_total_count: 5,
                    fez_user: {
                        usr_id: 1000002309,
                        usr_username: 'uqtest',
                        usr_full_name: 'Mr Test User',
                        usr_given_names: null,
                        usr_family_name: null,
                    },
                },
            ],
        });

        expect(getByTestId('bulk-updates-list-item-0')).toBeInTheDocument();
        // time is adjusted to local timezone, so for Brisbane the time is +10 hours
        expect(getByTestId('buj-created-at')).toHaveTextContent('2020-09-03 10:30:08');
        expect(getByTestId('buj-started-at')).toHaveTextContent('2020-09-03 10:30:05');
        expect(getByTestId('buj-finished-at')).toHaveTextContent('2020-09-03 10:30:11');
    });
    it('should render a dash if date field is null', () => {
        const { getByTestId } = setup({
            list: [
                {
                    buj_created_at: null,
                    buj_started_at: null,
                    buj_finished_at: null,
                    buj_status: 'Done',
                    buj_usr_id: 1234567,
                    buj_failed_records: '',
                    buj_processed_count: 5,
                    buj_total_count: 5,
                    fez_user: {
                        usr_id: 1000002309,
                        usr_username: 'uqtest',
                        usr_full_name: 'Mr Test User',
                        usr_given_names: null,
                        usr_family_name: null,
                    },
                },
            ],
        });

        expect(getByTestId('bulk-updates-list-item-0')).toBeInTheDocument();
        expect(getByTestId('buj-created-at')).toHaveTextContent('-');
        expect(getByTestId('buj-started-at')).toHaveTextContent('-');
        expect(getByTestId('buj-finished-at')).toHaveTextContent('-');
    });
});
