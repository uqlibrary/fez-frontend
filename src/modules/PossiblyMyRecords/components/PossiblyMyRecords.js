import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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

export default class PossiblyMyRecords extends PureComponent {
    static propTypes = {
        possiblePublicationsList: PropTypes.array,
        publicationsClaimedInProgress: PropTypes.array,
        loadingPossiblePublicationsList: PropTypes.bool,
        possiblePublicationsFacets: PropTypes.object,
        possiblePublicationsPagingData: PropTypes.object,

        accountLoading: PropTypes.bool,
        canUseExport: PropTypes.bool,

        possibleCounts: PropTypes.number,
        loadingPossibleCounts: PropTypes.bool,

        location: PropTypes.object.isRequired,
        navigate: PropTypes.func.isRequired,
        navigationType: PropTypes.string,
        actions: PropTypes.object,

        hidePublicationFailed: PropTypes.bool,
        hidePublicationFailedErrorMessage: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.initState = {
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[1].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            activeFacets: {
                filters: {},
                ranges: {},
            },
        };
        this.state = {
            initState: { ...this.initState },
            // check if user has publications, once true always true
            // facets filtering might return no results, but facets should still be visible
            hasPublications: !props.loadingPossiblePublicationsList && props.possiblePublicationsList.length > 0,
            publicationToHide: null,
            ...(!!props.location.state ? props.location.state : this.initState),
        };
    }

    static getDerivedStateFromProps(props, state) {
        // handle browser back button - set state from location/dispatch action for this state
        if (
            state.prevProps?.location !== props.location &&
            props.navigationType === 'POP' &&
            props.location.pathname === pathConfig.records.possible
        ) {
            props.actions.searchPossiblyYourPublications({ ...state });
            return {
                ...(!!props.location.state ? props.location.state : state.initState),
                prevProps: { ...props },
            };
        }
        // set forever-true flag if user has publications
        /* istanbul ignore next */
        if (
            !state.hasPublications &&
            !props.loadingPossiblePublicationsList &&
            !!props.possiblePublicationsList &&
            props.possiblePublicationsList.length > 0
        ) {
            return { hasPublications: true, prevProps: { ...props } };
        }

        return null;
    }

    componentDidMount() {
        if (!this.props.accountLoading) {
            this.props.actions.searchPossiblyYourPublications({ ...this.state });
        }
    }

    componentWillUnmount() {
        this.props.actions.hideRecordErrorReset();
    }

    navigateTo = () => {
        this.props.navigate(`${pathConfig.records.possible}`, {
            search: `?ts=${Date.now()}`,
            state: { ...this.state, prevProps: {} },
        });
        this.props.actions.searchPossiblyYourPublications({ ...this.state });
    };

    _hidePublication = () => {
        /* istanbul ignore else */
        if (this.state.publicationToHide) {
            this.props.actions.hideRecord({
                record: this.state.publicationToHide,
                facets: this.state.activeFacets,
            });
            this.setState({ publicationToHide: null });
        }
    };

    _confirmHidePublication = item => {
        // temporary keep which publication to hide in the state
        this.setState({ publicationToHide: item });
        this.hideConfirmationBox.showConfirmation();
    };

    _claimPublication = item => {
        this.props.actions.setClaimPublication(item);
        this.props.navigate(pathConfig.records.claim);
    };

    _facetsChanged = activeFacets => {
        this.setState(
            {
                activeFacets: activeFacets,
                page: 1,
            },
            this.navigateTo,
        );
    };

    sortByChanged = (sortBy, sortDirection) => {
        this.setState(
            {
                sortBy: sortBy,
                sortDirection: sortDirection,
            },
            this.navigateTo,
        );
    };

    pageSizeChanged = pageSize => {
        this.setState(
            {
                pageSize: pageSize,
                page: 1,
            },
            this.navigateTo,
        );
    };

    _setHideConfirmationBox = ref => (this.hideConfirmationBox = ref);

    getAlert = (alertLocale, hasFailed = false, error = '') => {
        return hasFailed ? (
            <Alert
                {...{
                    ...alertLocale,
                    message: alertLocale.message(error),
                }}
            />
        ) : null;
    };

    pageChanged = page => {
        this.setState(
            {
                page: page,
            },
            this.navigateTo,
        );
    };

