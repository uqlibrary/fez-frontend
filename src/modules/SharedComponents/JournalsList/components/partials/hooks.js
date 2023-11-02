import React from 'react';

import JournalsOpenAccessIndicator from './JournalsOpenAccessIndicator';

export const types = { published: 'published', accepted: 'accepted' };
export const status = { open: 'open', capped: 'capped', embargo: 'embargo', fee: 'fee' };

export const useOAIndicator = () => {
    const getIndicator = (type, data) => {
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
                if (!!entry.jnl_read_and_publish_is_capped) indicatorProps.status = status.capped;
                else if (!!entry.jnl_read_and_publish_is_discounted) indicatorProps.status = status.fee;
                else indicatorProps.status = status.open;
            } else {
                const entry = data.fez_journal_doaj;
                if (entry.jnl_doaj_apc_currency !== null) indicatorProps.status = status.fee;
                else indicatorProps.status = status.capped;
            }
        }
        return {
            element: (
                <JournalsOpenAccessIndicator
                    id={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                    key={`journal-indicator-${indicatorProps.type}-${data.jnl_jid}`}
                    {...indicatorProps}
                />
            ),
            status: indicatorProps.status,
        };
    };
    return { getIndicator };
};
