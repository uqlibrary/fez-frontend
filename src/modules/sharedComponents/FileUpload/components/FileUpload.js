import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import {locale} from 'config';

import './FileUpload.scss';


export default class FileUpload extends Component {

    static propTypes = {
        uploadFile: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    uploadFile = (acceptedFiles) => {
        acceptedFiles.map(file => {
            if (file.name.match(/^[a-zA-Z][a-zA-Z0-9_]*[\.][a-z0-9]+$/)) {
                console.log('good file', file.name);
            } else {
                console.log('bad file', file.name);
            }
        });

        // this.props.uploadFile(acceptedFiles);
    };

    render() {
        const fileInformation = locale.sharedComponents.files;

        return (
            <div style={{marginBottom: '-60px'}}>
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
                                <Dropzone onDrop={this.uploadFile.bind(this)} style={{background: '#d8d8d8', padding: '10px', textAlign: 'center'}}>
                                    <p>Drop your files here</p>
                                </Dropzone>
                                {fileInformation.fields.filenameRestrictions}
                            </div>
                        </div>
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
            </div>
        );
    }
}
