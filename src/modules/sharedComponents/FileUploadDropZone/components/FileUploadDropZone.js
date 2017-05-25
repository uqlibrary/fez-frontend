import React, {PureComponent} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

// custom components
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import FileUploadDialog from '../containers/FileUploadDialog';
import './FileUpload.scss';

export default class FileUploadDropZone extends PureComponent {

    static propTypes = {
        form: PropTypes.string.isRequired,
        openDialog: PropTypes.func,
        showSnackbar: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            filesToUpload: [],
            rejectedFiles: []
        };
    }

    openDialog = (acceptedFiles, rejectedFiles) => {
        const fileInformation = locale.sharedComponents.files;
        const {validFiles, invalidFiles} = this.validateNumberOfFiles(acceptedFiles, rejectedFiles);
        const {filesToUpload, filesToReject} = this.validateFilenameFormat(validFiles, invalidFiles);

        this.setState({
            filesToUpload
        });

        if (filesToReject.length > 0) {
            const msg = fileInformation.messages.rejectedFiles.replace('[numberOfRejectedFiles]', filesToReject.length);
            this.props.showSnackbar(msg);
        }

        if (filesToUpload.length > 0) {
            this.props.openDialog();
        } else {
            this.props.showSnackbar(fileInformation.messages.acceptedFiles);
        }
    };

    validateFilenameFormat = (acceptedFiles, rejectedFiles) => {
        const filesToUpload = [];
        const filesToReject = rejectedFiles;

        acceptedFiles.map(file => {
            if (file.name.match(/^[a-zA-Z][a-zA-Z0-9_]*[.][a-z0-9]+$/)) {
                filesToUpload.push(file);
            } else {
                filesToReject.push(file);
            }
        });

        return {filesToUpload, filesToReject};
    };

    validateNumberOfFiles = (acceptedFiles, rejectedFiles) => {
        const fileInformation = locale.sharedComponents.files;
        const maxNumberOfFiles = fileInformation.limit;
        let validFiles = acceptedFiles;
        let invalidFiles = rejectedFiles;

        // check if the user has more than the maximum of files uploaded
        if (acceptedFiles.length > maxNumberOfFiles) {
            // alert user they're trying to upload more than files than maxNumberOfFiles
            const msg = fileInformation.messages.maxFiles.replace('[maxNumberOfFiles]', maxNumberOfFiles);
            this.props.showSnackbar(msg);

            // only allow maxNumberOfFiles to upload
            validFiles = acceptedFiles.slice(0, maxNumberOfFiles);

            // push to the array of rejected files
            invalidFiles = acceptedFiles.slice(maxNumberOfFiles);
        }

        return {validFiles, invalidFiles};
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

                <FileUploadDialog form={this.props.form} acceptedFiles={this.state.filesToUpload} />
            </div>
        );
    }
}
