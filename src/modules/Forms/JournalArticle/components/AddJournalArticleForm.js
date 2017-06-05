import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import {AutoCompleteSelect, HelpIcon, TextField, DatePicker} from 'uqlibrary-react-toolbox';
import {Authors, FileUploader} from 'modules/SharedComponents';
import {locale} from 'config';

import './AddJournalArticleForm.scss';

export default class AddJournalArticleForm extends Component {

    static propTypes = {
        authorList: PropTypes.object,
        cancelAddRecord: PropTypes.func,
        fileMetadata: PropTypes.object,
        form: PropTypes.string.isRequired,
        formValues: PropTypes.object,
        handleSubmit: PropTypes.func,
        loadAuthorsList: PropTypes.func,
        loadPublicationSubTypesList: PropTypes.func,
        publicationSubTypeList: PropTypes.object,
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
    }

    cancelAddRecord = () => {
        // go back to step 1
        this.setState({stepIndex: 0});
        this.props.cancelAddRecord(locale.notifications.addRecord.cancelMessage);
    };

    getElementLabel = (elementData, elementKey, formData, formKey, matchedLabel) => {
        const matched = elementData.find(entry => {
            return entry[elementKey] === formData[formKey];
        });

        return matched ? {'rek_subtype': matched[matchedLabel]} : {};
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
        const {formValues, submitRecordForApproval} = this.props;
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
        const combinedData = Object.assign({}, defaultData, formData, tempData, fileData);

        console.log('combinedData', combinedData);

        submitRecordForApproval(combinedData, locale.notifications.addRecord.submitMessage);
    };

    render() {
        // path to the locale data for each of the sections
        const journalArticleInformation = locale.pages.addRecord.addJournalArticle.journalArticleInformation;
        const authorsInformation = locale.pages.addRecord.addJournalArticle.authors;
        const optionalInformation = locale.pages.addRecord.addJournalArticle.optionalDetails;
        const buttonLabels = locale.global.labels.buttons;

        const {formValues, form, handleSubmit} = this.props;
        const required = value => value && value.replace(/\s/, '').length > 0 ? undefined : 'This field is required';

        return (
            <form onSubmit={handleSubmit(this.submitRecord)}>
                {/* Journal Information */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{journalArticleInformation.title}</h2>
                            </div>
                            <div className="column">
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
                            <div className="column is-two-thirds">
                                <Field component={TextField} name="fez_record_search_key_journal_name.rek_journal_name" type="text" fullWidth
                                       floatingLabelText={journalArticleInformation.fields.nameLabel}/>
                            </div>
                            <div className="column">
                                <Field component={DatePicker}
                                       floatingLabelText={journalArticleInformation.fields.publishDateLabel}
                                       fullWidth
                                       name="rek_date"
                                />
                            </div>
                        </div>
                        <div className="columns">
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
                            <div className="column">
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
                            <div className="column">
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
                                       rows={5} floatingLabelText={optionalInformation.fields.notesLabel}/>
                            </div>
                        </div>
                    </CardText>
                </Card>

                {/* Files */}
                <FileUploader form="FileUploadForm" />

                <div className="buttonWrapper">
                    <RaisedButton label={buttonLabels.cancel} style={{marginLeft: '12px'}} onTouchTap={this.cancelAddRecord}/>
                    <RaisedButton secondary label={buttonLabels.submitForApproval} style={{marginLeft: '12px'}} type="submit"/>
                </div>
            </form>
        );
    }
}
