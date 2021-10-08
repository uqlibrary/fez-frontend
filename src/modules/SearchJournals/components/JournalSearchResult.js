import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
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
import { pathConfig } from '../../../config';
import { useJournalSearchQueryParams, useSelectedJournals } from '../hooks';
import { useHistory } from 'react-router';
import { JournalsCommonButtons } from '../../SharedComponents/JournalsCommonButtons';
import { FAQ } from './partials/FAQ';

export const JournalSearchResult = ({ onSearch }) => {
    const history = useHistory();
    const txt = locale.components.journalSearch;
    const { journalSearchQueryParams } = useJournalSearchQueryParams();
    const journalsListLoading = useSelector(state => state.get('searchJournalsReducer').journalsListLoading);
    const journalsList = useSelector(state => state.get('searchJournalsReducer').journalsList);
    const journalsListLoaded = useSelector(state => state.get('searchJournalsReducer').journalsListLoaded);
    const journalsListError = useSelector(state => state.get('searchJournalsReducer').journalsListError);

    const updateSemaphore = React.useRef(false);

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
            sort: sortBy,
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

    if (!journalsListLoaded) {
        return <div />;
    }

    if (!journalsList || (!!journalsList && journalsList.length === 0)) {
        return 'No journals found';
    }
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
                                pagingData={{ total: 5 }}
                                sortBy="created_date"
                                sortDirection="Desc"
                                onSortByChanged={sortByChanged}
                                onPageSizeChanged={pageSizeChanged}
                                pageSize={10}
                            />
                        </Grid>
                        {journalsList.length > 20 && (
                            <Grid item xs={12}>
                                <PublicationsListPaging
                                    pagingData={{ from: 1, to: 20, total: 100, per_page: 10, current_page: 1 }}
                                    onPageChanged={pageChanged}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <JournalsList journals={journalsList.data} onChange={handleSelectedJournalsChange} />
                        </Grid>
                        {journalsList.length > 20 && (
                            <Grid item xs={12}>
                                <PublicationsListPaging
                                    pagingData={{ from: 1, to: 20, total: 100, per_page: 20, current_page: 1 }}
                                    onPageChanged={pageChanged}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Grid style={{ paddingTop: 20 }} item xs={12}>
                        <Grid container spacing={2} justify="flex-end">
                            <JournalsCommonButtons />
                            <Grid item xs={12} sm="auto">
                                <Button
                                    disabled={countSelectedJournals() < 2}
                                    onClick={handleJournalsComparisonClick}
                                    variant="contained"
                                    children={txt.journalSearchInterface.buttons.compareJournals.title}
                                    aria-label={txt.journalSearchInterface.buttons.compareJournals.aria}
                                    color="primary"
                                    id="journal-compare-button"
                                    data-testid="journal-compare-button"
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
