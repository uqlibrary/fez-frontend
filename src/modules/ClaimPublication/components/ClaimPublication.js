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
        actions: PropTypes.object.isRequired,

        facetsQueryString: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            publicationToHide: null,
            facetsQueryString: null
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
        // Translate the object into a query string
        const test = JSON.stringify(activeFacets);
        const test1 = test.replace(new RegExp('{"', ['g']), '?filters[facets][');
        const test2 = test1.replace(new RegExp('":"', ['g']), ']=');
        const test3 = test2.replace(new RegExp('","', ['g']), '&filters[facets][');
        const facetsQueryString = test3.replace(new RegExp('"}', ['g']), '');
        console.log('String to append to the API call: ' + facetsQueryString);
        this.setState({facetsQueryString: facetsQueryString}, () => {
            console.log('******* Current state : ' + JSON.stringify(this.state));
            this.props.actions.searchPossiblyYourPublications(this.props.author.aut_org_username, this.state.facetsQueryString);
        });
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

        console.log(this.props);
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
                        <InlineLoader message={txt.loadingMessage} />
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
                    {/* {*/}
                    {/* !loadingData && this.props.facetsData &&*/}
                    <div className="column is-3 is-hidden-mobile">
                        <StandardRighthandCard title={txt.facetsfilter.title} help={txt.facetsfilter.help}>
                            <FacetsFilter facetsData={this.props.facetsData}
                                facetsFunction={this._facetsChanged}
                                omitCategory={omitCategory} />
                        </StandardRighthandCard>
                    </div>
                    {/*  } */}
                </div>
            </StandardPage>
        );
    }
}

