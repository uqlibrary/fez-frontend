import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardRighthandCard } from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import {
    PublicationsList,
    PublicationsListPaging,
    PublicationsListSorting,
    FacetsFilter,
} from 'modules/SharedComponents/PublicationsList';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import locale from 'locale/components';
import { MY_RECORDS_BULK_EXPORT_SIZE } from 'config/general';
import { pathConfig } from 'config';
import Grid from '@mui/material/GridLegacy';

export default class MyRecords extends PureComponent {
    static propTypes = {
        publicationsList: PropTypes.array,
        publicationsListFacets: PropTypes.object,
        loadingPublicationsList: PropTypes.bool,
        publicationsListPagingData: PropTypes.object,
        exportPublicationsLoading: PropTypes.bool,
        publicationsListCustomActions: PropTypes.array,
        authorDetails: PropTypes.object.isRequired,

        initialFacets: PropTypes.object,
        accountLoading: PropTypes.bool,
        localePages: PropTypes.object,
        thisUrl: PropTypes.string,
        canUseExport: PropTypes.bool,

        location: PropTypes.object.isRequired,
        navigate: PropTypes.func.isRequired,
        navigationType: PropTypes.string,
        actions: PropTypes.object,
        publicationsListOtherProps: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.initState = {
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[0].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            activeFacets: {
                filters: {},
                ranges: {},
                ...props.initialFacets,
            },
            bulkExportSelected: false,
            reloadPublications: false,
        };

        this.state = {
            initState: { ...this.initState },
            // check if user has publications, once true always true
            // facets filtering might return no results, but facets should still be visible
            hasPublications: !props.loadingPublicationsList && props.publicationsList.length > 0,
            ...(!!props.location.state ? props.location.state : this.initState),
            prevProps: {
                ...props,
            },
        };
    }

    static getDerivedStateFromProps(props, state) {
        // handle browser back button - set state from location/dispatch action for this state
        if (
            state.prevProps?.location !== props.location &&
            props.navigationType === 'POP' &&
            props.location.pathname === state.prevProps?.thisUrl
        ) {
            return {
                ...(!!props.location.state ? props.location.state : state.initState),
                prevProps: {
                    ...props,
                },
                reloadPublications: true,
            };
        }
        // set forever-true flag if user has publications
        /* istanbul ignore next */
        if (
            !state.hasPublications &&
            !props.loadingPublicationsList &&
            !!props.publicationsList &&
            props.publicationsList.length > 0
        ) {
            return {
                hasPublications: true,
                prevProps: {
                    ...props,
                },
            };
        }

        return null;
    }

    componentDidMount(prevProps) {
        if (prevProps?.accountLoading !== this.props?.accountLoading && !this.props?.accountLoading) {
            this.props.actions.loadAuthorPublications({ ...this.state });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.reloadPublications !== this.state.reloadPublications && !!this.state.reloadPublications) {
            this.props.actions.loadAuthorPublications({ ...this.state });
        }
    }

    pageSizeChanged = pageSize => {
        this.setState(
            {
                pageSize: pageSize,
                page: 1,
            },
            this.navigateTo,
        );
    };

