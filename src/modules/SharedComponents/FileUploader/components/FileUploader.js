import React, {PureComponent} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

// custom components
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import UploadDialog from '../containers/UploadDialog';
import UploadedFileMetadata from '../containers/UploadedFileMetadata';
import './FileUpload.scss';

export default class FileUploader extends PureComponent {

    static propTypes = {
        form: PropTypes.string.isRequired,
        fileMetadata: PropTypes.object,
        isUploadCompleted: PropTypes.bool,
        initializeDialog: PropTypes.func,
        initializeMetadata: PropTypes.func,
        openDialog: PropTypes.func,
        setAcceptedFileList: PropTypes.func,
        showSnackbar: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            filesToUpload: []
        };
    }

    componentWillUnmount() {
        this.props.initializeMetadata();
    }

    openDialog = (acceptedFiles, rejectedFiles) => {
        const fileInformation = locale.sharedComponents.files;

        let [validFiles, invalidFiles] = this.validateNumberOfFiles(acceptedFiles, rejectedFiles);
        [validFiles, invalidFiles] = this.validateFilenameFormat(validFiles, invalidFiles);

        if (this.props.fileMetadata.size > 0) {
            [validFiles, invalidFiles] = this.validateFileNotUploaded(validFiles, invalidFiles);
        }

        if (invalidFiles && invalidFiles.length > 0) {
            const msg = fileInformation.messages.rejectedFiles.replace('[numberOfRejectedFiles]', invalidFiles.length);
            this.props.showSnackbar(msg);
        }

        if (validFiles.length > 0) {
            this.setState({filesToUpload: validFiles});

            this.props.initializeDialog();
            this.props.setAcceptedFileList(validFiles);
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
            return Object.keys(data).map(id => {
                return <UploadedFileMetadata key={id} dataSource={data[id]} form={this.props.form} />;
            });
        }

        return '';
    };

    // checks if we're uploading the same file again
    validateFileNotUploaded = (acceptedFiles, rejectedFiles) => {
        const {fileMetadata} = this.props;

        const validFiles = [];
        const invalidFiles = rejectedFiles;

        acceptedFiles.map(file => {
            const found = fileMetadata.find(metadata => {
                return metadata.name === file.name;
            });

            if (!found) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        if (acceptedFiles.length !== validFiles.length) {
            const msg = locale.sharedComponents.files.messages.alreadyUploaded.replace('[numberOfUploadedFiles]', acceptedFiles.length - validFiles.length);
            this.props.showSnackbar(msg);
        }

        return [validFiles, invalidFiles];
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

        // check if the user has more than the maximum of files uploaded in one hit
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

                {this.props.fileMetadata && this.props.fileMetadata.size > 0 && (
                <Card className="layout-card metadataContainer">
                    <CardText className="body-1">
                        {uploadedFiles}
                    </CardText>
                </Card>
                )}
                <UploadDialog form={this.props.form} acceptedFiles={this.state.filesToUpload} />
            </div>
        );
    }
}
