import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';

jest.mock('../../../../context');
import { journalDoaj } from 'mock/data';
import { useJournalContext } from 'context';
import IndexedSection from './IndexedSection';
import { ADMIN_JOURNAL } from 'config/general';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };

    return renderer(
        <FormProviderWrapper>
            <IndexedSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('IndexedSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
            },
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        const { getByTestId } = setup();

        expect(getByTestId('jnl-esi-subject-lookup-header')).toHaveTextContent(
            'Essential Science Indicators Research Fields',
        );
        expect(getByTestId('jnl-esi-subject-lookup-0-value')).toHaveTextContent('Mathematics (2169-0375)');

        expect(getByTestId('jnl-wos-category-scie-header')).toHaveTextContent(
            'Science Citation Index Expanded - WOS Subject Categories',
        );
        expect(getByTestId('jnl-wos-category-scie-0-1-value')).toHaveTextContent('Mathematics');

        expect(getByTestId('has-scopus-header')).toHaveTextContent('Scopus');
        expect(getByTestId('has-scopus-value')).toHaveTextContent('Yes');

        expect(getByTestId('has-pubmed-header')).toHaveTextContent('Pubmed');
        expect(getByTestId('has-pubmed-value')).toHaveTextContent('No');
    });
});
