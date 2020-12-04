import React from 'react';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';
import { render } from 'test-utils';

function setup(testProps = {}, renderer = render) {
    const props = {
        list: [],
        ...testProps,
    };

    return renderer(<MyEditorialAppointmentsList {...props} />);
}

describe('MyEditorialAppointmentsList', () => {
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
});
