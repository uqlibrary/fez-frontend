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
                embargo: months => `${months} months Test embargo`,
            },
        };
        // returns node
        const { element } = getIndicator({ type: types.accepted, data, tooltipLocale });
        const { getByTestId } = render(<>{element}</>);

        expect(getByTestId('journal-indicator-accepted-13251')).toBeInTheDocument();
        expect(getByTestId('journal-indicator-accepted-13251')).toHaveAttribute('aria-label', '6 months Test embargo');
        expect(getByTestId('journal-indicator-accepted-13251')).toHaveTextContent('embargo');
    });

    it('getIndicator empty tooltip', () => {
        const data = { ...mockData.data[0] };
        // empty tooltipLocale
        data.fez_journal_read_and_publish = {};
        data.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'Y';
        const { element } = getIndicator({ type: types.published, data });
        const { getByTestId } = render(<>{element}</>);

        expect(getByTestId('journal-indicator-published-13251')).toBeInTheDocument();
        expect(getByTestId('journal-indicator-published-13251')).not.toHaveAttribute('aria-label');
    });

    it('getIndicatorProps', () => {
        // check nothing is returned

        let publishedIndicatorProps = getIndicatorProps({ type: types.published, data: {} });
        let acceptedIndicatorProps = getIndicatorProps({ type: types.accepted, data: {} });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.fee });
        expect(acceptedIndicatorProps).toBeNull();

        const dataItem1 = JSON.parse(JSON.stringify(mockData.data[0]));

        // accepted embargo
        acceptedIndicatorProps = getIndicatorProps({ type: types.accepted, data: dataItem1 });
        expect(acceptedIndicatorProps).toEqual({ type: types.accepted, status: status.embargo, embargoPeriod: 6 });

        // accepted embargo - from second issn
        delete dataItem1.fez_journal_issn[0].fez_sherpa_romeo;
        acceptedIndicatorProps = getIndicatorProps({ type: types.accepted, data: dataItem1 });
        expect(acceptedIndicatorProps).toEqual({ type: types.accepted, status: status.embargo, embargoPeriod: 6 });

        // accepted embargo - from second issn
        const dataItem2 = { ...mockData.data[0] };

        dataItem2.fez_journal_issn[0].fez_sherpa_romeo.srm_max_embargo_amount = null;
        acceptedIndicatorProps = getIndicatorProps({ type: types.accepted, data: dataItem2 });
        expect(acceptedIndicatorProps).toEqual({ type: types.accepted, status: status.embargo, embargoPeriod: 6 });

        // accepted open
        dataItem2.fez_journal_issn[1].fez_sherpa_romeo.srm_max_embargo_amount = null;
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

        // published fee - discounted
        dataItem3.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'N';
        dataItem3.fez_journal_read_and_publish.jnl_read_and_publish_is_discounted = true;
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem3 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.fee });

        // published fee - cap exceeded
        dataItem3.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'Exceeded';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem3 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.fee });

        // published fee - apc
        const dataItem4 = { ...mockData.data[0] };
        dataItem4.fez_journal_doaj = {};
        dataItem4.fez_journal_doaj.jnl_doaj_apc_average_price = '11.0';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem4 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.fee });

        // published open - unexpected string on apc fee
        dataItem4.fez_journal_doaj = {};
        dataItem4.fez_journal_doaj.jnl_doaj_apc_average_price = 'unlisted';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem4 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.open });

        // diamond journal
        dataItem4.fez_journal_doaj = {};
        dataItem4.fez_journal_doaj.jnl_doaj_apc_currency = '';
        dataItem4.fez_journal_doaj.jnl_doaj_has_other_fees = false;
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem4 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.open, showDiamond: true });

        // doaj s2o
        dataItem4.fez_journal_doaj = {};
        dataItem4.fez_journal_doaj.jnl_doaj_is_s2o = '1';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem4 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.open, showS2O: true });

        // read and publish s2o, is_s2o = 'S2O
        const dataItem5 = { ...mockData.data[0] };
        dataItem5.fez_journal_read_and_publish = {};
        dataItem5.fez_journal_read_and_publish.jnl_read_and_publish_is_s2o = 'S2O';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem5 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.open, showS2O: true });

        // not s2o
        dataItem5.fez_journal_read_and_publish = {};
        dataItem5.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'Y';
        dataItem5.fez_journal_read_and_publish.jnl_read_and_publish_is_discounted = false;
        dataItem5.fez_journal_read_and_publish.jnl_read_and_publish_is_s2o = 'Y';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem5 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.cap });

        // read and publish s2o, is_s2o = 'Y' and is_capped = 'N' and is_discounted = false
        dataItem5.fez_journal_read_and_publish = {};
        dataItem5.fez_journal_read_and_publish.jnl_read_and_publish_is_capped = 'N';
        dataItem5.fez_journal_read_and_publish.jnl_read_and_publish_is_discounted = false;
        dataItem5.fez_journal_read_and_publish.jnl_read_and_publish_is_s2o = 'Y';
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem5 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.open, showS2O: true });

        // both diamond and s2o, s2o > diamond
        dataItem5.fez_journal_doaj = {};
        dataItem5.fez_journal_doaj.jnl_doaj_apc_currency = '';
        dataItem5.fez_journal_doaj.jnl_doaj_has_other_fees = false;
        publishedIndicatorProps = getIndicatorProps({ type: types.published, data: dataItem5 });
        expect(publishedIndicatorProps).toEqual({ type: types.published, status: status.open, showS2O: true });
    });
});
