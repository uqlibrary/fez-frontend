import React, {PureComponent} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

// custom components
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import FileUploadDialog from '../containers/FileUploadDialog';
import UploadedFileMetadata from '../containers/UploadedFileMetadata';
import './FileUpload.scss';

export default class FileUploadDropZone extends PureComponent {

    static propTypes = {
        form: PropTypes.string.isRequired,
        fileMetadata: PropTypes.object,
        isUploadCompleted: PropTypes.bool,
        openDialog: PropTypes.func,
        setAcceptedFileList: PropTypes.func,
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
        let [validFiles, invalidFiles] = this.validateNumberOfFiles(acceptedFiles, rejectedFiles);
        [validFiles, invalidFiles] = this.validateFilenameFormat(validFiles, invalidFiles);
        const filesToUpload = this.validateFileMetaIsNull(validFiles);

        this.setState({
            filesToUpload
        });

        if (invalidFiles.length > 0) {
            const msg = fileInformation.messages.rejectedFiles.replace('[numberOfRejectedFiles]', invalidFiles.length);
            this.props.showSnackbar(msg);
        }

        if (filesToUpload.length > 0) {
            this.props.setAcceptedFileList(filesToUpload);
            this.props.openDialog();
        } else {
            this.props.showSnackbar(fileInformation.messages.acceptedFiles);
        }
    };

    getListOfUploadedFiles = () => {
        const {
            fileMetadata,
        } = this.props;

        if (fileMetadata) {
            const data = fileMetadata.toJS();
            return Object.keys(fileMetadata.toJS()).map(id => {
                return <UploadedFileMetadata key={id} dataSource={data[id]} form={this.props.form} />;
            });
        }

        return '';
    };

    // checks if we're uploading the same file again
    validateFileMetaIsNull = (acceptedFiles) => {
        const {fileMetadata} = this.props;
        if (fileMetadata.size === 0) return acceptedFiles;

        const filesToUpload = [];
        acceptedFiles.map(file => {
            const found = fileMetadata.find(metadata => {
                return metadata.name === file.name;
            });

            if (!found) {
                filesToUpload.push(file);
            }
        });

        if (acceptedFiles.length !== filesToUpload.length) {
            const msg = locale.sharedComponents.files.messages.alreadyUploaded.replace('[numberOfUploadedFiles]', acceptedFiles.length - filesToUpload.length);
            this.props.showSnackbar(msg);
        }

        return filesToUpload;
    };

    validateFilenameFormat = (acceptedFiles, rejectedFiles) => {
        const validFiles = [];
        const invalidFiles = rejectedFiles;

        acceptedFiles.map(file => {
            if (file.name.match(/^[a-zA-Z][a-zA-Z0-9_]*[.][a-z0-9]+$/)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        return [validFiles, invalidFiles];
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

        return [validFiles, invalidFiles];
    };

    render() {
        const fileInformation = locale.sharedComponents.files;

        const uploadedFiles = this.getListOfUploadedFiles();

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
                                <Dropzone onDrop={this.openDialog.bind(this)} style={{padding: '10px'}} disablePreview>
                                    {fileInformation.fields.filenameRestrictions}
                                </Dropzone>
                            </div>
                        </div>
                    </CardText>
                </Card>

                {this.props.fileMetadata.size > 0 && (
                <Card className="layout-card metadataContainer">
                    <CardText className="body-1">
                        {uploadedFiles}
                    </CardText>
                </Card>
                )}
                <FileUploadDialog form={this.props.form} acceptedFiles={this.state.filesToUpload} />
            </div>
        );
    }
}
