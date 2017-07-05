import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import {Field, FormSection} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import {AddAuthors, FileUploader, SelectField} from 'modules/SharedComponents';
import {validation, locale} from 'config';

import {loadPublicationSubTypesList} from '../actions';
import {saveRecord, resetRecord} from 'actions';
import {resetStepper} from '../../../AddRecord/actions';
import {uploadFile} from '../../../SharedComponents/FileUploader/actions';
import {showDialogBox} from 'modules/App';


import './AddJournalArticleForm.scss';

export default class AddJournalArticleForm extends Component {

    static propTypes = {
        form: PropTypes.string.isRequired,
        formValues: PropTypes.object,
        handleSubmit: PropTypes.func,
        acceptedFiles: PropTypes.object,
        authorsList: PropTypes.object,
        hasOpenAccess: PropTypes.bool,
        isOpenAccessAccepted: PropTypes.bool,
        isUploadCompleted: PropTypes.bool,
        publicationSubTypeList: PropTypes.object,
        selectedPublicationId: PropTypes.object,
        recordSubmissionState: PropTypes.object,
        recordSubmissionErrorMessage: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch(resetRecord());
    }

    componentDidMount() {
        this.props.dispatch(loadPublicationSubTypesList(this.props.selectedPublicationId.get('id')));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isUploadCompleted) {
            this.tryRecordSave();
        }

