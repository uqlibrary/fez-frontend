import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ViewRow from './partials/ViewRow';
import { useJournalContext } from 'context';
import TabbedFields from './partials/TabbedFields';

export const Section = ({ sectionKey, sectionConfig, wrapped = true }) => {
    const { journalDetails } = useJournalContext();
    const viewRows = sectionConfig.rows.map((field, index) => {
        const isTabbedFields = !!field.tabs && !!journalDetails[field.tabs.key][field.tabs.tabKey];
        return isTabbedFields ? (
            <TabbedFields
                {...field.tabs}
                tabId={`journal-details-tab-${field.tabs.tabId}`}
                data={journalDetails[field.tabs.key][field.tabs.tabKey]}
                title={field.tabs.heading}
            />
        ) : (
            <ViewRow
                key={`journal-details-${sectionKey}-view-row-${index}`}
                viewRowId={`journal-details-${sectionKey}-view-row-${index}`}
                fields={field}
            />
        );
    });

    return (
        <Grid item xs={12}>
            {wrapped && (
                <StandardCard
                    noHeader={!sectionConfig.title}
                    standardCardId={`journal-details-${sectionKey}`}
                    title={sectionConfig.title}
                    smallTitle
                >
                    {viewRows}
                </StandardCard>
            )}
            {!wrapped && <>{viewRows}</>}
        </Grid>
    );
};

Section.propTypes = {
    sectionKey: PropTypes.string,
    sectionConfig: PropTypes.object,
    wrapped: PropTypes.bool,
};

export default React.memo(Section);
