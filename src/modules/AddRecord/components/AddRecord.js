import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';


// the stepper's step constants
const STEP_1 = 0;
const STEP_2 = 1;
const STEP_3 = 2;

// forms & custom components
import {PublicationSearchForm} from '../../Forms';
import {SearchResults} from '../../SearchResults';
import {NoMatchingRecords} from '../../NoMatchingRecords';
import {PublicationTypeForm} from '../../Forms/PublicationType';
import {AddJournalArticleForm} from '../../Forms/JournalArticle';
import {InlineLoader} from 'uqlibrary-react-toolbox';
import {locale} from '../../../config';

import './AddRecord.scss';

class addRecord extends React.Component {

    static propTypes = {
        searchResultsList: PropTypes.object,
        selectedPublicationType: PropTypes.object,
        loadPublicationTypesList: PropTypes.func,
        loadNotification: PropTypes.func,
        publicationTypeList: PropTypes.object,
        snackbar: PropTypes.object.isRequired,
        cancelAddRecord: PropTypes.func,
        saveForLater: PropTypes.func,
        submitRecord: PropTypes.func
    };

    static defaultProps = {
        searchResultsList: null
    };

    constructor(props) {
        super(props);

        // setup the state
        this.state = {
            loading: false,
            finished: false,
            stepIndex: 0,
            submitOpen: false,
            saveOpen: false,
            publicationType: 0
        };
    }