    pageChanged = page => {
        this.setState(
            {
                page: page,
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

    facetsChanged = activeFacets => {
        this.setState(
            {
                activeFacets: activeFacets,
                page: 1,
            },
            this.navigateTo,
        );
    };
    /* istanbul ignore next */
    hasDisplayableFilters = activeFilters => {
        return (
            Object.keys(activeFilters).filter(
                filter => !this.props.localePages.facetsFilter.excludeFacetsList.includes(filter),
            ).length > 0
        );
    };

    navigateTo = () => {
        this.props.navigate({
            pathname: `${this.props.thisUrl}`,
            search: `?ts=${Date.now()}`,
        });
        if (this.state.pageSize === MY_RECORDS_BULK_EXPORT_SIZE) {
            this.setState({ bulkExportSelected: true });
        } else {
            this.setState({ bulkExportSelected: false });
            this.props.actions.loadAuthorPublications({ ...this.state });
        }
    };

    _setSuccessConfirmation = ref => {
        this.successConfirmationBox = ref;
    };

    handleExportPublications = exportFormat => {
        const exportResponse = this.props.actions.exportAuthorPublications({
            ...exportFormat,
            ...this.state,
            pageSize: this.state.bulkExportSelected ? MY_RECORDS_BULK_EXPORT_SIZE : this.state.pageSize,
        });

        /* istanbul ignore next */
        this.state.bulkExportSelected &&
            !!exportResponse &&
            exportResponse.then(() => {
                this.successConfirmationBox.showConfirmation();
            });

        return exportResponse;
    };

    render() {
        if (this.props.accountLoading) return null;

        const txt = this.props.localePages;
        const pagingData = this.props.publicationsListPagingData;
        const isLoadingOrExporting = this.props.loadingPublicationsList || this.props.exportPublicationsLoading;

        const actionProps =
            (this.props.publicationsListCustomActions || []).length > 0
                ? {
                      customActions: this.props.publicationsListCustomActions,
                  }
                : {
                      showDefaultActions: true,
                  };
        const isAdmin =
            this.props.authorDetails &&
            (this.props.authorDetails.is_administrator === 1 || this.props.authorDetails.is_super_administrator === 1);
        const confirmationLocale = locale.components.sorting.bulkExportConfirmation;
        return (
            <StandardPage title={txt.pageTitle}>
                <Grid container spacing={2}>
                    {
                        // first time loading my publications - account hasn't been
                        // loaded or any my publications haven't been loaded
                        !this.state.hasPublications && this.props.loadingPublicationsList && (
                            <Grid item xs={12}>
                                <InlineLoader message={txt.loadingMessage} />
                            </Grid>
                        )
                    }
                    {
                        // no results to display
                        !this.props.loadingPublicationsList &&
                            this.props.publicationsList &&
                            this.props.publicationsList.length === 0 && (
                                <Grid item xs={12} md={9}>
                                    <StandardCard {...txt.noResultsFound}>{txt.noResultsFound.text}</StandardCard>
                                </Grid>
                            )
                    }
                    {
                        // results to display or loading if user is filtering/paging
                        this.state.hasPublications &&
                            (this.props.loadingPublicationsList || this.props.publicationsList.length > 0) && (
                                <Grid item xs={12} md={9}>
                                    <StandardCard noHeader>
                                        {pagingData && pagingData.to && pagingData.from && pagingData.total && (
                                            <span>
                                                {txt.recordCount
                                                    .replace('[recordsTotal]', pagingData.total)
                                                    .replace('[recordsFrom]', pagingData.from)
                                                    .replace('[recordsTo]', pagingData.to)}
                                            </span>
                                        )}
                                        {this.state.bulkExportSelected && (
                                            <span data-testid="my-records-bulk-export-size-message">
                                                {txt.bulkExportSizeMessage.replace(
                                                    '[bulkExportSize]',
                                                    MY_RECORDS_BULK_EXPORT_SIZE,
                                                )}
                                            </span>
                                        )}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                {txt.text}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <PublicationsListSorting
                                                    initPageLength={this.initState.pageSize}
                                                    sortBy={this.state.sortBy}
                                                    sortDirection={this.state.sortDirection}
                                                    pageSize={this.state.pageSize}
                                                    pagingData={pagingData}
                                                    onSortByChanged={this.sortByChanged}
                                                    onPageSizeChanged={this.pageSizeChanged}
                                                    onExportPublications={this.handleExportPublications}
                                                    canUseExport={this.props.canUseExport}
                                                    disabled={isLoadingOrExporting}
                                                    bulkExportSize={MY_RECORDS_BULK_EXPORT_SIZE}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <PublicationsListPaging
                                                    loading={isLoadingOrExporting}
                                                    pagingData={pagingData}
                                                    onPageChanged={this.pageChanged}
                                                    disabled={isLoadingOrExporting || this.state.bulkExportSelected}
                                                    pagingId="my-records-paging-top"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ConfirmDialogBox
                                                    locale={confirmationLocale}
                                                    hideCancelButton
                                                    onRef={this._setSuccessConfirmation}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                {isLoadingOrExporting && (
                                                    <div className="is-centered">
                                                        <InlineLoader
                                                            message={
                                                                this.props.loadingPublicationsList
                                                                    ? txt.loadingPagingMessage
                                                                    : txt.exportPublicationsLoadingMessage
                                                            }
                                                        />
                                                    </div>
                                                )}
                                                {!this.props.exportPublicationsLoading &&
                                                    !this.props.loadingPublicationsList &&
                                                    this.props.publicationsList &&
                                                    this.props.publicationsList.length > 0 && (
                                                        <PublicationsList
                                                            publicationsList={this.props.publicationsList}
                                                            {...actionProps}
                                                            showAdminActions={isAdmin}
                                                            {...this.props.publicationsListOtherProps}
                                                        />
                                                    )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <PublicationsListPaging
                                                    loading={isLoadingOrExporting}
                                                    pagingData={pagingData}
                                                    onPageChanged={this.pageChanged}
                                                    disabled={isLoadingOrExporting || this.state.bulkExportSelected}
                                                    pagingId="my-records-paging-bottom"
                                                />
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                            )
                    }
                    {
                        // show available filters or selected filters (even if there are no results)
                        ((this.props.publicationsListFacets &&
                            Object.keys(this.props.publicationsListFacets).length > 0) ||
                            (this.state.activeFacets && this.hasDisplayableFilters(this.state.activeFacets.filters)) ||
                            (this.state.activeFacets &&
                                this.state.activeFacets.ranges &&
                                Object.keys(this.state.activeFacets.ranges).length > 0) ||
                            (this.state.activeFacets && !!this.state.activeFacets.showOpenAccessOnly)) && (
                            <Grid item xs={12} md={3}>
                                <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                    <FacetsFilter
                                        facetsData={this.props.publicationsListFacets}
                                        onFacetsChanged={this.facetsChanged}
                                        activeFacets={this.state.activeFacets}
                                        initialFacets={this.props.initialFacets}
                                        disabled={isLoadingOrExporting}
                                        excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                        isMyDataSetPage={this.props.location.pathname === pathConfig.dataset.mine}
                                        renameFacetsList={txt.facetsFilter.renameFacetsList}
                                        lookupFacetsList={txt.facetsFilter.lookupFacetsList}
                                        showOpenAccessFilter
                                    />
                                </StandardRighthandCard>
                            </Grid>
                        )
                    }
                </Grid>
            </StandardPage>
        );
    }
}
