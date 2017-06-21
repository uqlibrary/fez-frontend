/* eslint-disable */
import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import {HelpIcon, TextField, DatePicker} from 'uqlibrary-react-toolbox';
import {Authors, FileUploader, SelectField} from 'modules/SharedComponents';
import {validation, locale} from 'config';

import './AddJournalArticleForm.scss';

export default class AddJournalArticleForm extends Component {

    static propTypes = {
        authorList: PropTypes.object,
        cancelAddRecord: PropTypes.func,
        decreaseStep: PropTypes.func,
        fileMetadata: PropTypes.object,
        form: PropTypes.string.isRequired,
        formValues: PropTypes.object,
        handleSubmit: PropTypes.func,
        loadAuthorsList: PropTypes.func,
        loadPublicationSubTypesList: PropTypes.func,
        publicationSubTypeList: PropTypes.object,
        selectedAuthors: PropTypes.object,
        selectedPublicationId: PropTypes.object,
        submitRecordForApproval: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {loadAuthorsList, loadPublicationSubTypesList, selectedPublicationId} = this.props;
        loadPublicationSubTypesList(selectedPublicationId.get('id'));
        loadAuthorsList();

        // set focus to first input field
        rek_title
    }

    cancelAddingRecord = () => {
        const {cancelAddRecord, decreaseStep} = this.props;
        // go back to step 1
        decreaseStep();
        cancelAddRecord(locale.notifications.addRecord.cancelMessage);
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
        const {fileMetadata} = this.props;

        if (fileMetadata.size > 0) {
            const data = {'fez_record_search_key_file_attachment_name': []};

            Object.keys(fileMetadata.toJS()).map((file, index) => {
                data.fez_record_search_key_file_attachment_name.push({
                    'rek_file_attachment_name': file,
                    'rek_file_attachment_name_order': (index + 1)
                });
            });

            return data;
        }

        return {};
    };

    submitRecord = () => {
        const {decreaseStep, formValues, submitRecordForApproval} = this.props;
        const RECORD_TYPE = 3;
        const SUBMITTED_FOR_APPROVAL = 3;
        const JOURNAL_TYPE = 179;

        const defaultData = {
            rek_object_type: RECORD_TYPE,
            rek_status: SUBMITTED_FOR_APPROVAL,
            rek_display_type: JOURNAL_TYPE
        };

        const formData = formValues.toJS();

        // check if the date object is set otherwise default to today
        if (!formData.rek_date) {
            formData.rek_date = new Date();
        }

        const fileData = this.setFileData();
        const authorData = this.setAuthorData();
        const combinedData = Object.assign({}, defaultData, formData, fileData, authorData);

        submitRecordForApproval(combinedData, locale.notifications.addRecord.submitMessage);
        decreaseStep();
    };

    render() {
        // path to the locale data for each of the sections
        const journalArticleInformation = locale.pages.addRecord.addJournalArticle.journalArticleInformation;
        const authorsInformation = locale.pages.addRecord.addJournalArticle.authors;
        const optionalInformation = locale.pages.addRecord.addJournalArticle.optionalDetails;
        const buttonLabels = locale.global.labels.buttons;

        const {formValues, form, handleSubmit} = this.props;

        const DateTimeFormat = global.Intl.DateTimeFormat;

        return (
            <form onSubmit={handleSubmit(this.submitRecord)}>
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
                        <div className="columns is-gapless">
                            <Field component={TextField}
                                   autoFocus
                                   name="rek_title"
                                   type="text"
                                   fullWidth
                                   floatingLabelText={journalArticleInformation.fields.titleLabel}
                                   validate={[validation.required]}
                            />
                        </div>
                        <div className="columns is-gapless">
                            <div className="column is-two-thirds" style={{paddingTop: '0', paddingBottom: '0'}}>
                                <Field component={TextField}
                                       name="fez_record_search_key_journal_name.rek_journal_name"
                                       type="text" fullWidth
                                       floatingLabelText={journalArticleInformation.fields.nameLabel}
                                       validate={[validation.required]}
                                />
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
                        <div className="columns is-gapless">
                            <Field component={SelectField}
                                   name="rek_subtype"
                                   fullWidth
                                   floatingLabelText={journalArticleInformation.fields.publicationSubType}
                                   validate={[validation.required]}>
                                {
                                    this.props.publicationSubTypeList.map(item => (
                                    <MenuItem key={item.get('id')} value={item.get('label')} primaryText={item.get('label')}/>
                                    ))
                                }
                            </Field>
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
                        <Authors form={form} dataSource={this.props.authorList} authorFieldLabel={authorsInformation.fields.dropdownLabel} />
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
                                        <Field component={TextField} name="fez_record_search_key_volume_number.rek_volume_number" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.volumeLabel}/>
                                    </div>
                                    <div className="column">
                                        <Field component={TextField} name="fez_record_search_key_issue_number.rek_issue_number" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.issueLabel}/>
                                    </div>

                                    <div className="column">
                                        <Field component={TextField} name="fez_record_search_key_start_page.rek_start_page" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.startPageLabel}/>
                                    </div>
                                    <div className="column">
                                        <Field component={TextField} name="fez_record_search_key_end_page.rek_end_page" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.endPageLabel}/>
                                    </div>
                                </div>

                                <div className="columns">
                                    <div className="column is-textarea">
                                        <Field component={TextField} name="" type="text" fullWidth multiLine
                                               floatingLabelText={optionalInformation.fields.articleNumber}  />
                                    </div>
                                </div>


                                <div className="columns">
                                    <div className="column is-textarea">
                                        <Field component={TextField} name="fez_record_search_key_notes.rek_notes" type="text" fullWidth multiLine
                                               rows={1} floatingLabelText={optionalInformation.fields.notesLabel} />
                                    </div>
                                </div>
                    </CardText>
                </Card>

                {/* Files */}
                <FileUploader form="FileUploadForm" />

                <div className="buttonWrapper">
                    <RaisedButton label={buttonLabels.cancel} style={{marginLeft: '12px'}} onTouchTap={this.cancelAddingRecord}/>
                    <RaisedButton secondary label={buttonLabels.submitForApproval} style={{marginLeft: '12px'}} type="submit"/>
                </div>
            </form>
        );
    }
}
