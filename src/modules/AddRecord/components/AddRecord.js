import React from 'react';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

// the stepper's step constants
const STEP_1 = 0;
const STEP_2 = 1;
const STEP_3 = 2;

// forms & custom components
import {PublicationSearchForm} from 'modules/Forms';
import {SearchResults} from 'modules/SearchResults';
import {NoMatchingRecords} from 'modules/NoMatchingRecords';
import {PublicationTypeForm} from 'modules/Forms/PublicationType';
import {AddJournalArticleForm} from 'modules/Forms/JournalArticle';
import {InlineLoader} from 'uqlibrary-react-toolbox';
import {locale} from 'config';

import './AddRecord.scss';

export default class AddRecord extends React.Component {

    static propTypes = {
        decreaseStep: PropTypes.func,
        increaseStep: PropTypes.func,
        loadPublicationTypesList: PropTypes.func,
        publicationTypeList: PropTypes.object,
        resetStepper: PropTypes.func,
        searchResultsList: PropTypes.object,
        loadingSearch: PropTypes.bool,
        selectedPublicationType: PropTypes.object,
        stepperIndex: PropTypes.number
    };

    static defaultProps = {
        searchResultsList: null,
        loadingSearch: false
    };

    constructor(props) {
        super(props);

        // setup the state
        this.state = {
            loading: false,
            finished: false,
            submitOpen: false,
            saveOpen: false,
            publicationType: 0
        };
    }

    componentDidMount() {
        this.props.loadPublicationTypesList();
    }

    componentWillUnmount() {
        this.props.resetStepper();
    }

    cancelAddingRecord = () => {
        this.props.resetStepper();
    };

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            this.asyncTimer = setTimeout(cb, 500);
        });
    };

    handleNext = () => {
        this.props.increaseStep();
    };

    handlePrev = () => {
        this.props.decreaseStep();
    };

    handleCloseSubmitForApproval = () => {
        this.setState({submitOpen: false});
    };

    handleOpenSubmitForApproval = () => {
        this.setState({submitOpen: true});
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case STEP_1:
                const searchForPublicationInformation = locale.pages.addRecord.searchForPublication;
                return (
                    <div>
                        <PublicationSearchForm onSubmit={this.handleNext}
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
                            <div className="is-centered">
                                <InlineLoader message="Searching for your publications..." />
                            </div>
                        }

                        {!this.props.loadingSearch && this.props.searchResultsList.size > 0 &&
                        <SearchResults
                            dataSource={this.props.searchResultsList}
                            title={searchResultsInformation.title}
                            explanationText={searchResultsInformation.explanationText}
                            claimRecordBtnLabel={searchResultsInformation.claimRecordBtnLabel}
                            help={searchResultsInformation.help}
                        />
                        }

                        {!this.props.loadingSearch && this.props.searchResultsList.size === 0 &&
                            <NoMatchingRecords
                                title={noMatchingRecordsInformation.title}
                                explanationText={noMatchingRecordsInformation.explanationText}
                                searchAgainBtnLabel={noMatchingRecordsInformation.searchAgainBtnLabel}
                                addPublicationBtnLabel={noMatchingRecordsInformation.addPublicationBtnLabel}
                                help={noMatchingRecordsInformation.help}
                            />
                        }

                        {!this.props.loadingSearch &&
                            <div className="layout-container">
                                <div className="layout-card">
                                    <div style={{textAlign: 'right'}}>
                                        <FlatButton
                                            label="Abandon and search again"
                                            style={{marginRight: 12}}
                                            onTouchTap={this.handlePrev}
                                        />
                                        <RaisedButton
                                            label="Create a new espace record"
                                            secondary
                                            autoFocus={this.props.searchResultsList.size === 0}
                                            keyboardFocused={this.props.searchResultsList.size === 0}
                                            onTouchTap={this.handleNext}
                                        />
                                    </div>
                                </div>
                            </div>
                        }

                        <ReactTooltip id="claimTooltips" effect="solid" place="bottom"/>
                    </div>
                );
            case STEP_3:
                const {selectedPublicationType} = this.props;
                const publicationTypeInformation = locale.pages.addRecord.publicationTypeForm;
                const buttonLabels = locale.global.labels.buttons;
                const showButton = !selectedPublicationType || (selectedPublicationType && selectedPublicationType.size === 0);

                return (
                    <div>
                        <PublicationTypeForm
                            title={publicationTypeInformation.title}
                            explanationText={publicationTypeInformation.explanationText}
                            help={publicationTypeInformation.help}
                            maxSearchResults={publicationTypeInformation.maxSearchResults}
                            publicationTypeLabel={publicationTypeInformation.publicationTypeLabel}
                            selectFirstOptionLabel={publicationTypeInformation.selectFirstOptionLabel}
                            dataSource={this.props.publicationTypeList}
                            popularTypesList={publicationTypeInformation.popularTypesList} />

                            {showButton &&
                                <div style={{maxWidth: '1200px', margin: '24px auto', width: '90%', textAlign: 'right'}}>
                                    <RaisedButton
                                        label={buttonLabels.abandon}
                                        style={{marginLeft: '12px'}}
                                        onTouchTap={this.cancelAddingRecord}/>
                                </div>
                            }

                            {/* TODO: fix this warning */}
                            {selectedPublicationType && selectedPublicationType.size > 0
                                && selectedPublicationType.get('name').toLowerCase() === publicationTypeInformation.documentTypes.JOURNAL_ARTICLE
                                && <AddJournalArticleForm form="AddJournalArticleForm" />
                            }
                    </div>
                );
            default:
                const stepperInformation = locale.pages.addRecord.stepper;
                return stepperInformation.defaultErrorMessage;
        }
    }

    renderContent() {
        const contentStyle = {margin: '0', overflow: 'hidden'};

        return (
            <div style={contentStyle}>
                <div>{this.getStepContent(this.props.stepperIndex)}</div>
            </div>
        );
    }

    render() {
        const {loading} = this.state;
        const stepperInformation = locale.pages.addRecord.stepper;
        return (
            <div>
                <h1 className="page-title headline">{locale.pages.addRecord.title}</h1>

                {/* Stepper start */}
                <div className="Stepper">
                <Stepper activeStep={this.props.stepperIndex} style={{padding: '0', margin: '-10px auto' }} onChange={this.handleNext}>
                    <Step>
                        <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{stepperInformation.step1Label}</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{stepperInformation.step2Label}</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{stepperInformation.step3Label}</StepLabel>
                    </Step>
                </Stepper>
                </div>


                <div style={{width: '100%', maxWidth: '1320px', margin: '0 auto'}}>
                    <ExpandTransition loading={loading} open>
                        {this.renderContent()}
                    </ExpandTransition>
                </div>
                {/* Stepper end */}
            </div>
        );
    }
}
