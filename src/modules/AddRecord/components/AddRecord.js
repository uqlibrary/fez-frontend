import React from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import {StandardPage, StandardCard} from 'uqlibrary-react-toolbox';

// the stepper's step constants
const STEP_1 = 0;
const STEP_2 = 1;
const STEP_3 = 2;

// forms & custom components
import {PublicationSearchForm} from 'modules/Forms';
import {PublicationForm} from 'modules/PublicationForm';
import {PublicationsList} from 'modules/PublicationsList';

import {InlineLoader} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import {searchPublications} from 'actions';

export default class AddRecord extends React.Component {

    static propTypes = {
        publicationsList: PropTypes.array,
        loadingSearch: PropTypes.bool,
        loadingSearchSources: PropTypes.number,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            stepperIndex: 0
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this._cancelWorkflow();
    }

    handleSearch = values => {
        console.log(values);

        this.props.dispatch(searchPublications('vaccinations in Brazil'));

        // TODO: move to next step - search results display
        this.setState({
            stepperIndex: this.state.stepperIndex + 1
        });
    };

    handleNext = () => {
        this.setState({
            stepperIndex: this.state.stepperIndex + 1
        });
    };

    handlePrev = () => {
        this.setState({
            stepperIndex: this.state.stepperIndex - 1
        });
    };

    handleCloseSubmitForApproval = () => {
        this.setState({submitOpen: false});
    };

    handleOpenSubmitForApproval = () => {
        this.setState({submitOpen: true});
    };

    _recordSaved = () => {
        // TODO: record has been saved... what to do?
        console.log('display a dialog box with options...');

        // reset stepper to publications search form
        this.setState({
            stepperIndex: 0
        });
    };

    _cancelWorkflow = () => {
        // TODO: what's required to clean up - stepper, search results, etc?
        this.setState({
            stepperIndex: 0
        });
    };

    _claimPublication = (item) => {
        console.log('claim clicked... TODO: redirect to claim publication');
        console.log(item);
    }

    getStepContent(stepIndex) {
        const buttonLabels = locale.global.labels.buttons;

        const actions = [
            {
                label: 'Claim this publication',
                handleAction: this._claimPublication
            }
        ];

        switch (stepIndex) {
            case STEP_1:
                const searchForPublicationInformation = locale.pages.addRecord.searchForPublication;
                return (
                    <div>
                        <PublicationSearchForm onSubmit={this.handleSearch}
                           title={searchForPublicationInformation.title}
                           explanationText={searchForPublicationInformation.explanationText}
                           help={searchForPublicationInformation.help}
                           />
                    </div>
                );
            case STEP_2:
                // on initial load this will be null
                const searchResultsInformation = locale.pages.addRecord.searchResults;
                const noMatchingRecordsInformation = locale.pages.addRecord.noMatchingRecords;

                return (
                    <div>
                        {this.props.loadingSearch &&
                            (<div className="is-centered">
                                ${this.props.loadingSearchSources} our of 4
                                <InlineLoader message="Searching for your publications out of 4)..." />
                            </div>)
                        }

                        {
                            (!this.props.loadingSearch || this.props.publicationsList.length > 0) &&
                            <StandardCard title={searchResultsInformation.title} help={searchResultsInformation.help}>
                                <div>{searchResultsInformation.explanationText.replace('[noOfResults]', this.props.publicationsList.length)}</div>
                                <PublicationsList publicationsList={this.props.publicationsList} actions={actions}/>
                            </StandardCard>
                        }

                        {!this.props.loadingSearch && this.props.publicationsList.length === 0 &&
                            <StandardCard {...noMatchingRecordsInformation} />
                        }

                        {!this.props.loadingSearch &&
                            <div className="layout-card">
                                    <div className="columns">
                                        <div className="column is-hidden-mobile"/>
                                        <div className="column is-narrow-desktop">
                                        <RaisedButton
                                            fullWidth
                                            label={buttonLabels.abandon}
                                            onTouchTap={this.handlePrev}
                                        />
                                        </div>
                                        <div className="column is-narrow-desktop">
                                        <RaisedButton
                                            label="Create a new espace record"
                                            secondary
                                            fullWidth
                                            autoFocus={this.props.publicationsList.length === 0}
                                            keyboardFocused={this.props.publicationsList.length === 0}
                                            onTouchTap={this.handleNext}
                                        />
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                );
            case STEP_3:
                return (
                    <PublicationForm onFormSubmitSuccess={this._recordSaved} onFormCancel={this._cancelWorkflow} />
                );
            default:
                const stepperInformation = locale.pages.addRecord.stepper;
                return stepperInformation.defaultErrorMessage;
        }
    }

    render() {
        console.log(this.props.loadingSearch);
        console.log(this.props.publicationsList);
        return (
            <StandardPage title={locale.pages.addRecord.title}>
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
                {
                    // TODO: remove all inline styles
                }
                <div style={{width: '100%', maxWidth: '1320px', margin: '0 auto'}}>
                    <div style={{margin: '0', overflow: 'hidden'}}>
                        <div>{this.getStepContent(this.state.stepperIndex)}</div>
                    </div>
                </div>

            </StandardPage>
        );
    }
}
