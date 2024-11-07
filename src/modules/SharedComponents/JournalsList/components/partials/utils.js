import React from 'react';

import JournalsOpenAccessIndicator from './JournalsOpenAccessIndicator';

export const types = { published: 'published', accepted: 'accepted' };
export const status = { open: 'open', cap: 'cap', embargo: 'embargo', fee: 'fee' };

export const getIndicatorProps = ({ type, data }) => {
    const indicatorProps = {
        type,
        status: null,
    };

    if (
        (type === types.accepted &&
            !!!data.fez_journal_issn &&
            !!!data.fez_journal_issn?.[0].srm_open_access &&
            !!!data.fez_journal_issn?.[0].fez_sherpa_romeo) ||
        (type === types.published &&
            !!!data.fez_journal_read_and_publish &&
            (!!!data.fez_journal_doaj || !!!data.fez_journal_doaj?.jnl_doaj_apc_currency))
    ) {
        return null;
    }

    if (type === types.accepted) {
        const entry = data.fez_journal_issn?.[0]?.fez_sherpa_romeo;
        if (entry?.srm_max_embargo_amount) indicatorProps.status = status.embargo;
        else indicatorProps.status = status.open;
    } else {
        if (data.fez_journal_read_and_publish) {
            const entry = data.fez_journal_read_and_publish;
            if (
                entry.jnl_read_and_publish_is_capped === 'Y' ||
                entry.jnl_read_and_publish_is_capped === 'Approaching'
            ) {
                indicatorProps.status = status.cap;
            } else if (!!entry.jnl_read_and_publish_is_discounted) indicatorProps.status = status.fee;
            else indicatorProps.status = status.open;
        } else {
            /* istanbul ignore else */
            if (!!data.fez_journal_doaj?.jnl_doaj_apc_currency) indicatorProps.status = status.fee;
        }
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
