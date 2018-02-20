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

export default class PossiblyMyRecords extends React.Component {
    static propTypes = {
        possiblePublicationsList: PropTypes.array,
        publicationsClaimedInProgress: PropTypes.array,
        loadingPossiblePublicationsList: PropTypes.bool,
        possiblePublicationsFacets: PropTypes.object,

        author: PropTypes.object,
        account: PropTypes.object,
        accountLoading: PropTypes.bool,

        possibleCounts: PropTypes.number,
        loadingPossibleCounts: PropTypes.bool,

        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,

        hidePublicationLoading: PropTypes.bool,
        hidePublicationFailed: PropTypes.bool,
        hidePublicationFailedErrorMessage: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            publicationToHide: null,
            activeFacets: {}
        };
    }

    componentDidMount() {
        if (this.props.account) {
            this.props.actions.searchPossiblyYourPublications({facets: this.state.activeFacets});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.accountLoading !== nextProps.accountLoading
            || this.props.loadingPossiblePublicationsList !== nextProps.loadingPossiblePublicationsList
            || this.props.loadingPossibleCounts !== nextProps.loadingPossibleCounts
            || this.props.possiblePublicationsFacets !== nextProps.possiblePublicationsFacets
            || this.props.hidePublicationLoading !== nextProps.hidePublicationLoading
            || this.props.hidePublicationFailed !== nextProps.hidePublicationFailed
            || this.state !== nextState;
    }

    componentWillUnmount() {
        this.props.actions.hideRecordErrorReset();
    }

    _hidePublication = () => {
        if (this.state.publicationToHide && this.props.author !== null) {
            this.props.actions.hideRecord({record: this.state.publicationToHide, facets: this.state.activeFacets});
            this.setState({
                publicationToHide: null
            });
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
        this.setState({
            activeFacets: {...activeFacets}
        });

        this.props.actions.searchPossiblyYourPublications({facets: activeFacets});
    };

    getAlert = (hasFailed = false, error = null, alertLocale) => {
        let alertProps = null;
        if(hasFailed) {
            alertProps = {
                ...alertLocale,
                message: alertLocale.message ? alertLocale.message(error) : error
            };
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    render() {
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
                    this.props.possiblePublicationsList.length > 0 &&
                    <ConfirmDialogBox
                        onRef={ref => (this.hideConfirmationBox = ref)}
                        onAction={this._hidePublication}
                        locale={txt.hidePublicationConfirmation}/>
                }
                {
                    (this.props.loadingPossiblePublicationsList || this.props.loadingPossibleCounts) &&
                    <div className="is-centered">
                        <InlineLoader message={Object.keys(this.state.activeFacets).length === 0 ? txt.loadingMessage : txt.facetSearchMessage} />
                    </div>
                }
                <div className="columns">
                    {
                        !this.props.loadingPossibleCounts && !this.props.loadingPossiblePublicationsList
                        && (!this.props.possiblePublicationsList || this.props.possiblePublicationsList.length === 0) &&
                        <div className="column">
                            <StandardCard {...txt.noResultsFound}>
                                {txt.noResultsFound.text}
                            </StandardCard>
                        </div>
                    }
                    {
                        !this.props.loadingPossibleCounts && !this.props.loadingPossiblePublicationsList
                        && this.props.possiblePublicationsList && this.props.possiblePublicationsList.length > 0 &&
                        <div className="column">
                            <StandardCard title={txt.searchResults.title} help={txt.searchResults.help}>
                                <div>
                                    {
                                        txt.searchResults.text
                                            .replace('[resultsCount]', this.props.possiblePublicationsList.length)
                                            .replace('[totalCount]', this.props.possibleCounts)
                                    }
                                </div>
                                {this.getAlert(this.props.hidePublicationFailed, this.props.hidePublicationFailedErrorMessage, txt.hidePublicationFailedAlert)}
                                <PublicationsList
                                    publicationsList={this.props.possiblePublicationsList}
                                    publicationsListSubset={this.props.publicationsClaimedInProgress}
                                    subsetCustomActions={inProgress}
                                    customActions={actions} />
                            </StandardCard>
                        </div>
                    }
                    {
                        !this.props.loadingPossibleCounts && !this.props.loadingPossiblePublicationsList
                        && Object.keys(this.props.possiblePublicationsFacets).length > 0 &&
                        <div className="column is-3 is-hidden-mobile">
                            <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                <FacetsFilter
                                    facetsData={this.props.possiblePublicationsFacets}
                                    onFacetsChanged={this._facetsChanged}
                                    activeFacets={this.state.activeFacets}
                                    excludeFacetsList={txt.facetsFilter.excludeFacetsList} />
                            </StandardRighthandCard>
                        </div>
                    }
                </div>
            </StandardPage>
        );
    }
}

