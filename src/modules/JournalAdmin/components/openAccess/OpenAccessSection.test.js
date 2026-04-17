import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';
import OpenAccessSection from './OpenAccessSection';

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
            <OpenAccessSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('OpenAccessSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
            journalDetails: {
                ...journalDoaj.data,
            },
        }));

        const { getByTestId } = setup();

        expect(getByTestId('jnl-read-and-publish-header')).toHaveTextContent('UQ publisher agreement');
        expect(getByTestId('jnl-read-and-publish-value')).toHaveTextContent('Discount');
        expect(getByTestId('jnl-doaj-apc-average-price-header')).toHaveTextContent('Article processing charges');
        expect(getByTestId('jnl-doaj-apc-average-price-value')).toHaveTextContent('1000 EUR');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup-link')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en',
        );
    });
});
