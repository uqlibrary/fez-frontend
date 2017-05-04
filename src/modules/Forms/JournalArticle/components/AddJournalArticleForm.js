import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';

import {HelpIcon, TextField, Authors} from 'uqlibrary-react-toolbox';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {locale} from '../../../../config';

import './AddJournalArticleForm.scss';

const formName = 'addJournalArticle';


export default class AddJournalArticleForm extends Component {

    static propTypes = {
        loadPublicationSubTypesList: PropTypes.func,
        publicationSubTypeList: PropTypes.object,
        loadAuthorsList: PropTypes.func,
        authorList: PropTypes.object
    };

    constructor(props) {
        super(props);

        // setup the state
        this.state = {
            subTypeValue: 1,
        };
    }

    componentDidMount() {
        this.props.loadPublicationSubTypesList();
        this.props.loadAuthorsList();
    }

    handleSubTypeChange = (e, index, value) => {
        this.setState({subTypeValue: value});
    };

    render() {
        const {publicationSubTypeList} = this.props;
        const subtypeItems = publicationSubTypeList.valueSeq().map((subtypes) => {
            return (<MenuItem value={subtypes.get('id')} key={subtypes.get('id')} primaryText={subtypes.get('label')}/>);
        });

        // path to the locale data for each of the sections
        const journalArticleInformation = locale.pages.addRecord.addJournalArticle.journalArticleInformation;
        const authorsInformation = locale.pages.addRecord.addJournalArticle.authors;
        const optionalInformation = locale.pages.addRecord.addJournalArticle.optionalDetails;
        const fileInformation = locale.pages.addRecord.addJournalArticle.files;

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
                        <div className="flex">
                            <Field component={TextField} name="journalTitle" type="text" fullWidth
                                   floatingLabelText={journalArticleInformation.fields.titleLabel}/>
                        </div>
                        <div className="row-sm column align-stretch align-center-sm">
                            <div className="flex inputPadding">
                                <Field component={TextField} name="journalName" type="text" fullWidth
                                       floatingLabelText={journalArticleInformation.fields.nameLabel}/>
                            </div>
                            <div className="flex">
                                <DatePicker floatingLabelText={journalArticleInformation.fields.publishDateLabel} textFieldStyle={{width: '100%'}}
                                            style={{width: '100%'}}/>
                            </div>
                        </div>
                        <div className="flex">
                            <SelectField
                                floatingLabelText={journalArticleInformation.fields.publicationTypeLabel}
                                value={this.state.subTypeValue}
                                onChange={this.handleSubTypeChange}
                                style={{width: '100%'}}
                            >
                                {subtypeItems}
                            </SelectField>
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
                        <div className="row-sm column align-stretch align-center-sm">
                            <div className="flex inputPadding">
                                <Field component={TextField} name="publicationVolume" type="text" fullWidth
                                       floatingLabelText={optionalInformation.fields.volumeLabel}/>
                            </div>
                            <div className="flex inputPadding">
                                <Field component={TextField} name="publicationIssue" type="text" fullWidth
                                       floatingLabelText={optionalInformation.fields.issueLabel}/>
                            </div>
                        </div>
                        <div className="row-sm column align-stretch align-center-sm">
                            <div className="flex inputPadding">
                                <Field component={TextField} name="publicationStartPage" type="text" fullWidth
                                       floatingLabelText={optionalInformation.fields.startPageLabel}/>
                            </div>
                            <div className="flex">
                                <Field component={TextField} name="publicationEndPage" type="text" fullWidth
                                       floatingLabelText={optionalInformation.fields.endPageLabel}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="flex">
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

                        <div className="row">
                            <div className="flex" style={{marginTop: '16px', flex: '0 0 140px'}}>
                                <RaisedButton label={fileInformation.buttons.browseLabel} secondary/>
                            </div>
                            <div className="flex" style={{marginTop: '-10px'}}>
                                <Field component={TextField} name="filesUpload" type="text"
                                       floatingLabelText={fileInformation.fields.filenameLabel} fullWidth/>
                            </div>
                        </div>

                        {fileInformation.fields.filenameRestrictions}

                        <div className="row-sm column align-stretch align-center-sm">
                            <div className="flex inputPadding">
                                <Field component={TextField} name="filesAccessConditions" type="text" fullWidth
                                       floatingLabelText={fileInformation.fields.accessConditionsLabel}/>
                            </div>
                            <div className="flex">
                                <DatePicker floatingLabelText={fileInformation.fields.embargoDateLabel} textFieldStyle={{width: '100%'}}
                                            style={{width: '100%'}}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="flex">
                                <Field component={TextField} name="filesDescription" type="text" fullWidth multiLine
                                       rows={5} floatingLabelText={fileInformation.fields.descriptionLabel}/>
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}
