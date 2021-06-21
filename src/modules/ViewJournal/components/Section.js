import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ViewField from './partials/ViewField';
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
                {sectionConfig.rows.map(field => (
                    <ViewField key={`${field.fieldId}`} fieldConfig={field} />
                ))}
                {!!sectionConfig.tabs && !!journalDetails[sectionConfig.key][sectionConfig.tabs.tabKey] && (
                    <TabbedFields
                        {...sectionConfig.tabs}
                        data={journalDetails[sectionConfig.key][sectionConfig.tabs.tabKey]}
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
