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
        author: PropTypes.object,
        authorLoading: PropTypes.bool,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        console.log(this.props);
        const txt = locale.pages.myResearch;
        const loading = false; // this.props.authorLoading || (!this.props.author || this.props.loadingPublicationsList);

        return (
            <StandardPage title={txt.title}>
                {
                    loading &&
                    <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                }
                {
                    !loading && (!this.props.publicationsList || this.props.publicationsList.length === 0) &&
                    <StandardCard {...txt.noResultsFound}>
                        {txt.noResultsFound.text}
                    </StandardCard>
                }

                {
                    !loading && this.props.publicationsList && this.props.publicationsList.length > 0 &&
                    <div className="columns searchWrapper">
                        <div className="column is-9-desktop is-8-tablet is-12-mobile">
                            <StandardCard {...txt.searchResults}>
                                <div>{txt.text}</div>
                                <PublicationsListSorting sortingData={{}} />
                                <PublicationsListPaging pagingData={this.props.publicationsListPagingData} />
                                <PublicationsList publicationsList={this.props.publicationsList} showDefaultActions/>
                                <PublicationsListPaging pagingData={this.props.publicationsListPagingData} />
                            </StandardCard>
                        </div>
                        <div className="column is-3-desktop is-4-tablet is-hidden-mobile">
                            <div>Facets....</div>
                        </div>
                    </div>
                }
            </StandardPage>
        );
    }
}
