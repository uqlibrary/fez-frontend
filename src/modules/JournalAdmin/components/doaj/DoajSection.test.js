import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';
import DoajSection from './DoajSection';

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
            <DoajSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('DoajSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
            journalDetails: {
                ...journalDoaj.data,
            },
        }));

        const { getByTestId } = setup();

        expect(getByTestId('ulr-open-access-header')).toHaveTextContent('Open access');
        expect(getByTestId('ulr-open-access-value')).toHaveTextContent('No');
        expect(getByTestId('jnl-doaj-homepage-url-header')).toHaveTextContent('Journal home page');
        expect(getByTestId('jnl-doaj-homepage-url-lookup-link')).toHaveAttribute(
            'href',
            'https://www.degruyter.com/journal/key/ans/html',
        );
        expect(getByTestId('jnl-doaj-apc-average-price-header')).toHaveTextContent('Article processing charges');
        expect(getByTestId('jnl-doaj-apc-average-price-value')).toHaveTextContent('1000 EUR');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup-link')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en',
        );
        expect(getByTestId('jnl-doaj-last-updated-header')).toHaveTextContent('Last updated');
        expect(getByTestId('jnl-doaj-last-updated-value')).toHaveTextContent('22nd August 2022 at 9:57am');
    });
});
