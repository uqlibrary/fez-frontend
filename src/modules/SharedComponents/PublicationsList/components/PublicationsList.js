import React from 'react';
import PropTypes from 'prop-types';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { useRecordsSelector } from 'hooks';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/styles';

import BulkUpdatesActions from './BulkUpdatesActions';

const useStyles = makeStyles(() => ({
    root: {
        alignItems: 'center',
        margin: 0,
    },
}));

export const PublicationsList = ({
    publicationsList,
    publicationsListSubset,
    subsetCustomActions,
    customActions,
    showAdminActions,
    showDefaultActions,
    showSources,
    showMetrics,
    showSourceCountIcon,
    showUnpublishedBufferFields,
    hideCountDiff,
    hideCountTotal,
    publicationsLoading,
}) => {
    const {
        shouldRenderRecordsSelectors,
        recordsSelected,
        allSelected,
        handleClick,
        handleSelectAll,
    } = useRecordsSelector();

    const classes = useStyles();

    const renderPublicationCitation = (index, publication) => {
        return (
            <PublicationCitation
                publicationsLoading={publicationsLoading}
                key={index + publication.rek_title + publication.rek_date}
                publication={publication}
                customActions={
                    !publication.rek_pid || publicationsListSubset.indexOf(publication.rek_pid) === -1
                        ? customActions
                        : subsetCustomActions
                }
                showSources={showSources}
                showAdminActions={!!showAdminActions}
                showDefaultActions={showDefaultActions}
                showMetrics={showMetrics}
                showSourceCountIcon={showSourceCountIcon}
                showUnpublishedBufferFields={showUnpublishedBufferFields}
                hideCountDiff={hideCountDiff}
                hideCountTotal={hideCountTotal}
                citationStyle="list"
            />
        );
    };

    const publications = publicationsList.map((publication, index) => {
        return renderPublicationCitation(index, publication);
    });

    if (!shouldRenderRecordsSelectors) {
        return <React.Fragment>{publications}</React.Fragment>;
    }

    const handleChange = publication => event => handleClick(publication, event.target.checked);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                    <Box flexGrow={1}>
                        <FormControlLabel
                            classes={{
                                root: classes.root,
                            }}
                            control={
                                <Checkbox
                                    onChange={handleSelectAll}
                                    name="select-all-records"
                                    color="primary"
                                    checked={allSelected}
                                    indeterminate={!allSelected && Object.keys(recordsSelected).length > 0}
                                />
                            }
                            label={<Typography variant="caption">{'Select all'}</Typography>}
                        />
                    </Box>
                    <Box alignSelf="center">
                        <BulkUpdatesActions
                            shouldDisplay={Object.keys(recordsSelected).length > 0}
                            recordsSelected={recordsSelected}
                        />
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                {publicationsList.map((publication, index) => (
                    <Grid container spacing={0} alignContent="justify">
                        <Grid item xs={1}>
                            <Checkbox
                                onChange={handleChange(publication)}
                                color="primary"
                                checked={recordsSelected.hasOwnProperty(publication.rek_pid)}
                            />
                        </Grid>
                        <Grid item xs={11}>
                            {renderPublicationCitation(index, publication)}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

PublicationsList.propTypes = {
    publicationsList: PropTypes.array,
    publicationsListSubset: PropTypes.array,
    subsetCustomActions: PropTypes.array,
    customActions: PropTypes.array,
    showAdminActions: PropTypes.bool,
    showDefaultActions: PropTypes.bool,
    showSources: PropTypes.bool,
    showMetrics: PropTypes.bool,
    showSourceCountIcon: PropTypes.bool,
    showUnpublishedBufferFields: PropTypes.bool,
    hideCountDiff: PropTypes.bool,
    hideCountTotal: PropTypes.bool,
    publicationsLoading: PropTypes.bool,
};

PublicationsList.defaultProps = {
    publicationsListSubset: [],
    subsetCustomActions: [],
    showAdminActions: false,
    showSources: false,
    showDefaultActions: false,
    showSourceCountIcon: false,
    showMetrics: false,
    showUnpublishedBufferFields: false,
    hideCountDiff: false,
};

export default React.memo(PublicationsList);