        if (nextProps.recordSubmissionState.get('submitted')) {
            const dialogConfig = locale.pages.addRecord.addJournalArticle.dialog.success;
            this.props.dispatch(showDialogBox(dialogConfig));
            this.props.dispatch(resetStepper());
        }
    }

    cancelAddingRecord = () => {
        const dialogConfig = locale.pages.addRecord.addJournalArticle.dialog.cancel;
        this.props.dispatch(showDialogBox(dialogConfig));
    };

    setAuthorData = () => {
        const {authorsList} = this.props;

        if (authorsList.size > 0) {
            const data = {'fez_record_search_key_author': []};
            authorsList.toJS().map((author, index) => {
                data.fez_record_search_key_author.push({
                    'rek_author': author.name,
                    'rek_author_order': (index + 1)
                });
            });

            return data;
        }

        return {};
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

    tryRecordSave = () => {
        const {formValues} = this.props;

        // TODO: move these constants to a config, there will be more types -> keep it in one place
        const RECORD_TYPE = 3;
        const SUBMITTED_FOR_APPROVAL = 3;
        const DISPLAY_TYPE = 179;
        const MEMBER_OF = 'UQ:218198';

        const defaultData = {
            rek_object_type: RECORD_TYPE,
            rek_status: SUBMITTED_FOR_APPROVAL,
            rek_display_type: DISPLAY_TYPE,
            fez_record_search_key_ismemberof: [
                {rek_ismemberof: MEMBER_OF}
            ]
        };

        const formData = formValues.toJS();

        // construct partial date "YYYY-MM-DD"
        formData.rek_date = `${parseInt(formData.partialDateYear, 10)}-${formData.partialDateMonth ? (parseInt(formData.partialDateMonth, 10) + 1) : 1}-${formData.partialDateDay ? parseInt(formData.partialDateDay, 10) : 1 }`;

        // construct url value
        if (formData.publicationUrl) {
            formData.fez_record_search_key_link = [
                {
                    rek_link: formData.publicationUrl,
                    rek_link_order: 1
                }
            ];
        }

        const fileData = this.setFileData();
        const authorData = this.setAuthorData();
        const combinedData = Object.assign({}, defaultData, formData, fileData, authorData);

        this.props.dispatch(saveRecord(combinedData));
    };

    tryFileUpload = () => {
        if (this.props.acceptedFiles.size > 0) {
            this.props.dispatch(uploadFile(this.props.acceptedFiles));
        } else {
            // this.tryRecordSave();
        }
    };

    render() {
        // path to the locale data for each of the sections
        const journalArticleInformation = locale.pages.addRecord.addJournalArticle.journalArticleInformation;
        const authorsInformation = locale.sharedComponents.authors;
        const fileInformation = locale.sharedComponents.files;
        const optionalInformation = locale.pages.addRecord.addJournalArticle.optionalDetails;
        const buttonLabels = locale.global.labels.buttons;
        const {form, handleSubmit, recordSubmissionState, recordSubmissionErrorMessage} = this.props;
        console.log('submitting: ' + recordSubmissionState.get('submitting'));

        return (
            <form>
                {/* Journal Information */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title">{journalArticleInformation.title}</h2>
                            </div>
                            <div className="column is-narrow is-helpicon">
                                {journalArticleInformation.help && (
                                    <HelpIcon
                                        title={journalArticleInformation.help.title}
                                        text={journalArticleInformation.help.text}
                                        buttonLabel={journalArticleInformation.help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <div className="columns" style={{marginTop: '-12px'}}>
                            <div className="column">
                                <Field component={TextField}
                                       autoFocus
                                       name="rek_title"
                                       type="text"
                                       fullWidth
                                       floatingLabelText={journalArticleInformation.fields.titleLabel}
                                       validate={[validation.required]}
                                       style={{marginBottom: '-12px'}}
                                />
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column is-two-thirds">
                                <Field component={TextField}
                                       name="fez_record_search_key_journal_name.rek_journal_name"
                                       type="text" fullWidth
                                       floatingLabelText={journalArticleInformation.fields.nameLabel}
                                       validate={[validation.required]}
                                />
                            </div>
                            <div className="column">
                                <div className="columns">
                                    <div className="column">
                                        <Field component={TextField}
                                               name="partialDateDay"
                                               maxLength="2"
                                               type="text"
                                               style={{marginTop: '12px'}}
                                               fullWidth
                                               floatingLabelText="Day"
                                               floatingLabelFixed
                                               validate={[validation.dateTimeDay]}
                                        />
                                    </div>
                                    <div className="form-spacer"/>
                                    <div className="column">
                                        <Field component={SelectField}
                                               name="partialDateMonth"
                                               fullWidth
                                               style={{marginTop: '12px'}}
                                               floatingLabelText="Month"
                                               floatingLabelFixed>
                                            <MenuItem key={-1} value="-1" primaryText=""/>
                                            <MenuItem key={0} value="0" primaryText="January"/>
                                            <MenuItem key={1} value="1" primaryText="February"/>
                                            <MenuItem key={2} value="2" primaryText="March"/>
                                            <MenuItem key={3} value="3" primaryText="April"/>
                                            <MenuItem key={4} value="4" primaryText="May"/>
                                            <MenuItem key={5} value="5" primaryText="June"/>
                                            <MenuItem key={6} value="6" primaryText="July"/>
                                            <MenuItem key={7} value="7" primaryText="August"/>
                                            <MenuItem key={8} value="8" primaryText="September"/>
                                            <MenuItem key={9} value="9" primaryText="October"/>
                                            <MenuItem key={10} value="10" primaryText="November"/>
                                            <MenuItem key={11} value="11" primaryText="December"/>
                                        </Field>
                                    </div>
                                    <div className="form-spacer"/>
                                    <div className="column">
                                        <Field component={TextField}
                                               name="partialDateYear"
                                               type="text"
                                               fullWidth
                                               style={{marginTop: '12px'}}
                                               maxLength="4"
                                               floatingLabelText="Year"
                                               floatingLabelFixed
                                               validate={[validation.dateTimeYear]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field component={SelectField}
                                       name="rek_subtype"
                                       fullWidth
                                       floatingLabelText={journalArticleInformation.fields.publicationSubType}
                                       validate={[validation.required]}>
                                    <MenuItem
                                        primaryText={journalArticleInformation.fields.selectFirstPublicationSubTypeLabel}
                                        disabled/>
                                    {
                                        (this.props.publicationSubTypeList.map(item => (
                                            <MenuItem key={item.get('controlled_vocab').get('cvo_id')}
                                                      value={item.get('controlled_vocab').get('cvo_title')}
                                                      primaryText={item.get('controlled_vocab').get('cvo_title')}/>
                                        )))
                                    }
                                </Field>
                            </div>
                        </div>
                    </CardText>
                </Card>

                {/* Author Information */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title">{authorsInformation.title}</h2>
                            </div>
                            <div className="column is-narrow is-helpicon">
                                {authorsInformation.help && (
                                    <HelpIcon
                                        title={authorsInformation.help.title}
                                        text={authorsInformation.help.text}
                                        buttonLabel={authorsInformation.help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <AddAuthors/>
                    </CardText>
                </Card>

                {/* Optional publication details */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title">{optionalInformation.title}</h2>
                            </div>
                            <div className="column is-narrow is-helpicon">
                                {optionalInformation.help && (
                                    <HelpIcon
                                        title={optionalInformation.help.title}
                                        text={optionalInformation.help.text}
                                        buttonLabel={optionalInformation.help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField}
                                       name="fez_record_search_key_volume_number.rek_volume_number" type="text"
                                       fullWidth
                                       floatingLabelText={optionalInformation.fields.volumeLabel}/>
                            </div>
                            <div className="column">
                                <Field component={TextField} name="fez_record_search_key_issue_number.rek_issue_number"
                                       type="text" fullWidth
                                       floatingLabelText={optionalInformation.fields.issueLabel}/>
                            </div>

                            <div className="column">
                                <Field component={TextField} name="fez_record_search_key_start_page.rek_start_page"
                                       type="text" fullWidth
                                       floatingLabelText={optionalInformation.fields.startPageLabel}/>
                            </div>
                            <div className="column">
                                <Field component={TextField} name="fez_record_search_key_end_page.rek_end_page"
                                       type="text" fullWidth
                                       floatingLabelText={optionalInformation.fields.endPageLabel}/>
                            </div>
                        </div>

                        <div className="columns">
                            <div className="column">
                                <Field component={TextField}
                                       name="fez_record_search_key_article_number.rek_article_number"
                                       type="text" fullWidth multiLine
                                       floatingLabelText={optionalInformation.fields.articleNumber}/>
                            </div>
                        </div>

                        <div className="columns">
                            <div className="column">
                                <Field component={TextField} name="fez_record_search_key_notes.rek_notes" type="text"
                                       fullWidth multiLine
                                       rows={1} floatingLabelText={optionalInformation.fields.notesLabel}/>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField}
                                       name="publicationUrl"
                                       type="text"
                                       fullWidth
                                       floatingLabelText={optionalInformation.fields.urlLabel}
                                       validate={[validation.url, validation.maxLength255]}
                                />
                            </div>
                        </div>
                    </CardText>
                </Card>

                {/* Files */}
                <FormSection name={fileInformation.formSectionPrefix}>
                    <FileUploader/>
                </FormSection>

                {recordSubmissionState && recordSubmissionState.get('failed') &&
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title">Submission failed</h2>
                            </div>
                        </div>
                    </CardHeader>

                    <CardText className="body-1">
                        <div className="columns">
                            <div className="column">
                                {recordSubmissionErrorMessage && recordSubmissionErrorMessage.message &&
                                <p>{recordSubmissionErrorMessage.message}</p>}
                                <p> Review your data and try again. </p>
                            </div>
                        </div>
                    </CardText>
                </Card>
                }
                <div className="layout-card">
                    <div className="columns">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop" style={{marginBottom: 24}}>
                           <RaisedButton
                                fullWidth
                                label={buttonLabels.abandon}
                                onTouchTap={this.cancelAddingRecord}/>
                        </div>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                label={recordSubmissionState.get('submitting') ? buttonLabels.submissionInProgress : buttonLabels.submitForApproval}
                                disabled={recordSubmissionState.get('submitting')}
                                onClick={handleSubmit(this.tryFileUpload)}/>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
