import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';
import ReadAndPublishSection from './ReadAndPublishSection';

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
            <ReadAndPublishSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('ReadAndPublishSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
            },
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        const { getByTestId } = setup();

        expect(getByTestId('jnl_read_and_publish_is_capped-select')).toBeInTheDocument();
        expect(getByTestId('jnl_read_and_publish_is_discounted-select')).toBeInTheDocument();
        expect(getByTestId('jnl_read_and_publish_is_s2o-select')).toBeInTheDocument();
        expect(getByTestId('jnl_read_and_publish_publisher-input')).toBeInTheDocument();
        expect(getByTestId('jnl_read_and_publish_source_date-input')).toBeInTheDocument();
        expect(getByTestId('jnl_read_and_publish_source_date-input')).toHaveAttribute('disabled');
    });
});
