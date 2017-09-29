import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard, InlineLoader, ConfirmDialogBox, StandardRighthandCard} from 'uqlibrary-react-toolbox';

// forms & custom components
import AddRecordStepper from './AddRecordStepper';
import {PublicationsList} from 'modules/PublicationsList';
import {PublicationListLoadingProgress} from 'modules/PublicationsList';

import {locale} from 'config';

export default class SearchPublicationResults extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        loadingSearch: PropTypes.bool,
        loadingPublicationSources: PropTypes.object,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object,
        stepperIndex: PropTypes.number,
        initialValues: PropTypes.object
    };

    static defaultProps = {
        stepperIndex: 1
    };

    constructor(props) {
        super(props);
    }

    _showNewRecordForm = () => {
        this.props.history.push('/records/add/new');
    };

    _cancelWorkflow = () => {
        this.props.history.push('/records/add/find');
    };

    _claimPublication = (item) => {
        this.props.actions.setClaimPublication(item);
        this.props.history.push('/claim-publication-form');
    };

    _navigateToDashboard = () => {
        // TODO: route should not be hardcoded, should come from config/menu
        // TODO: should navigation be handled by top-level container only, eg pass on as props:
        // TODO: this.props.navigateToDashboard() and this.props.navigateToClaimForm(item) <- fixes issue of linking item
        this.props.history.push('/dashboard');
    };

    render() {
        const txt = locale.pages.addRecord;
        const searchResultsTxt = locale.pages.addRecord.step2;
        const actions = [
            {
                label: searchResultsTxt.claim,
                handleAction: this._claimPublication,
                primary: true
            }
        ];
        return (
            <StandardPage title={txt.title}>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._navigateToDashboard}
                    locale={txt.confirmationDialog}/>

                <AddRecordStepper activeStep={this.props.stepperIndex} steps={txt.stepper} />
                <div className="columns searchWrapper">
                    {/* Mobile search dashboard (progress bar) */}
                    <div className="column is-hidden-desktop is-hidden-tablet mobileWrapper">
                        <PublicationListLoadingProgress
                            mobile
                            loadingPublicationSources={this.props.loadingPublicationSources} />
                    </div>
                    {/* Search results */}
                    <div className="column">
                        {
                            this.props.loadingSearch &&
                            <div className="is-centered"><InlineLoader message={searchResultsTxt.loadingMessage}/></div>
                        }
                        {
                            this.props.publicationsList.length > 0 &&
                            <StandardCard {...searchResultsTxt.searchResults}>
                                <div>{searchResultsTxt.searchResults.text.replace('[noOfResults]', this.props.publicationsList.length).replace('[searchQuery]', this.props.initialValues.rawSearchQuery)}</div>
                                <PublicationsList publicationsList={this.props.publicationsList} customActions={actions}/>
                            </StandardCard>
                        }

                        {
                            !this.props.loadingSearch && this.props.publicationsList.length === 0 &&
                            <StandardCard {...searchResultsTxt.noResultsFound}>
                                {searchResultsTxt.noResultsFound.text}
                            </StandardCard>
                        }

                        {
                            !this.props.loadingSearch &&
                            <div className="columns action-buttons">
                                <div className="column is-hidden-mobile"/>
                                <div className="column is-narrow-desktop">
                                    <RaisedButton
                                        fullWidth
                                        label={searchResultsTxt.cancel}
                                        onTouchTap={this._cancelWorkflow}
                                    />
                                </div>
                                <div className="column is-narrow-desktop">
                                    <RaisedButton
                                        label={searchResultsTxt.submit}
                                        secondary
                                        fullWidth
                                        autoFocus={this.props.publicationsList.length === 0}
                                        keyboardFocused={this.props.publicationsList.length === 0}
                                        onTouchTap={this._showNewRecordForm}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    {/* Desktop search dashboard */}
                    <div className="column is-3-desktop is-4-tablet is-hidden-mobile">
                        <StandardRighthandCard title={searchResultsTxt.searchResults.searchDashboard.title}>
                            <PublicationListLoadingProgress loadingPublicationSources={this.props.loadingPublicationSources}/>
                        </StandardRighthandCard>
                    </div>
                </div>
            </StandardPage>
        );
    }
}
