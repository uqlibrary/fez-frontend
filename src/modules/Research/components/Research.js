import React from 'react';
import PropTypes from 'prop-types';
import {StandardPage, StandardCard, InlineLoader} from 'uqlibrary-react-toolbox';
import {PublicationsList, PublicationsListPaging, PublicationsListSorting} from 'modules/PublicationsList';
import {locale} from 'config';

export default class Research extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
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
            allowResultsPaging: false,
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[0].value,
            sortDirection: locale.components.sorting.sortDirection[0]
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

    componentWillUpdate(nextProps, nextState) {
        if (this.state.sortBy !== nextState.sortBy
            || this.state.sortDirection !== nextState.sortDirection
            || this.state.pageSize !== nextState.pageSize
            || this.state.page !== nextState.page) {
            this.props.actions.searchAuthorPublications({
                userName: this.props.account.id,
                pageSize: nextState.pageSize,
                page: nextState.page,
                sortBy: nextState.sortBy,
                sortDirection: nextState.sortDirection
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

    render() {
        const txt = locale.pages.myResearch;

        return (
            <StandardPage title={txt.title}>
                <div className="columns searchWrapper">
                    {
                        !this.state.allowResultsPaging && this.props.loadingPublicationsList &&
                        <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                    }
                    {
                        !this.props.loadingPublicationsList && (!this.props.publicationsList || this.props.publicationsList.length === 0) &&
                        <StandardCard {...txt.noResultsFound}>
                            {txt.noResultsFound.text}
                        </StandardCard>
                    }
                    {
                        this.state.allowResultsPaging &&
                        <div className="column is-9-desktop">
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
                                    <PublicationsList publicationsList={this.props.publicationsList} showDefaultActions/>
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
                        this.state.allowResultsPaging &&
                        <div className="column is-3-desktop is-hidden-mobile">
                            <div>Facets....</div>
                        </div>
                    }
                </div>
            </StandardPage>
        );
    }
}
