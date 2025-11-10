import React from 'react';

import JournalsOpenAccessIndicator from './JournalsOpenAccessIndicator';

export const types = { published: 'published', accepted: 'accepted' };
export const status = { open: 'open', cap: 'cap', embargo: 'embargo', fee: 'fee' };

export const getIndicatorProps = ({ type, data }) => {
    const indicatorProps = {
        type,
        status: null,
    };

    // APC fee from DOAJ
    const hasApc = !!Number(data.fez_journal_doaj?.jnl_doaj_apc_average_price);

    // is capped and is discounted from Read and Publish Agreement
    const isCapped =
        data.fez_journal_read_and_publish?.jnl_read_and_publish_is_capped === 'Y' ||
        data.fez_journal_read_and_publish?.jnl_read_and_publish_is_capped === 'Approaching';
    const isDiscounted = !!data.fez_journal_read_and_publish?.jnl_read_and_publish_is_discounted;

    // Embargo period and open access from sherpa romeo
    const maxEmbargo = data.fez_journal_issn?.reduce((max, issn) => {
        return issn.fez_sherpa_romeo ? Math.max(max, issn.fez_sherpa_romeo.srm_max_embargo_amount) : max;
    }, 0);
    const openAccess = data.fez_journal_issn?.reduce(
        (max, issn) => issn.fez_sherpa_romeo?.srm_open_access || max,
        false,
    );

    if (type === types.accepted) {
        if (!!maxEmbargo) {
            indicatorProps.status = status.embargo;
            // should not display Published Fee and Accepted Open Icons at the same time
        } else if (openAccess && !hasApc && !isDiscounted) {
            indicatorProps.status = status.open;
        } else {
            return null;
        }
    } else if (data.fez_journal_read_and_publish) {
        if (isCapped) {
            indicatorProps.status = status.cap;
        } else if (isDiscounted) {
            indicatorProps.status = status.fee;
        } else {
            indicatorProps.status = status.open;
        }
    } else if (data.fez_journal_doaj) {
        if (hasApc) {
            indicatorProps.status = status.fee;
        } else {
            indicatorProps.status = status.open;
        }
    } else if (!maxEmbargo) {
        indicatorProps.status = status.fee;
    } else {
        return null;
    }

    return indicatorProps;
};
export const getIndicator = ({ type, data, tooltipLocale }) => {
    const indicatorProps = getIndicatorProps({ type, data });
    if (indicatorProps === null) return { element: null };
    return {
        ...indicatorProps,
        element: (
            <JournalsOpenAccessIndicator
                id={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                data-testid={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                key={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                tooltip={
                    tooltipLocale && tooltipLocale.hasOwnProperty(indicatorProps.type)
                        ? tooltipLocale[indicatorProps.type][indicatorProps.status]
                        : null
                }
                {...indicatorProps}
            />
        ),
    };
};
