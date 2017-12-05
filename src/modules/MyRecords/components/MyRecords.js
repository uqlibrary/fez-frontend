import React from 'react';
import PropTypes from 'prop-types';

import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardRighthandCard} from 'uqlibrary-react-toolbox/build/StandardRighthandCard';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';

import {PublicationsList, PublicationsListPaging, PublicationsListSorting, FacetsFilter} from 'modules/SharedComponents/PublicationsList';
import {locale} from 'locale';
import {routes} from 'config';
export default class MyRecords extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        publicationsListFacets: PropTypes.object,
        loadingPublicationsList: PropTypes.bool,
        publicationsListPagingData: PropTypes.object,

        account: PropTypes.object,
        accountLoading: PropTypes.bool,

        history: PropTypes.object.isRequired,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            allowResultsPaging: !props.loadingPublicationsList && props.publicationsList.length > 0,
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[0].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            activeFacets: {}
        };
    }

    componentDidMount() {
        if (this.props.account && this.props.account.id) {
            this.props.actions.searchAuthorPublications({userName: this.props.account.id});
        }
    }

    componentWillReceiveProps(newProps) {
        if (!this.state.allowResultsPaging && !newProps.loadingPublicationsList && newProps.publicationsList.length > 0) {
            this.setState({ allowResultsPaging: true });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.accountLoading !== nextProps.accountLoading
            || this.props.loadingPublicationsList !== nextProps.loadingPublicationsList
            || this.state !== nextState;
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.sortBy !== nextState.sortBy
            || this.state.sortDirection !== nextState.sortDirection
            || this.state.pageSize !== nextState.pageSize
            || this.state.page !== nextState.page
            || JSON.stringify(this.state.activeFacets) !== JSON.stringify(nextState.activeFacets)) {
            this.props.actions.searchAuthorPublications({
                userName: this.props.account.id,
                pageSize: nextState.pageSize,
                page: nextState.page,
                sortBy: nextState.sortBy,
                sortDirection: nextState.sortDirection,
                facets: nextState.activeFacets
            });
        }
    }

    pageSizeChanged = (pageSize) => {
        this.setState({
            pageSize: pageSize,
            page: 1
        });
    }

    pageChanged = (page) => {
        this.setState({
            page: page
        });
    }

    sortByChanged = (sortBy, sortDirection) => {
        this.setState({
            sortBy: sortBy,
            sortDirection: sortDirection
        });
    }

    facetsChanged = (activeFacets) => {
        this.setState({
            activeFacets: {...activeFacets},
            page: 1
        });
    }

    fixRecord = (item) => {
        this.props.history.push(routes.pathConfig.records.fix(item.rek_pid));
        this.props.actions.setFixRecord(item);
    }

    render() {
        const txt = locale.pages.myResearch;

        return (
            <StandardPage title={txt.title}>
                {
                    (this.props.accountLoading || (!this.state.allowResultsPaging && this.props.loadingPublicationsList)) &&
                    <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                }
                <div className="columns">
                    {
                        !this.props.accountLoading && !this.props.loadingPublicationsList && (!this.props.publicationsList || this.props.publicationsList.length === 0) &&
                        <div className="column">
                            <StandardCard {...txt.noResultsFound}>
                                {txt.noResultsFound.text}
                            </StandardCard>
                        </div>
                    }
                    {
                        !this.props.accountLoading && this.state.allowResultsPaging &&
                        <div className="column">
                            <StandardCard {...txt}>
                                <div>{txt.text}</div>
                                <PublicationsListSorting
                                    pagingData={this.props.publicationsListPagingData}
                                    onSortByChanged={this.sortByChanged}
                                    onPageSizeChanged={this.pageSizeChanged}
                                    disabled={this.props.loadingPublicationsList} />
                                <PublicationsListPaging
                                    loading={this.props.loadingPublicationsList}
                                    pagingData={this.props.publicationsListPagingData}
                                    onPageChanged={this.pageChanged}
                                    disabled={this.props.loadingPublicationsList} />
                                {
                                    this.props.loadingPublicationsList &&
                                    <div className="is-centered"><InlineLoader message={txt.loadingPagingMessage}/></div>
                                }
                                {
                                    !this.props.loadingPublicationsList && this.props.publicationsList && this.props.publicationsList.length > 0 &&
                                    <PublicationsList
                                        publicationsList={this.props.publicationsList}
                                        showDefaultActions />
                                }
                                <PublicationsListPaging
                                    loading={this.props.loadingPublicationsList}
                                    pagingData={this.props.publicationsListPagingData}
                                    onPageChanged={this.pageChanged}
                                    disabled={this.props.loadingPublicationsList} />
                            </StandardCard>
                        </div>
                    }
                    {
                        !this.props.accountLoading && this.state.allowResultsPaging && this.props.publicationsListFacets
                        && Object.keys(this.props.publicationsListFacets).length > 0 &&
                        <div className="column is-3 is-hidden-mobile">
                            <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                <FacetsFilter
                                    facetsData={this.props.publicationsListFacets}
                                    onFacetsChanged={this.facetsChanged}
                                    activeFacets={this.state.activeFacets}
                                    disabled={this.props.loadingPublicationsList}
                                    excludeFacetsList={txt.facetsFilter.excludeFacetsList} />
                            </StandardRighthandCard>
                        </div>
                    }
                </div>
            </StandardPage>
        );
    }
}
