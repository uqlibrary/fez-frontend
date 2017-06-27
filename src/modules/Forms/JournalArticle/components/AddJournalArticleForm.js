import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
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
                { rek_ismemberof: MEMBER_OF }
            ]
        };

        const formData = formValues.toJS();

        // construct partial date
        formData.rek_date = new Date(
            parseInt(formData.partialDateYear, 10),
            formData.partialDateMonth ? parseInt(formData.partialDateMonth, 10) : 0,
            formData.partialDateDay ? parseInt(formData.partialDateDay, 10) : 1);

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

        const {form, handleSubmit} = this.props;

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
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField}
                                       autoFocus
                                       name="rek_title"
                                       type="text"
                                       fullWidth
                                       floatingLabelText={journalArticleInformation.fields.titleLabel}
                                       validate={[validation.required]}
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
                                               style={{width: '100%'}}
                                               fullWidth
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
                                    {
                                        this.props.publicationSubTypeList.map(item => (
                                            <MenuItem key={item.get('controlled_vocab').get('cvo_id')}
                                                      value={item.get('controlled_vocab').get('cvo_title')}
                                                      primaryText={item.get('controlled_vocab').get('cvo_title')}/>
                                        ))
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
                        <Authors form={form} dataSource={this.props.authorList}
                                 authorFieldLabel={authorsInformation.fields.dropdownLabel}/>
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
                                <Field component={TextField} name="fez_record_search_key_article_number.rek_article_number"
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
                                               name="fez_record_search_key_link.0.rek_link"
                                               type="text"
                                               fullWidth
                                               floatingLabelText={optionalInformation.fields.urlLabel}
                                               validate={[validation.url]}
                                        />
                                    </div>
                                </div>
                    </CardText>
                </Card>

                {/* Files */}
                <FileUploader form="FileUploadForm"/>

                <div className="buttonWrapper">
                    <FlatButton label={buttonLabels.cancel} style={{marginLeft: '12px'}}
                                  onTouchTap={this.cancelAddingRecord} secondary />
                    <RaisedButton secondary label={buttonLabels.submitForApproval} style={{marginLeft: '12px'}}
                                  type="submit"/>
                </div>
            </form>
        );
    }
}
