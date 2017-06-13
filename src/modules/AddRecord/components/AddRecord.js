import React from 'react';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';

// the stepper's step constants
const STEP_1 = 0;
const STEP_2 = 1;
const STEP_3 = 2;

// for displaying different types of fields depending on publication type selected
let formType;

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
        searchResultsList: PropTypes.object,
        selectedPublicationType: PropTypes.object,
        stepperIndex: PropTypes.number
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

    setFormDetails = (selectedPublicationType, publicationTypeInformation) => {
        if (selectedPublicationType.size > 0) {
            switch(selectedPublicationType.get('name').toLowerCase()) {
                case publicationTypeInformation.documentTypes.JOURNAL_ARTICLE:
                    formType = publicationTypeInformation.documentTypes.JOURNAL_ARTICLE;
                    break;
                default:
                    formType = 'defaultFormType';
                    break;
            }
        }
    };

    resetFormType = () => {
        formType = 'defaultFormType';
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

                this.resetFormType();

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

                this.setFormDetails(selectedPublicationType, publicationTypeInformation);

                return (
                    <div>
                        <PublicationTypeForm
                            title={publicationTypeInformation.title}
                            explanationText={publicationTypeInformation.explanationText}
                            help={publicationTypeInformation.help}
                            maxSearchResults={publicationTypeInformation.maxSearchResults}
                            publicationTypeLabel={publicationTypeInformation.publicationTypeLabel}
                            dataSource={this.props.publicationTypeList}
                            popularTypesList={publicationTypeInformation.popularTypesList} />


                            {/* Journal Article is selected. Size check needed as it is an empty Immutable Map on initial load */}
                            {formType === publicationTypeInformation.documentTypes.JOURNAL_ARTICLE &&
                            <AddJournalArticleForm form="AddJournalArticleForm" />
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
