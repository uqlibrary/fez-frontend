import React from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import {PublicationsList, FacetsFilter} from 'modules/SharedComponents/PublicationsList';

import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox/build/ConfirmDialogBox';
import {StandardRighthandCard} from 'uqlibrary-react-toolbox/build/StandardRighthandCard';

import {routes} from 'config';
import {locale} from 'locale';

export default class PossiblyMyRecords extends React.PureComponent {
    static propTypes = {
        possiblePublicationsList: PropTypes.array,
        publicationsClaimedInProgress: PropTypes.array,
        loadingPossiblePublicationsList: PropTypes.bool,
        possiblePublicationsFacets: PropTypes.object,

        accountLoading: PropTypes.bool,

        possibleCounts: PropTypes.number,
        loadingPossibleCounts: PropTypes.bool,

        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object,

        hidePublicationFailed: PropTypes.bool,
        hidePublicationFailedErrorMessage: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.initState = {
            activeFacets: {
                filters: {},
                ranges: {}
            }
        };

        this.state = {
            // check if user has publications, once true always true
            // facets filtering might return no results, but facets should still be visible
            hasPublications: !props.loadingPossiblePublicationsList && props.possiblePublicationsList.length > 0,
            publicationToHide: null,
            ...(!!props.location.state ? props.location.state : this.initState)
        };
    }

    componentDidMount() {
        if (!this.props.accountLoading) {
            this.props.actions.searchPossiblyYourPublications({facets: this.state.activeFacets});
        }
    }

    componentWillReceiveProps(newProps) {
        // handle browser back button - set state from location/dispatch action for this state
        if (this.props.location !== newProps.location
            && newProps.history.action === 'POP'
            && newProps.location.pathname === routes.pathConfig.records.possible) {
            this.setState({...(!!newProps.location.state ? newProps.location.state : this.initState)}, () => {
                // only will be called when user clicks back on my records page
                this.props.actions.searchPossiblyYourPublications({facets: this.state.activeFacets});
            });
        }
        // set forever-true flag if user has publications
        if (!this.state.hasPublications && !newProps.loadingPossiblePublicationsList
            && !!newProps.possiblePublicationsList && newProps.possiblePublicationsList.length > 0) {
            this.setState({ hasPublications: true });
        }
    }

    componentWillUnmount() {
        this.props.actions.hideRecordErrorReset();
    }

    pushPageHistory = () => {
        this.props.history.push({
            pathname: `${routes.pathConfig.records.possible}`,
            search: `?ts=${Date.now()}`,
            state: {
                activeFacets: this.state.activeFacets,
                hasPublications: this.state.hasPublications
            }
        });
        this.props.actions.searchPossiblyYourPublications({facets: this.state.activeFacets});
    };

    _hidePublication = () => {
        if (this.state.publicationToHide) {
            this.props.actions.hideRecord({record: this.state.publicationToHide, facets: this.state.activeFacets});
            this.setState({publicationToHide: null});
        }
    };

    _confirmHidePublication = (item) => {
        // temporary keep which publication to hide in the state
        this.setState({publicationToHide: item});
        this.hideConfirmationBox.showConfirmation();
    };

    _claimPublication = (item) => {
        this.props.history.push(routes.pathConfig.records.claim);
        this.props.actions.setClaimPublication(item);
    };

    _facetsChanged = (activeFacets) => {
        this.setState({activeFacets: {...activeFacets}}, this.pushPageHistory);
    };

    _setHideConfirmationBox = (ref) => (this.hideConfirmationBox = ref);

    getAlert = (hasFailed = false, error = null, alertLocale) => {
        return hasFailed ? (<Alert {...{...alertLocale, message: alertLocale.message ? alertLocale.message(error) : error}} />) : null;
    };

    render() {
        if (this.props.accountLoading) return null;

        const txt = locale.pages.claimPublications;
        const inProgress = [
            {
                label: txt.searchResults.inProgress,
                disabled: true,
                primary: false
            }
        ];

        const actions = [
            {
                label: txt.searchResults.claim,
                handleAction: this._claimPublication,
                primary: true
            },
            {
                label: txt.searchResults.hide,
                handleAction: this._confirmHidePublication
            }
        ];
        return (
            <StandardPage title={txt.title}>
                {
                    this.getAlert(this.props.hidePublicationFailed, this.props.hidePublicationFailedErrorMessage, txt.hidePublicationFailedAlert)
                }

                {
                    // first time loading my possible publications - account hasn't been loaded or any my publications haven't been loaded
                    !this.state.hasPublications && (this.props.loadingPossiblePublicationsList || this.props.loadingPossibleCounts) &&
                    <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                }
                {
                    this.props.possiblePublicationsList.length > 0 &&
                    <ConfirmDialogBox
                        onRef={this._setHideConfirmationBox}
                        onAction={this._hidePublication}
                        locale={txt.hidePublicationConfirmation}/>
                }
                <div className="columns">
                    {
                        // no results to display
                        !this.props.loadingPossibleCounts && !this.props.loadingPossiblePublicationsList && this.props.possiblePublicationsList.length === 0 &&
                        <div className="column">
                            <StandardCard {...txt.noResultsFound}>
                                {txt.noResultsFound.text}
                            </StandardCard>
                        </div>
                    }
                    {
                        // results to display or loading if user is filtering/paging
                        this.state.hasPublications && (this.props.loadingPossiblePublicationsList || this.props.possiblePublicationsList.length > 0) &&
                        <div className="column">
                            <StandardCard title={txt.searchResults.title} help={txt.searchResults.help}>
                                {
                                    this.props.loadingPossiblePublicationsList &&
                                    <div className="is-centered"><InlineLoader message={txt.facetSearchMessage}/></div>
                                }
                                {
                                    !this.props.loadingPossiblePublicationsList && this.props.possiblePublicationsList.length > 0 &&
                                    <div>
                                        {
                                            txt.searchResults.text
                                                .replace('[resultsCount]', this.props.possiblePublicationsList.length)
                                                .replace('[totalCount]', this.props.possibleCounts)
                                        }
                                        <PublicationsList
                                            publicationsList={this.props.possiblePublicationsList}
                                            publicationsListSubset={this.props.publicationsClaimedInProgress}
                                            subsetCustomActions={inProgress}
                                            customActions={actions} />
                                    </div>
                                }
                            </StandardCard>
                        </div>
                    }
                    {
                        // show available filters or selected filters (even if there are no results)
                        ((this.props.possiblePublicationsFacets && Object.keys(this.props.possiblePublicationsFacets).length > 0)
                        || (this.state.activeFacets && this.state.activeFacets.filters && Object.keys(this.state.activeFacets.filters).length > 0)
                        || (this.state.activeFacets && this.state.activeFacets.ranges && Object.keys(this.state.activeFacets.ranges).length > 0)) &&
                        <div className="column is-3 is-hidden-mobile">
                            <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                <FacetsFilter
                                    facetsData={this.props.possiblePublicationsFacets}
                                    onFacetsChanged={this._facetsChanged}
                                    activeFacets={this.state.activeFacets}
                                    disabled={this.props.loadingPossiblePublicationsList}
                                    excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                    renameFacetsList={txt.facetsFilter.renameFacetsList} />
                            </StandardRighthandCard>
                        </div>
                    }
                </div>
            </StandardPage>
        );
    }
}

