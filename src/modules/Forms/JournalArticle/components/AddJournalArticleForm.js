import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import {AutoCompleteSelect, HelpIcon, TextField, DatePicker} from 'uqlibrary-react-toolbox';
import {AddAuthors} from 'modules/SharedComponents';
import {locale} from 'config';

import './AddJournalArticleForm.scss';

export default class AddJournalArticleForm extends Component {

    static propTypes = {
        authorsList: PropTypes.object,
        cancelAddRecord: PropTypes.func,
        decreaseStep: PropTypes.func,
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
        const {loadPublicationSubTypesList, selectedPublicationId} = this.props;
        loadPublicationSubTypesList(selectedPublicationId.get('id'));
    }

    cancelAddingRecord = () => {
        const {cancelAddRecord, decreaseStep} = this.props;
        // go back to step 1
        decreaseStep();
        cancelAddRecord(locale.notifications.addRecord.cancelMessage);
    };

    getElementLabel = (elementData, elementKey, formData, formKey, matchedLabel) => {
        const matched = elementData.find(entry => {
            return entry[elementKey] === formData[formKey];
        });

        return matched ? {'rek_subtype': matched[matchedLabel]} : {};
    };

    setAuthorData = () => {
        const {authorsList} = this.props;

        if (authorsList.size > 0) {
            const data = {'fez_record_search_key_author': []};
            authorsList.toJS().map((author, index) => {
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
        const tempData = this.getElementLabel(this.props.publicationSubTypeList.toJS(), 'id', formData, 'rek_subtype', 'label');

        // check if the date object is set otherwise default to today
        if (!formData.rek_date) {
            formData.rek_date = new Date();
        }

        // const fileData = this.setFileData();
        const fileData = {};
        const authorData = this.setAuthorData();

        const combinedData = Object.assign({}, defaultData, formData, tempData, fileData, authorData);

        submitRecordForApproval(combinedData, locale.notifications.addRecord.submitMessage);
        decreaseStep();
    };

    render() {
        // path to the locale data for each of the sections
        const journalArticleInformation = locale.pages.addRecord.addJournalArticle.journalArticleInformation;
        const authorsInformation = locale.sharedComponents.authors;
        const optionalInformation = locale.pages.addRecord.addJournalArticle.optionalDetails;
        const buttonLabels = locale.global.labels.buttons;

        const {formValues, form, handleSubmit} = this.props;
        const required = value => value && value.replace(/\s/, '').length > 0 ? undefined : 'This field is required';

        const DateTimeFormat = global.Intl.DateTimeFormat;

        return (
            <form>
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
                        <AddAuthors />
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
                <div className="buttonWrapper">
                    <RaisedButton label={buttonLabels.cancel} style={{marginLeft: '12px'}} onTouchTap={this.cancelAddingRecord}/>
                    {/* Moved the submit function onto this button so that hitting the enter key on a field can trigger other actions instead of a submit form */}
                    <RaisedButton secondary label={buttonLabels.submitForApproval} style={{marginLeft: '12px'}}  onClick={handleSubmit(this.submitRecord)}/>
                </div>
            </form>
        );
    }
}
