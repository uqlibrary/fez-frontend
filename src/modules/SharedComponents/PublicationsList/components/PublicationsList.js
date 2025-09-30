import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { useRecordsSelector } from 'hooks';
import BulkUpdatesActions from './BulkUpdatesActions';
import locale from 'locale/components';

const StyledBulkActionContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        paddingLeft: `${theme.spacing(2)} !important`,
        marginBottom: theme.spacing(2),
    },
}));

export const PublicationsList = ({
    publicationsList,
    publicationsListSubset = [],
    subsetCustomActions = [],
    customActions,
    showAdminActions = false,
    showDefaultActions = false,
    showSources = false,
    showMetrics = false,
    showSourceCountIcon = false,
    showUnpublishedBufferFields = false,
    hideCountDiff = false,
    hideCountTotal,
    publicationsLoading,
    showImageThumbnails = false,
    security = { isAdmin: false, isAuthor: false },
}) => {
    const { shouldRenderRecordsSelectors, recordsSelected, allSelected, handleClick, handleSelectAll } =
        useRecordsSelector();

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
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <FormControlLabel
                        sx={{ alignItems: 'center', margin: 0 }}
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
            <StyledBulkActionContainer
                item
                xs={12}
                sm
                sx={{ display: Object.keys(recordsSelected).length > 0 ? '' : 'none' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <BulkUpdatesActions
                        shouldDisplay={Object.keys(recordsSelected).length > 0}
                        recordsSelected={recordsSelected}
                    />
                </Box>
            </StyledBulkActionContainer>
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

export default React.memo(PublicationsList);
