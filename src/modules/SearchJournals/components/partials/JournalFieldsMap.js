import React from 'react';

/**
 * Journal search list field map
 *
 *
 */
export const JournalFieldsMap = [
    {
        key: 'jnl_title',
        label: 'Journal title',
        size: 300,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: true,
        translateFn: data => {
            return data;
        },
    },
    {
        // This one needs some padding to appear correct
        key: 'jnl_publisher',
        label: <span style={{ paddingLeft: 12 }}>Publisher</span>,
        size: 300,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: true,
        translateFn: data => {
            return <span style={{ paddingLeft: 12 }}>{data}</span>;
        },
    },
    {
        key: 'jnl_jid',
        label: 'Journal ID',
        size: 75,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: false,
        translateFn: data => {
            return data;
        },
    },
    {
        key: 'jnl_created_date',
        label: 'Created date',
        size: 100,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: false,
        translateFn: data => {
            return data;
        },
    },
    {
        key: 'jnl_updated_date',
        label: 'Updated date',
        size: 100,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: false,
        translateFn: data => {
            return data;
        },
    },
    {
        key: 'jnl_era_source_id',
        label: 'ERA source ID',
        size: 100,
        prefix: '',
        suffix: '',
        compactView: true,
        showTooltip: false,
        translateFn: data => {
            return data;
        },
    },
];
