import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field, FormSection} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import {AutoCompleteSelect, HelpIcon, TextField, DatePicker} from 'uqlibrary-react-toolbox';
import {Authors, FileUploader} from 'modules/SharedComponents';
import {locale} from 'config';

import './AddJournalArticleForm.scss';

export default class AddJournalArticleForm extends Component {

    static propTypes = {
        authorList: PropTypes.object,
        acceptedFiles: PropTypes.object,
        cancelAddRecord: PropTypes.func,
        completeFormSubmission: PropTypes.func,
        decreaseStep: PropTypes.func,
        form: PropTypes.string.isRequired,
        formValues: PropTypes.object,
        handleSubmit: PropTypes.func,
        hasOpenAccess: PropTypes.bool,
        isOpenAccessAccepted: PropTypes.bool,
        isUploadCompleted: PropTypes.bool,
        loadAuthorsList: PropTypes.func,
        loadPublicationSubTypesList: PropTypes.func,
        publicationSubTypeList: PropTypes.object,
        resetFormSubmissionFlag: PropTypes.func,
        selectedAuthors: PropTypes.object,
        selectedPublicationId: PropTypes.object,
        showSnackbar: PropTypes.func,
        submitRecordForApproval: PropTypes.func,
        uploadFile: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {loadAuthorsList, loadPublicationSubTypesList, resetFormSubmissionFlag, selectedPublicationId} = this.props;
        loadPublicationSubTypesList(selectedPublicationId.get('id'));
        loadAuthorsList();
        resetFormSubmissionFlag();
    }

    componentWillUpdate(nextProps) {
        // this is for when we do a file upload
        // we want to redirect once the file upload is complete
        if (nextProps.isUploadCompleted) {
            const {showSnackbar, decreaseStep} = this.props;
            showSnackbar(locale.notifications.addRecord.submitMessage);
            decreaseStep();
        }
    }

    cancelAddingRecord = () => {
        const {cancelAddRecord, decreaseStep} = this.props;
        cancelAddRecord(locale.notifications.addRecord.cancelMessage);
        decreaseStep();
    };

    getElementLabel = (elementData, elementKey, formData, formKey, matchedLabel) => {
        const matched = elementData.find(entry => {
            return entry[elementKey] === formData[formKey];
        });

        return matched ? {'rek_subtype': matched[matchedLabel]} : {};
    };

