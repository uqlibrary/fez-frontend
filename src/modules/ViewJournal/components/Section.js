import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ViewRow from './partials/ViewRow';
import { useJournalDetailsContext } from './JournalDataContext';
import TabbedFields from './partials/TabbedFields';

export const Section = ({ sectionKey, sectionConfig }) => {
    const { journalDetails } = useJournalDetailsContext();
    return (
        <Grid item xs={12}>
            <StandardCard
                noHeader={!sectionConfig.title}
                standardCardId={`journal-details-${sectionKey}`}
                title={sectionConfig.title}
                smallTitle
            >
                {sectionConfig.rows.map((field, index) => {
                    return (
                        <ViewRow
                            key={`journal-details-${sectionKey}-view-row-${index}`}
                            viewRowId={`journal-details-${sectionKey}-view-row-${index}`}
                            fields={field}
                        />
                    );
                })}
                {!!sectionConfig.tabs && !!journalDetails[sectionConfig.key][sectionConfig.tabs.tabKey] && (
                    <TabbedFields
                        {...sectionConfig.tabs}
                        tabId={`journal-details-tab-${sectionConfig.tabs.tabId}`}
                        data={journalDetails[sectionConfig.key][sectionConfig.tabs.tabKey]}
                        title={sectionConfig.title}
                    />
                )}
            </StandardCard>
        </Grid>
    );
};

Section.propTypes = {
    sectionKey: PropTypes.string,
    sectionConfig: PropTypes.object,
};

export default React.memo(Section);
