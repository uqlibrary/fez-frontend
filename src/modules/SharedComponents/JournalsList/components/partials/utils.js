import React from 'react';

import JournalsOpenAccessIndicator from './JournalsOpenAccessIndicator';
import { isEmptyObject } from 'helpers/general';

export const types = { published: 'published', accepted: 'accepted' };
export const status = { open: 'open', cap: 'cap', embargo: 'embargo', fee: 'fee' };

export const getIndicatorProps = ({ type, data }) => {
    const indicatorProps = {
        type,
        status: null,
    };

    // APC fee from DOAJ
    const hasDOAJ = data.fez_journal_doaj && !isEmptyObject(data.fez_journal_doaj);
    const hasApc = !!Number(data.fez_journal_doaj?.jnl_doaj_apc_average_price);

    // is capped and is discounted from Read and Publish Agreement
    const hasRNP =
        data.fez_journal_read_and_publish &&
        !isEmptyObject(data.fez_journal_read_and_publish) &&
        data.fez_journal_read_and_publish.jnl_read_and_publish_is_capped?.toLowerCase() !== 'nodeal';
    const cappedValue = data.fez_journal_read_and_publish?.jnl_read_and_publish_is_capped;
    const isCapped = cappedValue === 'Y' || cappedValue === 'Approaching';
    const isDiscounted = !!data.fez_journal_read_and_publish?.jnl_read_and_publish_is_discounted;

    if (type === types.accepted) {
        // Embargo period and open access from sherpa romeo
        const maxEmbargo = data.fez_journal_issn?.reduce((max, issn) => {
            return issn.fez_sherpa_romeo ? Math.max(max, issn.fez_sherpa_romeo.srm_max_embargo_amount) : max;
        }, 0);
        const openAccess = data.fez_journal_issn?.reduce(
            (max, issn) => issn.fez_sherpa_romeo?.srm_open_access || max,
            false,
        );

        if (!!maxEmbargo) {
            indicatorProps.status = status.embargo;
            indicatorProps.embargoPeriod = maxEmbargo;
            // should not display Published Fee and Accepted Open Icons at the same time
        } else if (
            openAccess &&
            ((hasDOAJ && !hasApc) || (hasRNP && (isCapped || (cappedValue === 'N' && !isDiscounted))))
        ) {
            indicatorProps.status = status.open;
        } else {
            return null;
        }
    } else {
        indicatorProps.status = status.fee;
        if (hasRNP) {
            const isS2O = data.fez_journal_read_and_publish.jnl_read_and_publish_is_s2o;
            if (isS2O === 'S2O') {
                indicatorProps.showS2O = true;
                indicatorProps.status = status.open;
            } else if (isCapped) {
                indicatorProps.status = status.cap;
            } else if (cappedValue === 'N' && !isDiscounted) {
                indicatorProps.status = status.open;
                if (isS2O === 'Y') {
                    indicatorProps.showS2O = true;
                }
            }
        } else if (hasDOAJ) {
            const doajData = data.fez_journal_doaj;
            if (!hasApc) {
                indicatorProps.status = status.open;
                if (doajData.jnl_doaj_has_other_fees === false) {
                    indicatorProps.showDiamond = true;
                }
            }

            if (!!doajData.jnl_doaj_is_s2o) {
                indicatorProps.showS2O = true;
            }
        }
    }

    return indicatorProps;
};
export const getIndicator = ({ type, data, tooltipLocale }) => {
    const indicatorProps = getIndicatorProps({ type, data });
    if (indicatorProps === null) return { element: null };
    const tooltip =
        tooltipLocale && tooltipLocale.hasOwnProperty(indicatorProps.type)
            ? tooltipLocale[indicatorProps.type][indicatorProps.status]
            : null;

    return {
        ...indicatorProps,
        element: (
            <JournalsOpenAccessIndicator
                id={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                data-testid={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                key={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                tooltip={
                    (tooltip && indicatorProps.status === 'embargo' && tooltip(indicatorProps.embargoPeriod)) || tooltip
                }
                {...indicatorProps}
            />
        ),
    };
};
