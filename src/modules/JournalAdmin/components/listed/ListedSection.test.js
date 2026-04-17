import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';

jest.mock('../../../../context');
import { journalDoaj } from 'mock/data';
import { useJournalContext } from 'context';
import ListedSection from './ListedSection';
import { ADMIN_JOURNAL } from 'config/general';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };

    return renderer(
        <FormProviderWrapper>
            <ListedSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('ListedSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
            },
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        const { getByTestId } = setup();

        expect(getByTestId('has-nature-index-header')).toHaveTextContent('Nature Index');
        expect(getByTestId('has-nature-index-value')).toHaveTextContent('No');

        expect(getByTestId('has-cwts-header')).toHaveTextContent('CWTS Leiden Ranking');
        expect(getByTestId('has-cwts-value')).toHaveTextContent('Yes');
    });
});
