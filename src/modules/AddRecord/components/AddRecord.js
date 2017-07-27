import React from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard, InlineLoader, ConfirmDialogBox} from 'uqlibrary-react-toolbox';
import SearchDashboard from 'modules/PublicationsList/components/SearchDashboard';

// forms & custom components
import {PublicationSearchForm} from 'modules/PublicationSearchForm';
import {PublicationsList} from 'modules/PublicationsList';
import {PublicationForm} from 'modules/PublicationForm';

import {locale, validation} from 'config';
import {searchPublications} from 'actions';

export default class AddRecord extends React.Component {

    static propTypes = {
        publicationsList: PropTypes.array,
        loadingSearch: PropTypes.bool,
        loadingPublicationSources: PropTypes.object,
        history: PropTypes.object.isRequired,
        dispatch: PropTypes.func
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
        // TODO: pass item to claim form
        // TODO: route should not be hardcoded, should come from config/menu
        console.log('todo: pass item to claim form');
        console.log(item);
        this.props.history.push('/claim-publications');
    }

    _navigateToDashboard = () => {
        // TODO: route should not be hardcoded, should come from config/menu
        // TODO: should navigation be handled by top-level container only, eg pass on as props:
        // TODO: this.props.navigateToDashboard() and this.props.navigateToClaimForm(item) <- fixes issue of linking item
        this.props.history.push('/dashboard');
    }

    _performSearch = (values) => {
        this.props.dispatch(searchPublications(values.get('searchQuery')));

        this.setState({
            initialValues: {
                // set initial value only if it's a title (not pubmed/DOI)
                rek_title: (!validation.isValidDOIValue(values.get('searchQuery')) && !validation.isValidPubMedValue(values.get('searchQuery'))) ?
                    values.get('searchQuery') : ''
            },
            stepperIndex: this.state.stepperIndex + 1
        });
    }

    renderSearchResultsStep() {
        const txt = locale.pages.addRecord.step2;
        const actions = [
            {
                label: txt.claim,
                handleAction: this._claimPublication
            }
        ];
        return (
            <div className="columns is-gapless is-multiline searchWrapper">
                {/* Mobile search dashboard (progress bar) */}
                <div className="column is-hidden-desktop is-hidden-tablet mobileWrapper">
                    <SearchDashboard loadingPublicationSources={this.props.loadingPublicationSources} mobile />
                </div>
                {/* Search results */}
                <div className="column is-10-desktop is-8-tablet is-12-mobile">
                 {
                     this.props.publicationsList.length > 0 &&
                    <StandardCard {...txt.searchResults}>
                        <div>{txt.searchResults.text.replace('[noOfResults]', this.props.publicationsList.length)}</div>
                        <PublicationsList publicationsList={this.props.publicationsList} actions={actions}/>
                    </StandardCard>
                 }
                    {
                        this.props.loadingSearch &&
                        <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                    }
                {
                    !this.props.loadingSearch && this.props.publicationsList.length === 0 &&
                    <StandardCard {...txt.noResultsFound}>
                        {txt.noResultsFound.text}
                    </StandardCard>
                }

                {
                    !this.props.loadingSearch &&
                    <div className="layout-card">
                        <div className="columns">
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
                    </div>
                }
                </div>
                {/* Desktop search dashboard */}
                <div className="column is-2-desktop is-4-tablet is-hidden-mobile">
                    <SearchDashboard loadingPublicationSources={this.props.loadingPublicationSources} />
                </div>
            </div>
        );
    }

    render() {
        return (
            <StandardPage title={locale.pages.addRecord.title}>
                <ConfirmDialogBox onRef={ref => (this.confirmationBox = ref)}
                                  onAction={this._navigateToDashboard}
                                  locale={locale.pages.addRecord.confirmationDialog} />

                <div className="Stepper">
                    <Stepper activeStep={this.state.stepperIndex} style={{padding: '0', margin: '-10px auto' }}>
                        {
                            locale.pages.addRecord.stepper.map((step, index) => {
                                return (<Step key={index}>
                                    <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{step.label}</StepLabel>
                                </Step>);
                            })
                        }
                    </Stepper>
                </div>
                <div className="layout-fill">
                        {
                            this.state.stepperIndex === 0  &&
                            <PublicationSearchForm
                                locale={locale.pages.addRecord.step1}
                                onSubmit={this._performSearch} />
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
                                initialValues={this.state.initialValues} />
                        }
                </div>
            </StandardPage>
        );
    }
}
