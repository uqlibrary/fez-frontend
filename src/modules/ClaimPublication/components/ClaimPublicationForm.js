import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field, FormSection} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';

import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import {locale} from 'config';
import {FileUploader, SubmissionErrorMessage, AuthorLinking} from 'modules/SharedComponents';
import {showDialogBox} from 'modules/App';

import {uploadFile} from 'modules/SharedComponents/FileUploader/actions';
import {SearchResultsRow} from 'modules/SearchResults';

export default class ClaimPublicationForm extends Component {

    static propTypes = {
        acceptedFiles: PropTypes.object,
        claimPublicationResults: PropTypes.object,
        claimPublication: PropTypes.func,
        dispatch: PropTypes.func,
        formValues: PropTypes.object,
        handleSubmit: PropTypes.func,
        history: PropTypes.object,
        isUploadCompleted: PropTypes.bool,
        location: PropTypes.object,
        recordClaimState: PropTypes.object,
        recordClaimErrorMessage: PropTypes.object,
        selectedAuthorId: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedPublication: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isUploadCompleted) {
            this.tryRecordSave();
        }

        if (nextProps.recordClaimState && nextProps.recordClaimState.get('submitted')) {
            const dialogConfig = locale.pages.claimPublications.form.dialog.success;
            this.props.dispatch(showDialogBox(dialogConfig));
        }
    }

    cancelClaimPublication = () => {
        const dialogConfig = locale.pages.claimPublications.form.dialog.cancel;
        this.props.dispatch(showDialogBox(dialogConfig));
    };

    getCurrentArticle = () => {
        const {claimPublicationResults, location} = this.props;
        const articleId = location.pathname.replace(`${locale.pages.claimPublications.claimUrl}/`, '');
        const article = claimPublicationResults.get('rows').filter(article => article.get('rek_pid') === articleId);

        // found the article so load it
        return article.size === 1 ? article.get(0) : null;
    };

    setFileData = () => {
        const {acceptedFiles} = this.props;

        if (acceptedFiles.size > 0) {
            const data = {'fez_record_search_key_file_attachment_name': []};
            acceptedFiles.toJS().map((file, index) => {
                data.fez_record_search_key_file_attachment_name.push({
                    'rek_file_attachment_name': file.name,
                    'rek_file_attachment_name_order': (index + 1)
                });
            });

            return data;
        }

        return {};
    };

    tryFileUpload = () => {
        const {acceptedFiles, dispatch} = this.props;
        if (acceptedFiles.size > 0) {
            dispatch(uploadFile(acceptedFiles));
        } else {
            this.tryRecordSave();
        }
    };

    tryRecordSave = () => {
        const {claimPublication, formValues, selectedAuthorId} = this.props;
        const source = this.getCurrentArticle();

        const publicationData = {
            pid: source.get('rek_pid'),
            comments: formValues.get('comments')
        };

        // if in the event that the user has to manually link the author name to their account
        const authorId = selectedAuthorId ? {author_id: selectedAuthorId} : {};
        const fileData = this.setFileData();
        const combinedData = Object.assign({}, publicationData, fileData, authorId);

        claimPublication(combinedData);
    };

    render() {
        // detects if something is trying to go to /claim-publications/:id. For now we just redirect back to the claim-publications page
        if (this.props.claimPublicationResults.size === 0) {
            return (<Redirect to="/claim-publications" />);
        }

        // path to the locale data for each of the sections
        const claimPublicationsInformation = locale.pages.claimPublications.form;
        const publicationDetailsInformation = claimPublicationsInformation.publicationDetails;
        const commentsInformation = claimPublicationsInformation.comments;
        const fileInformation = locale.sharedComponents.files;
        const authorLinkingInformation = locale.pages.claimPublications.authorLinking;
        const buttonLabels = locale.global.labels.buttons;

        // TODO: Put this data structure into a central location
        const source = this.getCurrentArticle();
        const INDEX = 0;
        const authors = source.get('fez_record_search_key_author') ? source.get('fez_record_search_key_author') : null;
        const entry = {
            INDEX,
            id: source.get('rek_pid'),
            title: source.get('rek_title'),
            journalName: source.get('fez_record_search_key_journal_name') ? source.get('fez_record_search_key_journal_name').get('rek_journal_name') : null,
            authors: authors,
            publisher: source.get('fez_record_search_key_publisher') ? source.get('fez_record_search_key_publisher') : null,
            volumeNumber: source.get('fez_record_search_key_volume_number') ? source.get('fez_record_search_key_volume_number').get('rek_volume_number') : null,
            issueNumber: source.get('fez_record_search_key_issue_number') ? source.get('fez_record_search_key_issue_number').get('rek_issue_number') : null,
            startPage: source.get('fez_record_search_key_start_page') ? source.get('fez_record_search_key_start_page').get('rek_start_page') : null,
            endPage: source.get('fez_record_search_key_end_page') ? source.get('fez_record_search_key_end_page').get('rek_end_page') : null,
            doi: source.get('fez_record_search_key_doi') ? source.get('fez_record_search_key_doi').get('rek_doi') : null,
            counts: {
                thomson: source.get('rek_thomson_citation_count')
            }
        };

        const {handleSubmit, recordClaimState, recordClaimErrorMessage} = this.props;

        return (
            <form style={{marginBottom: '-60px'}}>
                <h1 className="page-title display-1">{claimPublicationsInformation.title}</h1>
                {/* Claim Publication */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline" style={{marginBottom: '30px'}}>{publicationDetailsInformation.title}</h2>
                            </div>
                            <div className="column is-narrow">
                                {publicationDetailsInformation.help && (
                                    <HelpIcon
                                        title={publicationDetailsInformation.help.title}
                                        text={publicationDetailsInformation.help.text}
                                        buttonLabel={publicationDetailsInformation.help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1" style={{padding: '0px'}}>
                        <SearchResultsRow entry={entry} form="ClaimPublicationForm" hideClaimButton />
                    </CardText>
                </Card>

                <FormSection name={authorLinkingInformation.formSectionPrefix}>
                    <AuthorLinking dataSource={authors} />
                </FormSection>

                {/* Comments */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns">
                            <div className="column">
                                <h2 className="headline">{commentsInformation.title}</h2>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField} name="comments" type="text" fullWidth multiLine
                                       rows={3} floatingLabelText={commentsInformation.fields.descriptionLabel}/>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Files */}
                <FormSection name={fileInformation.formSectionPrefix}>
                    <FileUploader />
                </FormSection>

                <SubmissionErrorMessage
                    submissionState={recordClaimState}
                    submissionErrorMessage={recordClaimErrorMessage} />

                {/* Buttons */}
                <div className="layout-card">
                    <div className="columns">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop" style={{marginBottom: 24}}>
                            <RaisedButton
                                fullWidth
                                disabled={recordClaimState && recordClaimState.get('submitting')}
                                label={locale.global.labels.buttons.cancel}
                                onTouchTap={this.cancelClaimPublication}/>
                        </div>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                label={recordClaimState && recordClaimState.get('submitting') ? buttonLabels.submissionInProgress : buttonLabels.claimPublication}
                                disabled={recordClaimState && recordClaimState.get('submitting')}
                                onClick={handleSubmit(this.tryFileUpload)} />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
