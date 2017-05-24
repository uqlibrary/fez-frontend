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
        openDialog: PropTypes.func,
        setAcceptedFileList: PropTypes.func,
        showSnackbar: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            filesToUpload: null,
            rejectedFiles: null
        };
    }

    openDialog = (acceptedFiles, rejectedFiles) => {
        const maxNumberOfFiles = locale.sharedComponents.files.limit;
        let filesToUpload = acceptedFiles;

        // check if the user has more than the maximum of files uploaded
        if (acceptedFiles.length > maxNumberOfFiles) {
            // alert user they're trying to upload more than files than maxNumberOfFiles
            const msg = locale.sharedComponents.files.messages.maxFiles.replace('[maxNumberOfFiles]', maxNumberOfFiles);
            this.props.showSnackbar(msg);

            // only allow maxNumberOfFiles to upload
            filesToUpload = acceptedFiles.slice(0, maxNumberOfFiles);
        }

        // acceptedFiles.map(file => {
        //     if (file.name.match(/^[a-zA-Z][a-zA-Z0-9_]*[\.][a-z0-9]+$/)) {
        //         console.log('good file', file.name);
        //     } else {
        //         console.log('bad file', file.name);
        //     }
        // });

        this.setState({
            filesToUpload,
            rejectedFiles
        });

        this.props.setAcceptedFileList(filesToUpload);

        this.props.openDialog();
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

                <FileUploadDialog acceptedFiles={this.state.filesToUpload} rejectedFiles={this.state.rejectedFiles} />
            </div>
        );
    }
}
