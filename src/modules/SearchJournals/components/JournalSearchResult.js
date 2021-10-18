import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PublicationsListPaging, PublicationsListSorting } from 'modules/SharedComponents/PublicationsList';

import { JournalsList } from 'modules/SharedComponents/JournalsList';
import locale from 'locale/components';
import JournalSearchFacetsFilter from './JournalSearchFacetsFilter';
import { pathConfig } from 'config/pathConfig';
import { useJournalSearchQueryParams, useSelectedJournals } from '../hooks';
import { useHistory } from 'react-router';
import { FAQ } from './partials/FAQ';
import { CommonButtons } from 'modules/SharedComponents/JournalsCommonButtons';
import { exportJournals } from 'actions/journals';

export const JournalSearchResult = ({ onSearch }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const txt = locale.components.journalSearch;
    const { journalSearchQueryParams } = useJournalSearchQueryParams();
    const journalsListLoading = useSelector(state => state.get('searchJournalsReducer').journalsListLoading);
    const journalsList = useSelector(state => state.get('searchJournalsReducer').journalsList);
    const journalsListLoaded = useSelector(state => state.get('searchJournalsReducer').journalsListLoaded);
    const journalsListError = useSelector(state => state.get('searchJournalsReducer').journalsListError);

    const updateSemaphore = React.useRef(false);

    const handleExport = exportFormat => {
        dispatch(
            exportJournals({
                ...journalSearchQueryParams,
                ...exportFormat,
            }),
        );
    };

    const pageSizeChanged = pageSize => {
        updateSemaphore.current = true;
        onSearch({
            ...journalSearchQueryParams,
            pageSize: pageSize,
            page: 1,
        });
    };

    const pageChanged = page => {
        updateSemaphore.current = true;
        onSearch({
            ...journalSearchQueryParams,
            page: page,
        });
    };

    const sortByChanged = (sortBy, sortDirection) => {
        updateSemaphore.current = true;
        onSearch({
            ...journalSearchQueryParams,
            sortBy: sortBy,
            sortDirection: sortDirection,
        });
    };

    const facetsChanged = activeFacets => {
        updateSemaphore.current = true;
        onSearch({
            ...journalSearchQueryParams,
            activeFacets: { ...activeFacets },
            page: 1,
        });
    };

    const { selectedJournals, handleSelectedJournalsChange, countSelectedJournals } = useSelectedJournals();
    const handleJournalsComparisonClick = () =>
        history.push({
            pathname: pathConfig.journals.compare,
            state: { journals: journalsList.data?.filter(journal => journal && selectedJournals[journal.jnl_jid]) },
        });

    if (
        !journalsListLoaded ||
        !journalSearchQueryParams.keywords ||
        Object.values(journalSearchQueryParams.keywords).length === 0
    ) {
        return <div />;
    }

    if (!journalsList || (!!journalsList && journalsList.data.length === 0)) {
        return 'No journals found';
    }

    const pagingData = {
        from: journalsList.from,
        to: journalsList.to,
        total: journalsList.total,
        per_page: journalsList.per_page,
        current_page: journalsList.current_page,
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs sm md={9}>
                <StandardCard noHeader>
                    <Grid container spacing={2}>
                        {!!journalsListLoading && (
                            <Grid item xs={12}>
                                <InlineLoader message={txt.journalSearchResult.loadingMessage} />
                            </Grid>
                        )}
                        {!!journalsListError && (
                            <Grid item xs={12}>
                                <Alert {...journalsListError} />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <PublicationsListSorting
                                canUseExport
                                exportData={txt.export}
                                pagingData={pagingData}
                                sortingData={txt.sorting}
                                sortBy={(journalSearchQueryParams && journalSearchQueryParams.sortBy) || 'score'}
                                sortDirection={
                                    (journalSearchQueryParams && journalSearchQueryParams.sortDirection) || 'Desc'
                                }
                                onExportPublications={handleExport}
                                onSortByChanged={sortByChanged}
                                onPageSizeChanged={pageSizeChanged}
                                pageSize={pagingData.per_page}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <PublicationsListPaging
                                disabled={!journalsListLoaded}
                                loading={!journalsListLoaded}
                                pagingData={pagingData}
                                onPageChanged={pageChanged}
                                pagingId="search-journals-paging-top"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <JournalsList journals={journalsList.data} onChange={handleSelectedJournalsChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <PublicationsListPaging
                                pagingData={pagingData}
                                onPageChanged={pageChanged}
                                pagingId="search-journals-paging-bottom"
                            />
                        </Grid>
                    </Grid>
                    <Grid style={{ paddingTop: 20 }} item xs={12}>
                        <Grid container spacing={2} justify="flex-end">
                            <CommonButtons />
                            <Grid item xs={12} sm="auto">
                                <Button
                                    disabled={countSelectedJournals() < 2}
                                    onClick={handleJournalsComparisonClick}
                                    variant="contained"
                                    children={txt.journalSearchInterface.buttons.compareJournals.title}
                                    aria-label={txt.journalSearchInterface.buttons.compareJournals.aria}
                                    color="primary"
                                    id="journal-comparison-button"
                                    data-testid="journal-comparison-button"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
            <Hidden smDown>
                <Grid item md={3}>
                    <JournalSearchFacetsFilter
                        key={'journal-search-facets-filter'}
                        activeFacets={journalSearchQueryParams.activeFacets}
                        facetsData={journalsList.filters.facets}
                        onFacetsChanged={facetsChanged}
                        disabled={!journalsListLoaded}
                    />
                    <FAQ />
                </Grid>
            </Hidden>
        </Grid>
    );
};

JournalSearchResult.propTypes = {
    onSearch: PropTypes.func,
};

export default React.memo(JournalSearchResult);
