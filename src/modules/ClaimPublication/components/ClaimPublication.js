import React from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import {PublicationsList} from 'modules/PublicationsList';
import {FacetsFilter} from 'modules/FacetsFilter';
import {InlineLoader, StandardPage, StandardCard, ConfirmDialogBox, StandardRighthandCard} from 'uqlibrary-react-toolbox';

import {locale} from 'config';

export default class ClaimPublication extends React.Component {
    static propTypes = {
        possiblePublicationsList: PropTypes.array,
        loadingPossiblePublicationsList: PropTypes.bool,

        author: PropTypes.object,
        authorLoading: PropTypes.bool,

        facetsData: PropTypes.object,
        activeFacets: PropTypes.object,
        loadingFacetsData: PropTypes.bool,

        possibleCounts: PropTypes.object,
        loadingPossibleCounts: PropTypes.bool,

        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            publicationToHide: null,
            activeFacets: {}
        };
        this._facetsChanged = this._facetsChanged.bind(this);
    }

    componentDidMount() {
        if (this.props.author) {
            this.props.actions.searchPossiblyYourPublications(this.props.author.aut_org_username);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.author && (!this.props.author || nextProps.author.aut_org_username !== this.props.author.aut_org_username)) {
            // wait until props are updated and current author is set to get their possible publications
            this.props.actions.searchPossiblyYourPublications(nextProps.author.aut_org_username);
        }
    }

    _hidePublication = () => {
        if (this.state.publicationToHide) {
            this.props.actions.hidePublications([this.state.publicationToHide], this.props.author);
            this.setState({publicationToHide: null});
        }
    }

    _confirmHidePublication = (item) => {
        // temporary keep which publication to hide in the state
        this.setState({publicationToHide: item});
        this.hideConfirmationBox.showConfirmation();
    };

    _claimPublication = (item) => {
        this.props.history.push('/claim-publication-form');
        this.props.actions.setClaimPublication(item);
    }

    _facetsChanged = (activeFacets) => {
        // Translate the object from FacetsFilter into a query string to assign to facetsQueryString
        const queryString = Object.keys(activeFacets).map(key => {
            return ('filters[facets][' + key + ']=' + activeFacets[key]);
        }).join('&');
        const facetsQueryString = queryString !== '' ? '?' + queryString : '';
        this.props.actions.searchPossiblyYourPublications(this.props.author.aut_org_username, facetsQueryString, activeFacets);
    };

    render() {
        const txt = locale.pages.claimPublications;
        const actions = [
            {
                label: txt.searchResults.claim,
                handleAction: this._claimPublication
            },
            {
                label: txt.searchResults.hide,
                handleAction: this._confirmHidePublication
            }
        ];
        const loadingData = this.props.authorLoading || this.props.loadingPossiblePublicationsList || this.props.loadingPossibleCounts;
        const omitCategory = []; // List of facet categories to not show in the FacetsFilter
        return (
            <StandardPage title={txt.title}>
                {
                    this.props.possiblePublicationsList.length > 0 &&
                    <ConfirmDialogBox
                        onRef={ref => (this.hideConfirmationBox = ref)}
                        onAction={this._hidePublication}
                        locale={txt.hidePublicationConfirmation}/>
                }
                {
                    loadingData &&
                    <div className="is-centered">
                        <InlineLoader message={!this.props.activeFacets ? txt.loadingMessage : txt.facetSearchMessage} />
                    </div>
                }
                {
                    !loadingData && (!this.props.possiblePublicationsList || this.props.possiblePublicationsList.length === 0) &&
                    <StandardCard {...txt.noResultsFound}>
                        {txt.noResultsFound.text}
                    </StandardCard>
                }
                <div className="columns">
                    {
                        !loadingData && this.props.possiblePublicationsList && this.props.possiblePublicationsList.length > 0 &&
                        <div className="column">
                            <StandardCard title={txt.searchResults.title} help={txt.searchResults.help}>
                                <div>
                                    {
                                        txt.searchResults.text
                                            .replace('[resultsCount]', this.props.possiblePublicationsList.length)
                                            .replace('[totalCount]', this.props.possibleCounts.most_likely_match_count)
                                    }
                                </div>
                                <PublicationsList
                                    publicationsList={this.props.possiblePublicationsList}
                                    customActions={actions} />
                            </StandardCard>
                        </div>
                    }
                    {
                        !loadingData && this.props.facetsData &&
                    <div className="column is-3 is-hidden-mobile">
                        <StandardRighthandCard title={txt.facetsfilter.title} help={txt.facetsfilter.help}>
                            <FacetsFilter facetsData={this.props.facetsData}
                                facetsFunction={this._facetsChanged}
                                activeFacets={this.props.activeFacets}
                                omitCategory={omitCategory} />
                        </StandardRighthandCard>
                    </div>
                    }
                </div>
            </StandardPage>
        );
    }
}

