import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import * as actions from 'actions';

// forms & custom components
import {
    FacetsFilter,
    PublicationsList,
    PublicationsListPaging,
    PublicationsListSorting,
} from 'modules/SharedComponents/PublicationsList';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { pathConfig } from 'config/pathConfig';
import { locale } from 'locale';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createConfirmDialogBoxRefAssigner } from '../../SharedComponents/Toolbox/ConfirmDialogBox/components/ConfirmDialogBox';
import { FezRecord } from '../../../@types/models/FezRecord';
import { AppState } from '../../../reducer';

interface ComponentState {
    page: number;
    pageSize: number;
    sortBy: string;
    sortDirection: string;
    activeFacets: {
        filters: Record<string, string>;
        ranges: Record<string, string>;
    };
    hasPublications: boolean;
    publicationToHide: FezRecord | null;
}

const PossiblyMyRecords: React.FC = () => {
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const location = useLocation();
    const dispatch = useDispatch();
    const confirmDialogBoxRef = useRef<{ showConfirmation: () => void } | null>(null);

    // istanbul ignore next
    const accountLoading = useSelector((state: AppState) => state?.get('accountReducer').accountLoading || false);
    // istanbul ignore next
    const {
        possibleCounts = 0,
        hidePublicationFailed = false,
        hidePublicationFailedErrorMessage = '',
        loadingPossibleCounts = false,
        loadingPossiblePublicationsList = false,
        possiblePublicationsList = [],
        possiblePublicationsFacets = {},
        possiblePublicationsPagingData = {},
        publicationsClaimedInProgress = [],
    } = useSelector((state: AppState) => state?.get('claimPublicationReducer') || {});

    // initial state
    const initialState: ComponentState = {
        page: 1,
        pageSize: 20,
        sortBy: locale.components.sorting.sortBy[1].value,
        sortDirection: locale.components.sorting.sortDirection[0],
        activeFacets: {
            filters: {},
            ranges: {},
        },
        // check if user has publications, once true always true
        // facets filtering might return no results, but facets should still be visible
        hasPublications: !loadingPossiblePublicationsList && possiblePublicationsList.length > 0,
        publicationToHide: null,
    };
    // component state
    const [state, setState] = useState<ComponentState>(() => ({
        ...initialState,
        ...(location?.state || {}),
    }));

    const [prevLocation, setPrevLocation] = useState(location);
    const [shouldNavigate, setShouldNavigate] = useState(false);

    // handle navigation after state updates
    useEffect(() => {
        if (shouldNavigate) {
            navigate(`${pathConfig.records.possible}?ts=${Date.now()}`, {
                state: { ...state, prevProps: {} },
            });
            dispatch(actions.searchPossiblyYourPublications(state));
            setShouldNavigate(false);
        }
    }, [state, shouldNavigate, navigate, dispatch]);

    // handle browser back button navigation
    useEffect(() => {
        if (
            prevLocation !== location &&
            navigationType === 'POP' &&
            location.pathname === pathConfig.records.possible
        ) {
            // istanbul ignore next
            const newState = location.state ? { ...location.state } : { ...initialState };
            setState(prevState => ({
                ...prevState,
                ...newState,
            }));
            dispatch(actions.searchPossiblyYourPublications(newState));
        }
        setPrevLocation(location);
    }, [location, dispatch, navigationType]);

    // set forever-true flag if user has publications
    useEffect(() => {
        if (
            !state.hasPublications &&
            !loadingPossiblePublicationsList &&
            possiblePublicationsList &&
            possiblePublicationsList.length > 0
        ) {
            setState(prevState => ({ ...prevState, hasPublications: true }));
        }
    }, [state.hasPublications, loadingPossiblePublicationsList, possiblePublicationsList]);

    // load data on mount
    useEffect(() => {
        if (!accountLoading) {
            dispatch(actions.searchPossiblyYourPublications(state));
        }
    }, [accountLoading, dispatch]);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(actions.hideRecordErrorReset());
        };
    }, [dispatch]);

    if (accountLoading) return null;

    const hidePublication = (): void => {
        // istanbul ignore next
        if (!state.publicationToHide) {
            return;
        }

        dispatch(
            actions.hideRecord({
                record: state.publicationToHide,
                facets: state.activeFacets,
            }),
        );
        setState(prevState => ({ ...prevState, publicationToHide: null }));
    };

    const confirmHidePublication = (item: FezRecord): void => {
        setState(prevState => ({ ...prevState, publicationToHide: item }));
        confirmDialogBoxRef.current?.showConfirmation();
    };

    const claimPublication = (item: FezRecord): void => {
        dispatch(actions.setClaimPublication(item));
        navigate(pathConfig.records.claim);
    };

    const facetsChanged = (activeFacets: ComponentState['activeFacets']): void => {
        setState(prevState => ({
            ...prevState,
            activeFacets,
            page: 1,
        }));
        setShouldNavigate(true);
    };

    const sortByChanged = (sortBy: string, sortDirection: string): void => {
        setState(prevState => ({
            ...prevState,
            sortBy,
            sortDirection,
        }));
        setShouldNavigate(true);
    };

    const pageSizeChanged = (pageSize: number): void => {
        setState(prevState => ({
            ...prevState,
            pageSize,
            page: 1,
        }));
        setShouldNavigate(true);
    };

    const pageChanged = (page: number): void => {
        setState(prevState => ({
            ...prevState,
            page,
        }));
        setShouldNavigate(true);
    };

    const getAlert = (
        alertLocale: { alertId: string; title: string; message: (s: string) => string; type: string },
        hasFailed: boolean,
        error: string,
    ): React.ReactNode => {
        return hasFailed ? (
            <Alert
                {...{
                    ...alertLocale,
                    message: alertLocale.message(error),
                }}
            />
        ) : null;
    };

    const totalPossiblePubs = possibleCounts;
    const pagingData = possiblePublicationsPagingData;
    const txt = locale.pages.claimPublications;
    const inProgress = [
        {
            label: txt.searchResults.inProgress,
            disabled: true,
            primary: false,
        },
    ];
    const actionsList = [
        {
            label: txt.searchResults.claim,
            handleAction: claimPublication,
            primary: true,
        },
        {
            label: txt.searchResults.hide,
            handleAction: confirmHidePublication,
        },
    ];

    return (
        <StandardPage title={txt.title}>
            {getAlert(txt.hidePublicationFailedAlert, hidePublicationFailed, hidePublicationFailedErrorMessage)}

            {
                // first time loading my possible publications - account hasn't
                // been loaded or any my publications haven't been loaded
                !state.hasPublications && (loadingPossiblePublicationsList || loadingPossibleCounts) && (
                    <Grid container>
                        <Grid item xs />
                        <Grid item>
                            <InlineLoader message={txt.loadingMessage} />
                        </Grid>
                        <Grid item xs />
                    </Grid>
                )
            }
            {possiblePublicationsList.length > 0 && (
                <ConfirmDialogBox
                    onRef={createConfirmDialogBoxRefAssigner(confirmDialogBoxRef)}
                    onAction={hidePublication}
                    locale={txt.hidePublicationConfirmation}
                />
            )}
            <Grid container spacing={3}>
                {
                    // no results to display
                    !loadingPossibleCounts &&
                        !loadingPossiblePublicationsList &&
                        possiblePublicationsList.length === 0 && (
                            <Grid item xs={12}>
                                <StandardCard {...txt.noResultsFound}>{txt.noResultsFound.text}</StandardCard>
                            </Grid>
                        )
                }
                {
                    // results to display or loading if user is filtering/paging
                    state.hasPublications &&
                        (loadingPossiblePublicationsList || possiblePublicationsList.length > 0) && (
                            <Grid item xs={12} md={9}>
                                <StandardCard noHeader>
                                    {loadingPossiblePublicationsList && (
                                        <Grid container>
                                            <Grid item xs />
                                            <Grid item>
                                                <InlineLoader message={txt.loadingMessage} />
                                            </Grid>
                                            <Grid item xs />
                                        </Grid>
                                    )}
                                    {!loadingPossiblePublicationsList && possiblePublicationsList.length > 0 && (
                                        <>
                                            <Grid item xs>
                                                <Typography>
                                                    {txt.searchResults.text
                                                        .replace('[resultsCount]', possiblePublicationsList.length)
                                                        .replace('[totalCount]', totalPossiblePubs)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs style={{ marginTop: 16 }}>
                                                {totalPossiblePubs > initialState.pageSize && (
                                                    <>
                                                        <Grid item xs>
                                                            <PublicationsListSorting
                                                                sortBy={state.sortBy}
                                                                sortDirection={state.sortDirection}
                                                                pageSize={state.pageSize}
                                                                pagingData={pagingData}
                                                                onSortByChanged={sortByChanged}
                                                                onPageSizeChanged={pageSizeChanged}
                                                                disabled={loadingPossiblePublicationsList}
                                                                canUseExport={false}
                                                            />
                                                        </Grid>
                                                        <Grid item xs>
                                                            <PublicationsListPaging
                                                                loading={loadingPossiblePublicationsList}
                                                                pagingData={pagingData}
                                                                onPageChanged={pageChanged}
                                                                disabled={loadingPossiblePublicationsList}
                                                                pagingId="possibly-my-records-paging-top"
                                                            />
                                                        </Grid>
                                                    </>
                                                )}
                                                <Grid item xs>
                                                    <PublicationsList
                                                        publicationsLoading={
                                                            loadingPossiblePublicationsList || loadingPossibleCounts
                                                        }
                                                        publicationsList={possiblePublicationsList}
                                                        publicationsListSubset={publicationsClaimedInProgress}
                                                        subsetCustomActions={inProgress}
                                                        customActions={actionsList}
                                                    />
                                                </Grid>
                                                {totalPossiblePubs > initialState.pageSize && (
                                                    <Grid item xs>
                                                        <PublicationsListPaging
                                                            loading={loadingPossiblePublicationsList}
                                                            pagingData={pagingData}
                                                            onPageChanged={pageChanged}
                                                            disabled={loadingPossiblePublicationsList}
                                                            pagingId="possibly-my-records-paging-bottom"
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </>
                                    )}
                                </StandardCard>
                            </Grid>
                        )
                }
                {
                    // show available filters or selected filters
                    ((possiblePublicationsFacets && Object.keys(possiblePublicationsFacets).length > 0) ||
                        (state.activeFacets?.filters && Object.keys(state.activeFacets.filters).length > 0) ||
                        (state.activeFacets?.ranges && Object.keys(state.activeFacets.ranges).length > 0)) && (
                        <Grid item sm={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <StandardRighthandCard title={txt.facetsFilter.title}>
                                <FacetsFilter
                                    facetsData={possiblePublicationsFacets}
                                    onFacetsChanged={facetsChanged}
                                    activeFacets={state.activeFacets}
                                    disabled={loadingPossiblePublicationsList}
                                    excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                    renameFacetsList={txt.facetsFilter.renameFacetsList}
                                    lookupFacetsList={txt.facetsFilter.lookupFacetsList}
                                />
                            </StandardRighthandCard>
                        </Grid>
                    )
                }
            </Grid>
        </StandardPage>
    );
};

export default PossiblyMyRecords;
