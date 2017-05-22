import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';

import FileUploadDialog from '../containers/FileUploadDialog';

import './FileUpload.scss';


export default class FileUploadDropZone extends Component {

    static propTypes = {
        uploadFile: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            openDialog: false,
            acceptedFiles: null,
            rejectedFiles: null
        };
    }

    openDialog = (acceptedFiles, rejectedFiles) => {
        this.setState({
            dialogOpen: true,
            acceptedFiles,
            rejectedFiles
        });
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
                        <p className="sub-title">{fileInformation.subTitle}</p>
                        <div className="columns">
                            <div className="column">
                                <Dropzone onDrop={this.openDialog.bind(this)} style={{padding: '10px'}}>
                                    {fileInformation.fields.filenameRestrictions}
                                </Dropzone>
                            </div>
                        </div>
                    </CardText>
                </Card>

                <FileUploadDialog open={this.state.dialogOpen} acceptedFiles={this.state.acceptedFiles} rejectedFiles={this.state.rejectedFiles} />
            </div>
        );
    }
}
