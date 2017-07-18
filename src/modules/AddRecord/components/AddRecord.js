import React from 'react';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import {StandardCard} from 'uqlibrary-react-toolbox';

// the stepper's step constants
const STEP_1 = 0;
const STEP_2 = 1;
const STEP_3 = 2;

// forms & custom components
import {PublicationSearchForm} from 'modules/Forms';
import {SearchResults} from 'modules/SearchResults';
import {PublicationTypeForm} from 'modules/Forms/PublicationType';
import {AddJournalArticleForm} from 'modules/Forms/JournalArticle';
import {InlineLoader} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import {isDOIValue, isPartialDOIValue, isPubMedValue} from 'modules/Forms/PublicationSearch/validator';

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
        stepperIndex: PropTypes.number,
        clearPublicationResults: PropTypes.func
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
            publicationType: 0,
            doiSearchValue: ''
        };

        this.props.clearPublicationResults();
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

    handleSearch = values => {
        let value = values.get('doiSearch');
        if (isPubMedValue(value) || isPartialDOIValue(value) || isDOIValue(value)) {
            value = '';
        }

        this.setState({doiSearchValue: value}, this.handleNext);
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
        const buttonLabels = locale.global.labels.buttons;

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
                const showButton = !selectedPublicationType || (selectedPublicationType && selectedPublicationType.size === 0);

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

                            {showButton &&
                                <div style={{maxWidth: '1200px', margin: '24px auto', width: '90%', textAlign: 'right'}}>
                                    <RaisedButton
                                        label={buttonLabels.abandon}
                                        onTouchTap={this.cancelAddingRecord}/>
                                </div>
                            }

                            {/* TODO: fix this warning */}
                            {selectedPublicationType.size > 0
                                && selectedPublicationType.get('name').toLowerCase() === publicationTypeInformation.documentTypes.JOURNAL_ARTICLE
                                && <AddJournalArticleForm form="AddJournalArticleForm" suggestedFormTitle={this.state.doiSearchValue} />
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
                <h1 className="title is-3">{locale.pages.addRecord.title}</h1>

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
