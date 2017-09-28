import React from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard, InlineLoader, ConfirmDialogBox, StandardRighthandCard} from 'uqlibrary-react-toolbox';

// forms & custom components
import {PublicationsList} from 'modules/PublicationsList';
import {PublicationListLoadingProgress} from 'modules/PublicationsList';

import {locale} from 'config';


import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

export class PublicationSearchResults extends React.Component {
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

    renderSearchResultsStep() {
        const txt = locale.pages.addRecord.step2;
        const actions = [
            {
                label: txt.claim,
                handleAction: this._claimPublication,
                primary: true
            }
        ];
        return (
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
                        <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                    }
                    {
                        this.props.publicationsList.length > 0 &&
                        <StandardCard {...txt.searchResults}>
                            <div>{txt.searchResults.text.replace('[noOfResults]', this.props.publicationsList.length).replace('[searchQuery]', this.props.initialValues.rawSearchQuery)}</div>
                            <PublicationsList publicationsList={this.props.publicationsList} customActions={actions}/>
                        </StandardCard>
                    }

                    {
                        !this.props.loadingSearch && this.props.publicationsList.length === 0 &&
                        <StandardCard {...txt.noResultsFound}>
                            {txt.noResultsFound.text}
                        </StandardCard>
                    }

                    {
                        !this.props.loadingSearch &&
                        <div className="columns action-buttons">
                            <div className="column is-hidden-mobile"/>
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    fullWidth
                                    label={txt.cancel}
                                    onTouchTap={this._cancelWorkflow}
                                />
                            </div>
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    label={txt.submit}
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
                    <StandardRighthandCard title={txt.searchResults.searchDashboard.title}>
                        <PublicationListLoadingProgress loadingPublicationSources={this.props.loadingPublicationSources}/>
                    </StandardRighthandCard>
                </div>
            </div>
        );
    }

    render() {
        const txt = locale.pages.addRecord;
        return (
            <StandardPage title={txt.title}>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._navigateToDashboard}
                    locale={txt.confirmationDialog}/>

                <div className="Stepper">
                    <Stepper activeStep={this.props.stepperIndex} style={{padding: '0', margin: '-10px auto'}}>
                        {
                            txt.stepper.map((step, index) => {
                                return (<Step key={index}>
                                    <StepLabel
                                        style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{step.label}</StepLabel>
                                </Step>);
                            })
                        }
                    </Stepper>
                </div>
                <div>
                    {
                        this.renderSearchResultsStep()
                    }
                </div>
            </StandardPage>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.get('searchRecordsReducer')
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

const PublicationSearchResultsContainer = connect(mapStateToProps, mapDispatchToProps)(PublicationSearchResults);
export default withRouter(PublicationSearchResultsContainer);
