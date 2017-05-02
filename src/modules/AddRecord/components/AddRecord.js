import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';

import {Step, Stepper, StepLabel} from 'material-ui/Stepper';

// forms & custom components
import {PublicationSearchForm} from '../../Forms';
import {SearchResults} from '../../SearchResults';
import {NoMatchingRecords} from '../../NoMatchingRecords';
import {PublicationTypeForm} from '../../Forms/PublicationType';
import {AddJournalArticleForm} from '../../Forms/JournalArticle';

import './AddRecord.scss';

class addRecord extends React.Component {

    static propTypes = {
        searchResultsList: PropTypes.object,
        selectedPublicationType: PropTypes.object,
        loadPublicationTypesList: PropTypes.func,
        publicationTypeList: PropTypes.object
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

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                const help = {
                    title: 'No matching records',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                };

                return (
                    <PublicationSearchForm onSubmit={this.handleNext}
                                           title="Search for your publication"
                                           explanationText="Enter either the publication Doi (e.g. 10.1163/9789004326828), Pubmed Id (e.g. 28131963) or the title of the publication. This will allow us to check whether the record is already in eSpace or is available from another source."
                                           defaultSearchFieldLabel="Enter Doi, Pubmed Id or Title"
                                           defaultButtonLabel="Enter Doi, Pubmed Id or Title"
                                           help={help}
                                           />
                );
            case 1:
                const searchResultHelp = {
                    title: 'Search Results',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                };

                const noMatchingRecordsHelp = {
                    title: 'No matching records',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                };

                return (
                    <div>
                        { this.props.searchResultsList.size > 0 &&
                        <SearchResults
                            dataSource={this.props.searchResultsList}
                            title="Possible matches found"
                            explanationText='Top [noOfResults] matches displayed below. To refine your search and narrow down results, please click the "search again" button below - or create a new record.'
                            claimRecordBtnLabel="Claim This Record"
                            help={searchResultHelp}
                        />
                        }

                        <NoMatchingRecords
                            handleNext={this.handleNext}
                            handlePrevious={this.handlePrev}
                            stepIndex={this.state.stepIndex}
                            title="No matching records?"
                            explanationText="Refine your search and narrow down results, or create a new eSpace record for your publication."
                            searchAgainBtnLabel="Search again"
                            addPublicationBtnLabel="Add a new publication"
                            help={noMatchingRecordsHelp}
                        />

                        <ReactTooltip id="claimTooltips" effect="solid" place="bottom"/>
                    </div>
                );
            case 2:
                const {selectedPublicationType} = this.props;
                const popularTypesList = ['Book', 'Book Chapter', 'Conference Paper', 'Journal Article'];
                const submitActions = [
                    <FlatButton
                        label="Ok"
                        primary
                        onTouchTap={this.handleCloseSubmitForApproval}
                    />];

                const saveActions = [
                    <FlatButton
                        label="Ok"
                        primary
                        onTouchTap={this.handleCloseSaveForLater}
                    />];

                const PublicationTypeFormHelp = {
                    title: 'Add your publication',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                };

                return (
                    <PublicationTypeForm
                        title="Add your publication"
                        help={PublicationTypeFormHelp}
                        maxSearchResults={10}
                        publicationTypeLabel="Select a publication type"
                        dataSource={this.props.publicationTypeList}
                        popularTypesList={popularTypesList}>

                        {/* Journal Article is selected */}
                        {selectedPublicationType.get('name') === 'Journal Article' &&
                            <AddJournalArticleForm />
                        }

                        {selectedPublicationType.get('name') === 'Journal Article' &&
                            <div className="buttonWrapper">
                                <RaisedButton label="Save for Later" style={{marginLeft: '12px'}}
                                              onTouchTap={this.handleOpenSaveForLater}/>
                                <RaisedButton label="Cancel" style={{marginLeft: '12px'}}/>
                                <RaisedButton secondary label="Submit for Approval" style={{marginLeft: '12px'}}
                                              onTouchTap={this.handleOpenSubmitForApproval}/>
                                <Dialog
                                    actions={submitActions}
                                    modal={false}
                                    open={this.state.submitOpen}
                                    onRequestClose={this.handleCloseSubmitForApproval}
                                >
                                    Your Journal has been submitted for approval.
                                </Dialog>
                                <Dialog
                                    actions={saveActions}
                                    modal={false}
                                    open={this.state.saveOpen}
                                    onRequestClose={this.handleCloseSaveForLater}
                                >
                                    Your Journal has been saved for later.
                                </Dialog>
                            </div>
                        }
                    </PublicationTypeForm>
                );
            default:
                return 'Error';
        }
    }

    resetExample = (event) => {
        event.preventDefault();
        this.setState({stepIndex: 0, finished: false});
    };

    renderContent() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px', overflow: 'hidden'};

        if (finished) {
            return (
                <div style={contentStyle}>
                    <p>
                        <FlatButton
                            label="Click here to reset the example."
                            onClick={this.resetExample} />
                    </p>
                </div>
            );
        }

        return (
            <div style={contentStyle}>
                <div>{this.getStepContent(stepIndex)}</div>
                <div style={{marginTop: 24, marginBottom: 12, display: 'none'}}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label={stepIndex === 2 ? 'Finish' : 'Next'}
                        primary
                        onTouchTap={this.handleNext}
                    />
                </div>
            </div>
        );
    }

    render() {
        const {loading} = this.state;
        return (
            <div className="layout-fill">
                <h1 className="page-title display-1">Add a journal article</h1>

                {/* Stepper start */}
                <Stepper activeStep={this.state.stepIndex} style={{padding: '0 25px', margin: '-10px auto' }} onChange={this.handleNext}>
                    <Step>
                        <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>Search for your publication</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>Search results</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>Claim or Add your publication</StepLabel>
                    </Step>
                </Stepper>


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
