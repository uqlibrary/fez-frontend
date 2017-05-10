import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import {locale} from '../../../../config';

export default class ClaimPublicationForm extends Component {

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

    handleSubTypeChange = (e, index, value) => {
        this.setState({subTypeValue: value});
    };

    render() {
        // path to the locale data for each of the sections
        const claimPublicationsInformation = locale.pages.claimPublications;
        const publicationDetailsInformation = claimPublicationsInformation.publicationDetails;
        const commentsInformation = claimPublicationsInformation.comments;
        const fileInformation = claimPublicationsInformation.files;
        const actionButtonsInformation = claimPublicationsInformation.formButtons;

        return (
            <div style={{marginBottom: '-60px'}}>
                <h1 className="page-title display-1">{claimPublicationsInformation.title}</h1>
                {/* Claim Publication */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{publicationDetailsInformation.title}</h2>
                            </div>
                            <div className="column">
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
                    <CardText className="body-1">
                        adsfasdfasfd
                    </CardText>
                </Card>

                {/* Files */}
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
                                <RaisedButton label={fileInformation.buttons.browseLabel} secondary/>
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

                {/* Buttons */}
                <Card className="layout-card">
                    <CardText className="body-1">
                        <div className="columns">
                            <div className="column is-narrow is-offset-two-thirds">
                                <FlatButton label={actionButtonsInformation.cancelLabel} secondary href="/claim-publications" />
                            </div>
                            <div className="column is-narrow">
                                <RaisedButton label={actionButtonsInformation.claimLabel} secondary/>
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}
