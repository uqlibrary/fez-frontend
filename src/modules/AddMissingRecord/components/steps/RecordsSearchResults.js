import React, { Suspense } from 'react';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const PublicationsList = React.lazy(() =>
    import('modules/SharedComponents/PublicationsList/components/PublicationsList'),
);
/* istanbul ignore next */
const PublicationListLoadingProgress = React.lazy(() =>
    import('modules/SharedComponents/PublicationsList/components/LoadingProgress/PublicationListLoadingProgress'),
);

import { pathConfig } from 'config/pathConfig';
import locale from 'locale/pages';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setClaimPublication, setRedirectPath } from '../../../../actions';

export const RecordsSearchResults = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loadingPublicationSources, publicationsList, searchLoading, rawSearchQuery } = useSelector(state =>
        state.get('searchRecordsReducer'),
    );

    const autoFocus = element => {
        publicationsList.length === 0 && element?.focus();
    };

    const _showNewRecordForm = () => {
        navigate(pathConfig.records.add.new);
    };

    const _cancelWorkflow = () => {
        navigate(pathConfig.records.add.find);
    };

    const _claimPublication = item => {
        dispatch(setClaimPublication(item));
        dispatch(setRedirectPath(pathConfig.records.add.find));
        navigate(pathConfig.records.claim);
    };

    const getUnclaimablePublicationsList = publicationsList => {
        return publicationsList
            .filter(item => {
                if (
                    // If the item doesnt have a pid
                    !item.rek_pid ||
                    // If not all of the authors have been assigned by count
                    (item.fez_record_search_key_author_id || []).length !==
                        (item.fez_record_search_key_author || []).length ||
                    // If the item has had contributors assigned, but have unclaimed/unassigned ie. id = 0 or null
                    ((item.fez_record_search_key_contributor_id || []).length > 0 &&
                        item.fez_record_search_key_contributor_id.reduce(
                            (total, item) => total || item.rek_contributor_id === 0 || item.rek_contributor_id === null,
                            false,
                        )) ||
                    // If the item has had authors assigned, but have unclaimed/unassigned ie. id = 0 or null
                    ((item.fez_record_search_key_author_id || []).length > 0 &&
                        item.fez_record_search_key_author_id.reduce(
                            (total, item) => total || item.rek_author_id === 0 || item.rek_author_id === null,
                            false,
                        )) ||
                    // If there are no authors, and not all of the contributors have been assigned by count
                    // Edge case for edited book, where there were no authors but had contributors
                    ((item.fez_record_search_key_author || []).length === 0 &&
                        (item.fez_record_search_key_contributor_id || []).length !==
                            (item.fez_record_search_key_contributor || []).length)
                ) {
                    return false;
                }

                return true;
            })
            .map(item => item.rek_pid);
    };

    const searchResultsTxt = locale.pages.addRecord.step2;
    const _actions = [
        {
            label: searchResultsTxt.claim,
            handleAction: _claimPublication,
            primary: true,
            disabled: searchLoading,
        },
    ];

    const unclaimablePublicationsList = getUnclaimablePublicationsList(publicationsList);
    const unclaimable = [
        {
            label: searchResultsTxt.unclaimable,
            disabled: true,
            primary: false,
        },
    ];

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <PublicationListLoadingProgress mobile loadingPublicationSources={loadingPublicationSources} />
                    </Suspense>
                </Grid>
                <Grid item xs sm={8} md={9}>
                    {searchLoading && <InlineLoader message={searchResultsTxt.loadingMessage} />}
                    {publicationsList.length > 0 && (
                        <Grid item sm={12}>
                            <StandardCard {...searchResultsTxt.searchResults}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        {searchResultsTxt.searchResults.resultsText
                                            .replace('[noOfResults]', publicationsList.length)
                                            .replace('[searchQuery]', rawSearchQuery)}
                                        {searchResultsTxt.searchResults.text}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PublicationsList
                                            publicationsLoading={searchLoading}
                                            publicationsList={publicationsList}
                                            customActions={_actions}
                                            publicationsListSubset={unclaimablePublicationsList}
                                            subsetCustomActions={unclaimable}
                                            showSources
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    )}
                    {!searchLoading && publicationsList.length === 0 && (
                        <Grid item sm={12}>
                            <StandardCard {...searchResultsTxt.noResultsFound}>
                                {searchResultsTxt.noResultsFound.text}
                            </StandardCard>
                        </Grid>
                    )}
                    {!searchLoading && (
                        <Grid item sm={12}>
                            <Grid container spacing={2} style={{ marginTop: 12 }}>
                                <Grid item xs />
                                <Grid item xs={12} md="auto">
                                    <Button
                                        fullWidth
                                        // variant={'contained'}
                                        onClick={_cancelWorkflow}
                                    >
                                        {searchResultsTxt.cancel}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md="auto">
                                    <Button
                                        fullWidth
                                        variant={'contained'}
                                        color="primary"
                                        onClick={_showNewRecordForm}
                                        ref={autoFocus}
                                    >
                                        {searchResultsTxt.submit}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Grid item sm={4} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <StandardRighthandCard title={searchResultsTxt.searchResults.searchDashboard.title}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <PublicationListLoadingProgress loadingPublicationSources={loadingPublicationSources} />
                        </Suspense>
                    </StandardRighthandCard>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default React.memo(RecordsSearchResults);