    render() {
        if (this.props.accountLoading) return null;
        const totalPossiblePubs = this.props.possibleCounts;
        const pagingData = this.props.possiblePublicationsPagingData;
        const txt = locale.pages.claimPublications;
        const inProgress = [
            {
                label: txt.searchResults.inProgress,
                disabled: true,
                primary: false,
            },
        ];

        const actions = [
            {
                label: txt.searchResults.claim,
                handleAction: this._claimPublication,
                primary: true,
            },
            {
                label: txt.searchResults.hide,
                handleAction: this._confirmHidePublication,
            },
        ];

        return (
            <StandardPage title={txt.title}>
                {this.getAlert(
                    txt.hidePublicationFailedAlert,
                    this.props.hidePublicationFailed,
                    this.props.hidePublicationFailedErrorMessage,
                )}

                {// first time loading my possible publications - account hasn't
                // been loaded or any my publications haven't been loaded
                !this.state.hasPublications &&
                    (this.props.loadingPossiblePublicationsList || this.props.loadingPossibleCounts) && (
                        <Grid container>
                            <Grid item xs />
                            <Grid item>
                                <InlineLoader message={txt.loadingMessage} />
                            </Grid>
                            <Grid item xs />
                        </Grid>
                    )}
                {this.props.possiblePublicationsList.length > 0 && (
                    <ConfirmDialogBox
                        onRef={this._setHideConfirmationBox}
                        onAction={this._hidePublication}
                        locale={txt.hidePublicationConfirmation}
                    />
                )}
                <Grid container spacing={3}>
                    {// no results to display
                    !this.props.loadingPossibleCounts &&
                        !this.props.loadingPossiblePublicationsList &&
                        this.props.possiblePublicationsList.length === 0 && (
                            <Grid item xs={12}>
                                <StandardCard {...txt.noResultsFound}>{txt.noResultsFound.text}</StandardCard>
                            </Grid>
                        )}
                    {// results to display or loading if user is filtering/paging
                    this.state.hasPublications &&
                        (this.props.loadingPossiblePublicationsList ||
                            this.props.possiblePublicationsList.length > 0) && (
                            <Grid item xs={12} md={9}>
                                <StandardCard noHeader>
                                    {/* istanbul ignore next */
                                    this.props.loadingPossiblePublicationsList && (
                                        <Grid container>
                                            <Grid item xs />
                                            <Grid item>
                                                <InlineLoader message={txt.loadingMessage} />
                                            </Grid>
                                            <Grid item xs />
                                        </Grid>
                                    )}
                                    {!this.props.loadingPossiblePublicationsList &&
                                        this.props.possiblePublicationsList.length > 0 && (
                                            <React.Fragment>
                                                <Grid item xs>
                                                    <Typography>
                                                        {txt.searchResults.text
                                                            .replace(
                                                                '[resultsCount]',
                                                                this.props.possiblePublicationsList.length,
                                                            )
                                                            .replace('[totalCount]', totalPossiblePubs)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs style={{ marginTop: 16 }}>
                                                    {totalPossiblePubs > this.initState.pageSize && (
                                                        <React.Fragment>
                                                            <Grid item xs>
                                                                <PublicationsListSorting
                                                                    sortBy={this.state.sortBy}
                                                                    sortDirection={this.state.sortDirection}
                                                                    pageSize={this.state.pageSize}
                                                                    pagingData={pagingData}
                                                                    onSortByChanged={this.sortByChanged}
                                                                    onPageSizeChanged={this.pageSizeChanged}
                                                                    disabled={
                                                                        this.props.loadingPossiblePublicationsList
                                                                    }
                                                                    canUseExport={false}
                                                                />
                                                            </Grid>
                                                            <Grid item xs>
                                                                <PublicationsListPaging
                                                                    loading={this.props.loadingPossiblePublicationsList}
                                                                    pagingData={pagingData}
                                                                    onPageChanged={this.pageChanged}
                                                                    disabled={
                                                                        this.props.loadingPossiblePublicationsList
                                                                    }
                                                                    pagingId="possibly-my-records-paging-top"
                                                                />
                                                            </Grid>
                                                        </React.Fragment>
                                                    )}
                                                    <Grid item xs>
                                                        <PublicationsList
                                                            publicationsLoading={
                                                                this.props.loadingPossiblePublicationsList ||
                                                                this.props.loadingPossibleCounts
                                                            }
                                                            publicationsList={this.props.possiblePublicationsList}
                                                            publicationsListSubset={
                                                                this.props.publicationsClaimedInProgress
                                                            }
                                                            subsetCustomActions={inProgress}
                                                            customActions={actions}
                                                        />
                                                    </Grid>
                                                    {totalPossiblePubs > this.initState.pageSize && (
                                                        <Grid item xs>
                                                            <PublicationsListPaging
                                                                loading={this.props.loadingPossiblePublicationsList}
                                                                pagingData={pagingData}
                                                                onPageChanged={this.pageChanged}
                                                                disabled={this.props.loadingPossiblePublicationsList}
                                                                pagingId="possibly-my-records-paging-bottom"
                                                            />
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </React.Fragment>
                                        )}
                                </StandardCard>
                            </Grid>
                        )}
                    {// show available filters or selected filters (even if there are no results)
                    ((this.props.possiblePublicationsFacets &&
                        Object.keys(this.props.possiblePublicationsFacets).length > 0) ||
                        (this.state.activeFacets &&
                            this.state.activeFacets.filters &&
                            Object.keys(this.state.activeFacets.filters).length > 0) ||
                        (this.state.activeFacets &&
                            this.state.activeFacets.ranges &&
                            Object.keys(this.state.activeFacets.ranges).length > 0)) && (
                        <Grid item sm={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                <FacetsFilter
                                    facetsData={this.props.possiblePublicationsFacets}
                                    onFacetsChanged={this._facetsChanged}
                                    activeFacets={this.state.activeFacets}
                                    disabled={this.props.loadingPossiblePublicationsList}
                                    excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                    renameFacetsList={txt.facetsFilter.renameFacetsList}
                                    lookupFacetsList={txt.facetsFilter.lookupFacetsList}
                                />
                            </StandardRighthandCard>
                        </Grid>
                    )}
                </Grid>
            </StandardPage>
        );
    }
}
