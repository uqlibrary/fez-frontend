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
    FacetsFilter
} from 'modules/SharedComponents/PublicationsList';
import locale from 'locale/components';
import { routes } from 'config';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

export default class MyIncompleteRecords extends PureComponent {
    static propTypes = {
        incomplete: PropTypes.shape({
            publicationsList: PropTypes.array,
            publicationsListFacets: PropTypes.object,
            loadingPublicationsList: PropTypes.bool,
            publicationsListPagingData: PropTypes.object,
        }),
        exportPublicationsLoading: PropTypes.bool,

        initialFacets: PropTypes.object,
        accountLoading: PropTypes.bool,
        localePages: PropTypes.object,
        thisUrl: PropTypes.string,
        canUseExport: PropTypes.bool,

        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object
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
                ...props.initialFacets
            }
        };

        this.state = {
            // check if user has publications, once true always true
            // facets filtering might return no results, but facets should still be visible
            hasPublications: !props.incomplete.loadingPublicationsList && props.incomplete.publicationsList.length > 0,
            ...(!!props.location.state ? props.location.state : this.initState)
        };
    }

    componentDidMount() {
        if (!this.props.accountLoading && !this.props.incomplete.publicationsList.length) {
            this.props.actions.searchAuthorPublications({ ...this.state }, 'incomplete');
        }
    }

    componentWillReceiveProps(newProps) {
        // handle browser back button - set state from location/dispatch action for this state
        if (this.props.location !== newProps.location
            && newProps.history.action === 'POP'
            && newProps.location.pathname === this.props.thisUrl) {
            this.setState({ ...(
                !!newProps.location.state
                    ? newProps.location.state
                    : this.initState
            )}, () => {
                // only will be called when user clicks back on my records page
                this.props.actions.searchAuthorPublications({ ...this.state }, 'incomplete');
            });
        }
        // set forever-true flag if user has publications
        if (!this.state.hasPublications && !newProps.incomplete.loadingPublicationsList
            && !!newProps.incomplete.publicationsList && newProps.incomplete.publicationsList.length > 0) {
            this.setState({ hasPublications: true });
        }
    }

    pageSizeChanged = (pageSize) => {
        this.setState(
            {
                pageSize: pageSize,
                page: 1
            }, this.pushPageHistory
        );
    }

    pageChanged = (page) => {
        this.setState(
            {
                page: page
            }, this.pushPageHistory
        );
    }

    sortByChanged = (sortBy, sortDirection) => {
        this.setState(
            {
                sortBy: sortBy,
                sortDirection: sortDirection
            }, this.pushPageHistory
        );
    }

    facetsChanged = (activeFacets) => {
        this.setState(
            {
                activeFacets: activeFacets,
                page: 1
            }, this.pushPageHistory
        );
    }

    pushPageHistory = () => {
        this.props.history.push({
            pathname: `${this.props.thisUrl}`,
            search: `?ts=${Date.now()}`,
            state: { ...this.state }
        });
        this.props.actions.searchAuthorPublications({ ...this.state }, 'incomplete');
    };

    completeRecord = (item) => {
        this.props.history.push(routes.pathConfig.records.incompleteFix(item.rek_pid));
    }

    render() {
        if (this.props.accountLoading) return null;
        const txt = this.props.localePages;
        const pagingData = this.props.incomplete.publicationsListPagingData;
        const isLoading = this.props.incomplete.loadingPublicationsList;
        const inProgress = [
            {
                label: 'In progress',
                disabled: true,
                primary: false
            }
        ];

        const actions = [
            {
                label: txt.completeRecordButton,
                handleAction: this.completeRecord,
                primary: true
            }
        ];

        return (
            <StandardPage title={txt.pageTitle}>
                <Grid container spacing={16}>
                    {
                        // first time loading my publications - account hasn't been loaded or
                        // any my publications haven't been loaded
                        !this.state.hasPublications &&
                        this.props.incomplete.loadingPublicationsList &&
                        <Grid item xs={12}>
                            <InlineLoader message={txt.loadingMessage} />
                        </Grid>
                    }
                    {
                        // no results to display
                        !this.props.incomplete.loadingPublicationsList &&
                        this.props.incomplete.publicationsList &&
                        this.props.incomplete.publicationsList.length === 0 &&
                        <Grid item xs={12}>
                            <StandardCard {...txt.noResultsFound}>
                                {txt.noResultsFound.text}
                            </StandardCard>
                        </Grid>
                    }
                    {
                        // results to display or loading if user is filtering/paging
                        this.state.hasPublications && (
                            this.props.incomplete.loadingPublicationsList ||
                            this.props.incomplete.publicationsList.length > 0
                        ) &&
                        <Grid item xs={12} md={9}>
                            <StandardCard noHeader>
                                {
                                    pagingData &&
                                    pagingData.to &&
                                    pagingData.from &&
                                    pagingData.total &&
                                    <span>
                                        {txt.recordCount
                                            .replace('[recordsTotal]', pagingData.total)
                                            .replace('[recordsFrom]', pagingData.from)
                                            .replace('[recordsTo]', pagingData.to)}
                                    </span>
                                }
                                <Grid container spacing={16}>
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
                                            disabled={isLoading} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PublicationsListPaging
                                            loading={isLoading}
                                            pagingData={pagingData}
                                            onPageChanged={this.pageChanged}
                                            disabled={isLoading} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            isLoading &&
                                            <div className="is-centered">
                                                <InlineLoader message={
                                                    this.props.incomplete.loadingPublicationsList &&
                                                    txt.loadingPagingMessage
                                                } />
                                            </div>
                                        }
                                        {
                                            !this.props.exportPublicationsLoading &&
                                            !this.props.incomplete.loadingPublicationsList &&
                                            this.props.incomplete.publicationsList &&
                                            this.props.incomplete.publicationsList.length > 0 &&
                                            <PublicationsList
                                                publicationsList={this.props.incomplete.publicationsList}
                                                subsetCustomActions={inProgress}
                                                customActions={actions}
                                            />
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PublicationsListPaging
                                            loading={isLoading}
                                            pagingData={pagingData}
                                            onPageChanged={this.pageChanged}
                                            disabled={isLoading} />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        // show available filters or selected filters (even if there are no results)
                        ((this.props.incomplete.publicationsListFacets && Object.keys(this.props.incomplete.publicationsListFacets).length > 0)
                            || (this.state.activeFacets && this.state.activeFacets.ranges && Object.keys(this.state.activeFacets.ranges).length > 0)
                            || (this.state.activeFacets && !!this.state.activeFacets.showOpenAccessOnly)) &&
                        <Hidden smDown>
                            <Grid item md={3}>
                                <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                    <FacetsFilter
                                        facetsData={this.props.incomplete.publicationsListFacets}
                                        onFacetsChanged={this.facetsChanged}
                                        activeFacets={this.state.activeFacets}
                                        disabled={isLoading}
                                        excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                        renameFacetsList={txt.facetsFilter.renameFacetsList}
                                        lookupFacetsList={txt.facetsFilter.lookupFacetsList}
                                        showOpenAccessFilter />
                                </StandardRighthandCard>
                            </Grid>
                        </Hidden>
                    }
                </Grid>
            </StandardPage>
        );
    }
}
