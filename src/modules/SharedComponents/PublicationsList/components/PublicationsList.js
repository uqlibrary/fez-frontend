/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { useRecordsSelector } from 'hooks';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { makeStyles } from '@mui/styles';

import BulkUpdatesActions from './BulkUpdatesActions';
import locale from 'locale/components';

const useStyles = makeStyles(theme => ({
    root: {
        alignItems: 'center',
        margin: 0,
    },
    bulkActionContainer: {
        [theme.breakpoints.down('sm')]: {
            paddingLeft: `${theme.spacing(2)} !important`,
            marginBottom: theme.spacing(2),
        },
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
    showImageThumbnails,
    security,
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
                showImageThumbnails={showImageThumbnails}
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
                security={security}
            />
        );
    };
    const publications = publicationsList.map((publication, index) => {
        return renderPublicationCitation(index, publication);
    });

    if (!shouldRenderRecordsSelectors) {
        return (
            <Box id="search-results-publications-list" data-testid="search-results-publications-list">
                {publications}
            </Box>
        );
    }

    const handleChange = publication => event => handleClick(publication, event.target.checked);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm>
                <Box display="flex" alignItems="center" height="100%">
                    <FormControlLabel
                        classes={{
                            root: classes.root,
                        }}
                        control={
                            <Checkbox
                                inputProps={{
                                    'data-testid': 'select-all-publications-input',
                                    id: 'select-all-publications-input',
                                }}
                                onChange={handleSelectAll}
                                name="select-all-publications"
                                checked={allSelected}
                                indeterminate={!allSelected && Object.keys(recordsSelected).length > 0}
                            />
                        }
                        label={
                            <Typography variant="caption">
                                {locale.components.publicationsList.selectAllText}
                            </Typography>
                        }
                    />
                </Box>
            </Grid>
            <Grid
                item
                xs={12}
                sm
                className={classes.bulkActionContainer}
                style={{ display: Object.keys(recordsSelected).length > 0 ? '' : 'none' }}
            >
                <Box display="flex" alignItems="center" height="100%">
                    <BulkUpdatesActions
                        shouldDisplay={Object.keys(recordsSelected).length > 0}
                        recordsSelected={recordsSelected}
                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                {publicationsList.map((publication, index) => (
                    <Grid container spacing={0} alignItems="flex-start" key={`publication-${index}`}>
                        <Grid item xs={2} sm={1}>
                            <Checkbox
                                inputProps={{
                                    'data-analyticsid': `select-publication-${index}-input`,
                                    'data-testid': `select-publication-${index}-input`,
                                    id: `select-publication-${index}-input`,
                                }}
                                name={`select-publication-${index}-input`}
                                onChange={handleChange(publication)}
                                checked={recordsSelected.hasOwnProperty(publication.rek_pid)}
                            />
                        </Grid>
                        <Grid item xs={10} sm={11}>
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
    showImageThumbnails: PropTypes.bool,
    security: PropTypes.object,
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
    security: { isAdmin: false, isAuthor: false },
    showImageThumbnails: false,
};

export default React.memo(PublicationsList);
