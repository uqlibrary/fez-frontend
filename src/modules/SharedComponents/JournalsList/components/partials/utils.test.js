import React from 'react';
import { render } from 'test-utils';

import { mockData } from 'mock/data/testing/journals/journalSearchResults';
import { types, status, getIndicator, getIndicatorProps } from './utils';

describe('utils', () => {
    it('getIndicator', () => {
        const data = { ...mockData.data[0] };

        // returns empty
        const output = getIndicator({ type: types.published, data });
        expect(output).toEqual({ element: null });

        const tooltipLocale = {
            accepted: {
                embargo: 'Test embargo',
            },
        };
        // returns node
        const { element } = getIndicator({ type: types.accepted, data, tooltipLocale });
        const { getByTestId } = render(<>{element}</>);

        expect(getByTestId('journal-indicator-accepted-13251')).toBeInTheDocument();
        expect(getByTestId('journal-indicator-accepted-13251')).toHaveAttribute(
            'aria-label',
            tooltipLocale.accepted.embargo,
        );
        expect(getByTestId('journal-indicator-accepted-13251')).toHaveTextContent('embargo');
    });

    it('getIndicatorProps', () => {
        // check nothing is returned

        let publishedIndicatorProps = getIndicatorProps({ type: types.published, data: {} });
        let acceptedIndicatorProps = getIndicatorProps({ type: types.accepted, data: {} });
        expect(publishedIndicatorProps).toBeNull();
        expect(acceptedIndicatorProps).toBeNull();

        const dataItem1 = { ...mockData.data[0] };

        // accepted embargo
        acceptedIndicatorProps = getIndicatorProps({ type: types.accepted, data: dataItem1 });
        expect(acceptedIndicatorProps).toEqual({ type: types.accepted, status: status.embargo });

        // accepted open
        const dataItem2 = { ...mockData.data[0] };
        dataItem2.fez_journal_issn[0].fez_sherpa_romeo.srm_max_embargo_amount = null;
        acceptedIndicatorProps = getIndicatorProps({ type: types.accepted, data: dataItem2 });
        expect(acceptedIndicatorProps).toEqual({ type: types.accepted, status: status.open });

        // published open
        const dataItem3 = { ...mockData.data[0] };
        dataItem3.fez_journal_read_and_publish = {};
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem3 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.open });

        // published capped
        dataItem3.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'Y';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem3 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.cap });

        // published capped
        dataItem3.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'Approaching';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem3 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.cap });

        // published fee
        dataItem3.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'N';
        dataItem3.fez_journal_read_and_publish.jnl_read_and_publish_is_discounted = true;
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem3 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.fee });

        // published fee
        dataItem3.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'Exceeded';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem3 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.fee });

        // published fallback fee
        const dataItem4 = { ...mockData.data[0] };
        dataItem4.fez_journal_doaj = {};
        dataItem4.fez_journal_doaj.jnl_doaj_apc_currency = 'AUD';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem4 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.fee });
    });
});
