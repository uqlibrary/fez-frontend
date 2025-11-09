import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';
import UqDataSection from './UqDataSection';

jest.mock('../../../../context');
import { useJournalContext } from 'context';
import { journalDoaj } from 'mock/data';
import { ADMIN_JOURNAL } from 'config/general';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };

    return renderer(
        <FormProviderWrapper>
            <UqDataSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('UqDataSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
                fez_editorial_appointment: [],
            },
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        const { getByTestId } = setup();

        expect(getByTestId('jnl-uq-author-count-header')).toHaveTextContent('Number of UQ Authors');
        expect(getByTestId('jnl-uq-author-count-value')).toHaveTextContent('0');
    });

    it('should render editorial staff', () => {
        const editorialAppointment = {
            fez_editorial_appointment: [
                {
                    jnl_read_and_publish_issn: '2169-0375',
                    jnl_read_and_publish_title: 'Advanced Nonlinear Studies',
                    jnl_read_and_publish_publisher: 'De Gruyter',
                    jnl_read_and_publish_is_capped: false,
                    jnl_read_and_publish_is_discounted: false,
                    jnl_read_and_publish_source_date: '2023-07-19',
                    fez_author: {
                        aut_id: 1,
                        aut_display_name: 'Author',
                        aut_org_username: 'uqauthor',
                    },
                },
            ],
        };
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
                uq_author_id_count: 1,
                ...editorialAppointment,
            },
            jnlDisplayType: 'adminjournal',
        }));

        const { getByTestId } = setup();

        expect(getByTestId('jnl-uq-author-count-header')).toHaveTextContent('Number of UQ Authors');
        expect(getByTestId('jnl-uq-author-count-value')).toHaveTextContent('1');

        expect(getByTestId('jnl-editorial-staff-header')).toHaveTextContent('UQ Editorial Staff');
        expect(getByTestId('jnl-editorial-staff-0-value')).toHaveTextContent('Author');
        expect(getByTestId('jnl-editorial-staff-0-lookup-link')).toHaveAttribute(
            'href',
            'https://app.library.uq.edu.au/#/authors/uqauthor',
        );
    });
});
