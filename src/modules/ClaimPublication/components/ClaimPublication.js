import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

// forms & custom components
import {PublicationsList} from 'modules/PublicationsList';
import {InlineLoader, StandardPage, StandardCard, ConfirmDialogBox} from 'uqlibrary-react-toolbox';

import {locale} from 'config';

export default class ClaimPublication extends React.Component {

    static propTypes = {
        publicationsList: PropTypes.array,
        loadingPublications: PropTypes.bool,
        author: PropTypes.object,
        authorLoading: PropTypes.bool,
        possibleCounts: PropTypes.object,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            publicationToHide: null
        };
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

    _hideAllPublications = () => {
        this.props.actions.hidePublications(this.props.publicationsList, this.props.author);
    }

    _confirmHideAllPublications = () => {
        this.hideAllConfirmationBox.showConfirmation();
    };

    _claimPublication = (item) => {
        this.props.history.push('/claim-publication-form');
        this.props.actions.setClaimPublication(item);
    }

    _navigateToDashboard = () => {
        // TODO: route should not be hardcoded, should come from config/menu
        // TODO: should navigation be handled by top-level container only, eg pass on as props:
        // TODO: this.props.navigateToDashboard() and this.props.navigateToClaimForm(item) <- fixes issue of linking item
        this.props.history.push('/dashboard');
    }

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
        return (
            <StandardPage title={txt.title}>
                {
                    this.props.publicationsList.length > 0 &&
                    <section>
                        <ConfirmDialogBox onRef={ref => (this.hideAllConfirmationBox = ref)}
                                          onAction={this._hideAllPublications}
                                          locale={txt.hideAllPublicationsConfirmation} />

                        <ConfirmDialogBox onRef={ref => (this.hideConfirmationBox = ref)}
                                          onAction={this._hidePublication}
                                          locale={txt.hidePublicationConfirmation} />
                    </section>
                }
                {
                    (this.props.authorLoading || (this.props.author && (this.props.loadingPublications || !this.props.possibleCounts))) &&
                    <div className="is-centered">
                        <InlineLoader message={txt.loadingMessage} />
                    </div>
                }
                {
                    ((!this.props.authorLoading && !this.props.author) || (!this.props.loadingPublications && this.props.publicationsList.length === 0)) &&
                    <StandardCard {...txt.noResultsFound}>
                        {txt.noResultsFound.text}
                    </StandardCard>
                }
                {
                    !this.props.loadingPublications && this.props.possibleCounts && this.props.publicationsList.length > 0 &&
                    <div>
                        <StandardCard title={txt.searchResults.title} help={txt.searchResults.help}>
                            <div>
                                {
                                    txt.searchResults.text
                                        .replace('[resultsCount]', this.props.publicationsList.length)
                                        .replace('[totalCount]', this.props.possibleCounts.most_likely_match_count)
                                }
                            </div>
                            <PublicationsList publicationsList={this.props.publicationsList} actions={actions}/>
                        </StandardCard>
                        <div className="layout-card">
                            <div className="columns">
                                <div className="column is-hidden-mobile" />
                                <div className="column is-narrow-desktop is-12-mobile is-pulled-right">
                                    <RaisedButton
                                        label={txt.searchResults.hideAll}
                                        secondary
                                        fullWidth
                                        onTouchTap={this._confirmHideAllPublications}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </StandardPage>
        );
    }
}

