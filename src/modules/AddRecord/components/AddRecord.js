import React from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard, StandardRighthandCard, InlineLoader, ConfirmDialogBox} from 'uqlibrary-react-toolbox';
import PublicationListLoadingProgress from '../../PublicationsList/components/PublicationListLoadingProgress';

// forms & custom components
import {PublicationSearchForm} from 'modules/PublicationSearchForm';
import {PublicationsList} from 'modules/PublicationsList';
import {PublicationForm} from 'modules/PublicationForm';

import {locale, validation} from 'config';

export default class AddRecord extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        loadingSearch: PropTypes.bool,
        loadingPublicationSources: PropTypes.object,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            stepperIndex: 0,
            initialValues: {}
        };
    }

    componentWillUnmount() {
        this._cancelWorkflow();
    }

    _showNewRecordForm = () => {
        this.setState({
            stepperIndex: this.state.stepperIndex + 1
        });
    };

    _recordSaved = () => {
        // reset stepper to publications search form
        this.setState({
            stepperIndex: 0,
            initialValues: {}
        });

        // show record save successfully confirmation box
        this.confirmationBox.showConfirmation();
    };

    _cancelWorkflow = () => {
        this.setState({
            stepperIndex: 0,
            initialValues: {}
        });
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

    _performSearch = (values) => {
        this.props.actions.searchPublications(values.get('searchQuery'));

        this.setState({
            initialValues: {
                // set initial value only if it's a title (not pubmed/DOI)
                rek_title: (!validation.isValidDOIValue(values.get('searchQuery')) && !validation.isValidPubMedValue(values.get('searchQuery'))) ? values.get('searchQuery') : ''
            },
            stepperIndex: this.state.stepperIndex + 1
        });
    };

    renderSearchResultsStep() {
        const txt = locale.pages.addRecord.step2;
        const actions = [
            {
                label: txt.claim,
                handleAction: this._claimPublication
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
                            <div>{txt.searchResults.text.replace('[noOfResults]', this.props.publicationsList.length)}</div>
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
                    <StandardRighthandCard title={locale.pages.addRecord.step2.searchResults.searchDashboard.title}>
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
                    <Stepper activeStep={this.state.stepperIndex} style={{padding: '0', margin: '-10px auto'}}>
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
                        this.state.stepperIndex === 0 &&
                        <PublicationSearchForm
                            locale={txt.step1}
                            onSubmit={this._performSearch}/>
                    }
                    {
                        this.state.stepperIndex === 1 &&
                        this.renderSearchResultsStep() // TODO: should this be a separate component or it's ok like this?
                    }
                    {
                        this.state.stepperIndex === 2 &&
                        <PublicationForm
                            onFormSubmitSuccess={this._recordSaved}
                            onFormCancel={this._cancelWorkflow}
                            initialValues={this.state.initialValues}/>
                    }
                </div>
            </StandardPage>
        );
    }
}