    componentDidMount() {
        this.props.loadPublicationTypesList();
    }

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            this.asyncTimer = setTimeout(cb, 500);
        });
    };

    handleNext = () => {
        const {stepIndex} = this.state;
        if (!this.state.loading) {
            this.dummyAsync(() => {
                this.setState({
                    loading: false,
                    stepIndex: stepIndex + 1,
                    finished: stepIndex >= 2,
                });
            });
        }
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (!this.state.loading) {
            this.dummyAsync(() => this.setState({
                loading: false,
                stepIndex: stepIndex - 1,
            }));
        }
    };

    handleCloseSubmitForApproval = () => {
        this.setState({submitOpen: false});
    };

    handleCloseSaveForLater = () => {
        this.setState({saveOpen: false});
    };

    handleOpenSubmitForApproval = () => {
        this.setState({submitOpen: true});
    };

    handleOpenSaveForLater = () => {
        this.setState({saveOpen: true});
    };

    // TODO: Update this with the new pagestepper component as it will have it's own reducer to update the step
    cancelAddRecord = () => {
        // go back to step 1
        this.setState({stepIndex: 0});
        this.props.cancelAddRecord(locale.notifications.addRecord.cancelMessage);
    };

    // TODO: Update this with the new pagestepper component as it will have it's own reducer to update the step
    saveForLater = () => {
        // go back to step 1
        this.setState({stepIndex: 0});
        this.props.saveForLater(locale.notifications.addRecord.saveMessage);
    };

    // TODO: Update this with the new pagestepper component as it will have it's own reducer to update the step
    submitRecord = () => {
        // go back to step 1
        this.setState({stepIndex: 0});
        this.props.submitRecord(locale.notifications.addRecord.submitMessage);
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
                           defaultSearchFieldLabel={searchForPublicationInformation.defaultSearchFieldLabel}
                           defaultButtonLabel={searchForPublicationInformation.defaultButtonLabel}
                           help={searchForPublicationInformation.help}
                           />
                    </div>
                );
            case STEP_2:
                // on initial load this will be null
                const loaded = this.props.searchResultsList !== null;
                const inlineLoaderInformation = locale.pages.addRecord.inlineLoader;
                const searchResultsInformation = locale.pages.addRecord.searchResults;
                const noMatchingRecordsInformation = locale.pages.addRecord.noMatchingRecords;

                return (
                    <div>
                        {!loaded &&
                            <div className="is-centered">
                                <InlineLoader message={inlineLoaderInformation.message} />
                            </div>
                        }

                        {loaded && this.props.searchResultsList.size > 0 &&
                        <SearchResults
                            dataSource={this.props.searchResultsList}
                            title={searchResultsInformation.title}
                            explanationText={searchResultsInformation.explanationText}
                            claimRecordBtnLabel={searchResultsInformation.claimRecordBtnLabel}
                            help={searchResultsInformation.help}
                        />
                        }

                        {loaded &&
                            <NoMatchingRecords
                                handleNext={this.handleNext}
                                handlePrevious={this.handlePrev}
                                stepIndex={this.state.stepIndex}
                                title={noMatchingRecordsInformation.title}
                                explanationText={noMatchingRecordsInformation.explanationText}
                                searchAgainBtnLabel={noMatchingRecordsInformation.searchAgainBtnLabel}
                                addPublicationBtnLabel={noMatchingRecordsInformation.addPublicationBtnLabel}
                                help={noMatchingRecordsInformation.help}
                            />
                        }
                        <ReactTooltip id="claimTooltips" effect="solid" place="bottom"/>
                    </div>
                );
            case STEP_3:
                const {selectedPublicationType} = this.props;
                const publicationTypeInformation = locale.pages.addRecord.publicationTypeForm;
                const buttonLabels = locale.global.labels.buttons;

                return (
                    <PublicationTypeForm
                        title={publicationTypeInformation.title}
                        explanationText={publicationTypeInformation.explanationText}
                        help={publicationTypeInformation.help}
                        maxSearchResults={publicationTypeInformation.maxSearchResults}
                        publicationTypeLabel={publicationTypeInformation.publicationTypeLabel}
                        dataSource={this.props.publicationTypeList}
                        popularTypesList={publicationTypeInformation.popularTypesList}>
                            <div>
                            {/* Journal Article is selected. Size check needed as it is an empty Immutable Map on initial load */}
                            {selectedPublicationType.size > 0 && selectedPublicationType.get('name').toLowerCase() === locale.pages.addRecord.publicationTypeForm.documentTypes.JOURNAL_ARTICLE &&
                                <AddJournalArticleForm />
                            }

                            {selectedPublicationType.size > 0 &&
                                <div className="buttonWrapper">
                                    <RaisedButton label={buttonLabels.saveForLater} style={{marginLeft: '12px'}}
                                                  onTouchTap={this.saveForLater}/>
                                    <RaisedButton label={buttonLabels.cancel} style={{marginLeft: '12px'}} onTouchTap={this.cancelAddRecord}/>
                                    <RaisedButton secondary label={buttonLabels.submitForApproval} style={{marginLeft: '12px'}}
                                                  onTouchTap={this.submitRecord}/>
                                </div>
                            }
                            </div>
                    </PublicationTypeForm>
                );
            default:
                const stepperInformation = locale.pages.addRecord.stepper;
                return stepperInformation.defaultErrorMessage;
        }
    }

    renderContent() {
        const {stepIndex} = this.state;
        const contentStyle = {margin: '0 16px', overflow: 'hidden'};

        return (
            <div style={contentStyle}>
                <div>{this.getStepContent(stepIndex)}</div>
            </div>
        );
    }

    render() {
        const {loading} = this.state;
        const stepperInformation = locale.pages.addRecord.stepper;

        return (
            <div className="layout-fill">
                <h1 className="page-title display-1">{locale.pages.addRecord.title}</h1>

                {/* Stepper start */}
                <div className="Stepper">
                <Stepper activeStep={this.state.stepIndex} style={{padding: '0 25px', margin: '-10px auto' }} onChange={this.handleNext}>
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


                <div style={{width: '100%', maxWidth: '1200px', margin: 'auto'}}>
                    <ExpandTransition loading={loading} open>
                        {this.renderContent()}
                    </ExpandTransition>
                </div>
                {/* Stepper end */}
            </div>
        );
    }
}

export default addRecord;
