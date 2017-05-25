import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';

import {AutoCompleteSelect, HelpIcon, TextField, Authors} from 'uqlibrary-react-toolbox';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import {locale} from 'config';

import './AddJournalArticleForm.scss';

const formName = 'addJournalArticle';


export default class AddJournalArticleForm extends Component {

    static propTypes = {
        loadPublicationSubTypesList: PropTypes.func,
        publicationSubTypeList: PropTypes.object,
        loadAuthorsList: PropTypes.func,
        authorList: PropTypes.object,
        formValues: PropTypes.object,
        selectedPublicationId: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadPublicationSubTypesList(this.props.selectedPublicationId.get('id'));
        this.props.loadAuthorsList();
    }

    render() {
        // path to the locale data for each of the sections
        const journalArticleInformation = locale.pages.addRecord.addJournalArticle.journalArticleInformation;
        const authorsInformation = locale.pages.addRecord.addJournalArticle.authors;
        const optionalInformation = locale.pages.addRecord.addJournalArticle.optionalDetails;
        const fileInformation = locale.sharedComponents.files;

        const {formValues} = this.props;

        return (
            <div style={{marginBottom: '-60px'}}>
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
                            <Field component={TextField} name="journalTitle" type="text" fullWidth
                                   floatingLabelText={journalArticleInformation.fields.titleLabel}/>
                        </div>
                        <div className="columns">
                            <div className="column is-two-thirds">
                                <Field component={TextField} name="journalName" type="text" fullWidth
                                       floatingLabelText={journalArticleInformation.fields.nameLabel}/>
                            </div>
                            <div className="column">
                                <DatePicker floatingLabelText={journalArticleInformation.fields.publishDateLabel} fullWidth />
                            </div>
                        </div>
                        <div className="columns">
                            <Field component={AutoCompleteSelect}
                                   name="publicationSubType"
                                   fullWidth
                                   label={journalArticleInformation.fields.publicationTypeLabel}
                                   formValue={formValues.get('publicationSubType')}
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
                        <Authors form={formName} dataSource={this.props.authorList} authorFieldLabel={authorsInformation.fields.dropdownLabel} />
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
                                        <Field component={TextField} name="publicationVolume" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.volumeLabel}/>
                                    </div>
                                    <div className="column">
                                        <Field component={TextField} name="publicationIssue" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.issueLabel}/>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="columns">
                                    <div className="column">
                                        <Field component={TextField} name="publicationStartPage" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.startPageLabel}/>
                                    </div>
                                    <div className="column">
                                        <Field component={TextField} name="publicationEndPage" type="text" fullWidth
                                               floatingLabelText={optionalInformation.fields.endPageLabel}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField} name="publicationNotes" type="text" fullWidth multiLine
                                       rows={5} floatingLabelText={optionalInformation.fields.notesLabel}/>
                            </div>
                        </div>
                    </CardText>
                </Card>

                {/* Files */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{fileInformation.title}</h2>
                            </div>
                            <div className="column">
                                {fileInformation.help && (
                                    <HelpIcon
                                        title={fileInformation.help.title}
                                        text={fileInformation.help.text}
                                        buttonLabel={fileInformation.help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">

                        <div className="columns">
                            <div className="column">
                                <Field component={TextField} name="filesUpload" type="text"
                                       floatingLabelText={fileInformation.fields.filenameLabel} fullWidth/>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <RaisedButton label="Delete this and replace with component" secondary/>
                            </div>
                        </div>

                        {fileInformation.fields.filenameRestrictions}

                        <div className="columns">
                            <div className="column is-two-thirds">
                                <Field component={TextField} name="filesAccessConditions" type="text" fullWidth
                                       floatingLabelText={fileInformation.fields.accessConditionsLabel}/>
                            </div>
                            <div className="column">
                                <DatePicker floatingLabelText={fileInformation.fields.embargoDateLabel} fullWidth />
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField} name="filesDescription" type="text" fullWidth multiLine
                                       rows={3} floatingLabelText={fileInformation.fields.descriptionLabel}/>
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}