    setAuthorData = () => {
        const {selectedAuthors} = this.props;

        if (selectedAuthors.size > 0) {
            const data = {'fez_record_search_key_author': []};
            selectedAuthors.toJS().map((author, index) => {
                data.fez_record_search_key_author.push({
                    'rek_author': author.aut_display_name,
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

    submitRecord = () => {
        const {acceptedFiles, decreaseStep, formValues, showSnackbar, submitRecordForApproval, uploadFile} = this.props;

        const RECORD_TYPE = 3;
        const SUBMITTED_FOR_APPROVAL = 3;
        const JOURNAL_TYPE = 179;

        const defaultData = {
            rek_object_type: RECORD_TYPE,
            rek_status: SUBMITTED_FOR_APPROVAL,
            rek_display_type: JOURNAL_TYPE
        };

        const formData = formValues.toJS();
        const tempData = this.getElementLabel(this.props.publicationSubTypeList.toJS(), 'id', formData, 'rek_subtype', 'label');

        // check if the date object is set otherwise default to today
        if (!formData.rek_date) {
            formData.rek_date = new Date();
        }

        const fileData = this.setFileData();
        const authorData = this.setAuthorData();
        const combinedData = Object.assign({}, defaultData, formData, tempData, fileData, authorData);

        // this flag is for those cases where we want the 'Your submission was successful' message
        // to only appear once the files were successfully uploaded
        const hasFilesToUpload = acceptedFiles.size > 0;
        submitRecordForApproval(combinedData);

        if (hasFilesToUpload) {
            uploadFile(acceptedFiles);
        }

        if (!hasFilesToUpload) {
            showSnackbar(locale.notifications.addRecord.submitMessage);
            decreaseStep();
        }
    };

    render() {
        // path to the locale data for each of the sections
        const journalArticleInformation = locale.pages.addRecord.addJournalArticle.journalArticleInformation;
        const authorsInformation = locale.pages.addRecord.addJournalArticle.authors;
        const optionalInformation = locale.pages.addRecord.addJournalArticle.optionalDetails;
        const buttonLabels = locale.global.labels.buttons;

        const {formValues, form, handleSubmit} = this.props;
        const required = value => value && value.replace(/\s/, '').length > 0 ? undefined : 'This field is required';
        const DateTimeFormat = global.Intl.DateTimeFormat;

        return (
            <form onSubmit={handleSubmit(this.submitRecord)}>
                {/* Journal Information */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{journalArticleInformation.title}</h2>
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
                        <div className="columns is-gapless">
                            <Field component={TextField}
                                   name="rek_title"
                                   type="text"
                                   fullWidth
                                   floatingLabelText={journalArticleInformation.fields.titleLabel}
                                   validate={[required]}
                            />
                        </div>
                        <div className="columns">
                            <div className="column is-two-thirds" style={{paddingTop: '0', paddingBottom: '0'}}>
                                <Field component={TextField} name="fez_record_search_key_journal_name.rek_journal_name" type="text" fullWidth
                                       floatingLabelText={journalArticleInformation.fields.nameLabel}/>
                            </div>
                            <div className="column" style={{paddingTop: '0', paddingBottom: '0'}}>
                                <Field component={DatePicker}
                                       floatingLabelText={journalArticleInformation.fields.publishDateLabel}
                                       fullWidth
                                       locale="en-AU"
                                       DateTimeFormat={DateTimeFormat}
                                       name="rek_date"
                                />
                            </div>
                        </div>
                        <div className="columns" style={{paddingTop: '0', paddingBottom: '0'}}>
                            <Field component={AutoCompleteSelect}
                                   name="rek_subtype"
                                   fullWidth
                                   label={journalArticleInformation.fields.publicationTypeLabel}
                                   formValue={formValues.get('rek_subtype')}
                                   dataSource={[].concat(this.props.publicationSubTypeList.toJS())}
                                   dataSourceConfig={{text: 'label', value: 'id'}}
                            />
                        </div>
                    </CardText>
                </Card>

                {/* Author Information */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{authorsInformation.title}</h2>
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
                        <Authors form={form} dataSource={this.props.authorList} authorFieldLabel={authorsInformation.fields.dropdownLabel} />
                    </CardText>
                </Card>

                {/* Optional publication details */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{optionalInformation.title}</h2>
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
                                <div className="columns">
                                    <div className="column">
                                        <Field component={TextField} name="fez_record_search_key_volume_number.rek_volume_number" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.volumeLabel}/>
                                    </div>
                                    <div className="column">
                                        <Field component={TextField} name="fez_record_search_key_issue_number.rek_issue_number" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.issueLabel}/>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="columns">
                                    <div className="column">
                                        <Field component={TextField} name="fez_record_search_key_start_page.rek_start_page" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.startPageLabel}/>
                                    </div>
                                    <div className="column">
                                        <Field component={TextField} name="fez_record_search_key_end_page.rek_end_page" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.endPageLabel}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField} name="fez_record_search_key_notes.rek_notes" type="text" fullWidth multiLine
                                       rows={5} floatingLabelText={optionalInformation.fields.notesLabel} style={{marginTop: '-36px'}} />
                            </div>
                        </div>
                    </CardText>
                </Card>

                {/* Files */}
                <FormSection name="fileUploader">
                    <FileUploader />
                </FormSection>

                <div className="buttonWrapper">
                    <RaisedButton
                        label={buttonLabels.abandon}
                        style={{marginLeft: '12px'}}
                        onTouchTap={this.cancelAddingRecord} />
                    <RaisedButton
                        secondary
                        label={buttonLabels.submitForApproval}
                        style={{marginLeft: '12px'}}
                        type="submit" />
                </div>
            </form>
        );
    }
}
