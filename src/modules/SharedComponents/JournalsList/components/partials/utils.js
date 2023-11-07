import React from 'react';

import JournalsOpenAccessIndicator from './JournalsOpenAccessIndicator';

export const types = { published: 'published', accepted: 'accepted' };
export const status = { open: 'open', cap: 'cap', embargo: 'embargo', fee: 'fee' };

const tooltips = {
    published: {
        open: 'No fees payable by author',
        cap: 'Fees are prepaid (until cap)',
        fee: 'Fees apply',
    },
    accepted: {
        open: 'Immediate access via UQ eSpace',
        embargo: 'Delayed access via UQ eSpace',
    },
};

export const getIndicator = (type, data) => {
    if (
        (type === types.accepted &&
            !!!data.fez_journal_issn &&
            !!!data.fez_journal_issn[0].srm_open_access &&
            !!!data.fez_journal_issn[0].fez_sherpa_romeo) ||
        (type === types.published && !!!data.fez_journal_read_and_publish && !!!data.fez_journal_doaj)
    ) {
        return <></>;
    }
    const indicatorProps = {
        type,
        status: null,
    };

    if (type === types.accepted) {
        const entry = data.fez_journal_issn[0].fez_sherpa_romeo;
        if (entry?.srm_max_embargo_amount !== null) indicatorProps.status = status.embargo;
        else indicatorProps.status = status.open;
    } else {
        if (data.fez_journal_read_and_publish) {
            const entry = data.fez_journal_read_and_publish;
            if (!!entry.jnl_read_and_publish_is_capped) indicatorProps.status = status.cap;
            else if (!!entry.jnl_read_and_publish_is_discounted) indicatorProps.status = status.fee;
            else indicatorProps.status = status.open;
        } else {
            const entry = data.fez_journal_doaj;
            if (entry.jnl_doaj_apc_currency !== null) indicatorProps.status = status.fee;
            else indicatorProps.status = status.cap;
        }
    }
    return {
        ...indicatorProps,
        element: (
            <JournalsOpenAccessIndicator
                id={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                key={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                tooltip={tooltips[indicatorProps.type][indicatorProps.status]}
                {...indicatorProps}
            />
        ),
    };
};
