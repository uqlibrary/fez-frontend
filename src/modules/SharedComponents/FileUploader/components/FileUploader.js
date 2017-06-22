import React, {PureComponent} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

// custom components
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import FileMetadata from '../containers/FileMetadata';
import './FileUpload.scss';

export default class FileUploader extends PureComponent {

    static propTypes = {
        acceptedFiles: PropTypes.object,
        form: PropTypes.string.isRequired,
        resetToInitialState: PropTypes.func,
        setAcceptedFileList: PropTypes.func,
        showSnackbar: PropTypes.func,
        uploadError: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.resetToInitialState();
    }

    setAcceptedFileList = (addedFiles) => {
        const fileInformation = locale.sharedComponents.files;
        const {acceptedFiles, setAcceptedFileList, showSnackbar} = this.props;

        let [validFiles, continueFileProcessing] = this.validateFilenameFormat(addedFiles);

        if (acceptedFiles.size > 0 && continueFileProcessing) {
            [validFiles, continueFileProcessing] = this.validateFileNotAdded(validFiles);
        }

        if (continueFileProcessing) {
            [validFiles, continueFileProcessing] = this.validateNumberOfFiles(validFiles);
        }

        if (continueFileProcessing) {
            // check if the total number of files dropped/added plus the files already added are over the limit
            const isOverLimit = (validFiles.length + acceptedFiles.size) > fileInformation.limit;

            if (isOverLimit) {
                const msg = fileInformation.messages.maxFiles.replace('[maxNumberOfFiles]', fileInformation.limit);
                showSnackbar(msg);
            } else {
                if (validFiles.length > 0) {
                    setAcceptedFileList(validFiles);
                }
            }
        }
    };

    // checks if we're uploading the same file again
    validateFileNotAdded = (addedFiles) => {
        const {acceptedFiles} = this.props;
        const validFiles = [];
        const fileInformation = locale.sharedComponents.files;
        const multipleFilesMsg = fileInformation.messages.existingFiles;
        const singleFileMsg = fileInformation.messages.existingFile;
        let existingFileCount = 0;
        let continueFileProcessing = true;

        addedFiles.map(file => {
            const found = acceptedFiles.toJS().find(metadata => {
                return metadata.name === file.name;
            });

            if (!found) {
                validFiles.push(file);
            } else {
                existingFileCount++;
                continueFileProcessing = false;
            }
        });

        if (existingFileCount > 0) {
            let msg = singleFileMsg;

            if (addedFiles.length > 1) {
                const updatedString = existingFileCount === 1 ? `${existingFileCount} file` : `${existingFileCount} files`;
                msg = multipleFilesMsg.replace('[numberOfExistingFiles]', updatedString);
            }
            this.props.showSnackbar(msg);
        }

        return [validFiles, continueFileProcessing];
    };

    validateFilenameFormat = (addedFiles) => {
        const fileInformation = locale.sharedComponents.files;
        const maxNumberOfFiles = fileInformation.limit;
        const multipleFilesMsg = fileInformation.messages.invalidFormatFiles;
        const singleFileMsg = fileInformation.messages.invalidFormatFile;
        const validFiles = [];
        let invalidFileCount = 0;
        let continueFileProcessing = true;

        addedFiles.map(file => {
            if (file.name.match(/^[a-zA-Z][a-zA-Z0-9_]*[.][a-z0-9]+$/)) {
                validFiles.push(file);
            } else {
                continueFileProcessing = false;
                invalidFileCount++;
            }
        });

        if (validFiles.length < maxNumberOfFiles) {
            if (!continueFileProcessing) {
                let msg = singleFileMsg;

                if (addedFiles.length > 1) {
                    const updatedString = invalidFileCount === 1 ? `${invalidFileCount} file` : `${invalidFileCount} files`;
                    msg = multipleFilesMsg.replace('[numberOfRejectedFiles]', updatedString);
                }
                this.props.showSnackbar(msg);
            }
            continueFileProcessing = true;
        }
        return [validFiles, continueFileProcessing];
    };

    validateNumberOfFiles = (addedFiles) => {
        const {acceptedFiles, showSnackbar} = this.props;
        const fileInformation = locale.sharedComponents.files;
        const maxNumberOfFiles = fileInformation.limit;
        const msg = fileInformation.messages.maxFiles.replace('[maxNumberOfFiles]', maxNumberOfFiles);
        let validFiles = addedFiles;
        let continueFileProcessing = true;

        // check if the total number of accepted files is less than the limit
        if (acceptedFiles.size < maxNumberOfFiles) {
            // only allow maxNumberOfFiles to upload
            validFiles = addedFiles.slice(0, (maxNumberOfFiles - acceptedFiles.size));
        }

        if ((acceptedFiles.size < maxNumberOfFiles && (acceptedFiles.size + addedFiles.length) > maxNumberOfFiles) ||
         (acceptedFiles.size === maxNumberOfFiles)) {
            continueFileProcessing = false;
            showSnackbar(msg);
        }

        return [validFiles, continueFileProcessing];
    };

    render() {
        const {acceptedFiles, form, showSnackbar, uploadError} = this.props;
        const fileInformation = locale.sharedComponents.files;

        if (uploadError && uploadError.length > 0) {
            showSnackbar(fileInformation.messages.uploadError.default);
        }

        let dropzoneRef;

        return (
            <div style={{marginBottom: '-60px'}}>
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{fileInformation.title}</h2>
                            </div>
                            <div className="column is-narrow is-helpicon">
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
                            <div className="column"  tabIndex="0" onKeyPress={() => dropzoneRef.open()}>
                                <Dropzone ref={(node) => {dropzoneRef = node;}} onDrop={this.setAcceptedFileList.bind(this)} style={{padding: '10px'}} disablePreview>
                                    {fileInformation.fields.filenameRestrictions}
                                </Dropzone>
                            </div>
                        </div>
                        {acceptedFiles.size > 0 && (
                            <FileMetadata
                                acceptedFiles={acceptedFiles}
                                form={form} />
                        )}
                    </CardText>
                </Card>
            </div>
        );
    }
}
