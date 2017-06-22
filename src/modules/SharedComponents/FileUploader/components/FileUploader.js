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
        const maxNumberOfFiles = fileInformation.limit;
        const {acceptedFiles, setAcceptedFileList, showSnackbar} = this.props;

        let [validFiles, continueFileValidation] = this.validateFilenameFormat(addedFiles, maxNumberOfFiles);

        if (continueFileValidation) {
            [validFiles, continueFileValidation] = this.validateFileDoesNotExist(validFiles);
        }

        if (continueFileValidation) {
            [validFiles, continueFileValidation] = this.validFilenameLength(validFiles);
        }

        // always run this validation because there could still be valid files to be added AND
        // the total number of files added is still less than the limit
        [validFiles, continueFileValidation] = this.validateNumberOfFiles(validFiles, maxNumberOfFiles);

        // check if the total number of files dropped/added plus the files already added are over the limit
        const isOverLimit = ((validFiles.length + acceptedFiles.size) > fileInformation.limit);

        if (isOverLimit) {
            const msg = fileInformation.messages.maxFiles.replace('[maxNumberOfFiles]', fileInformation.limit);
            showSnackbar(msg);
        } else {
            if (validFiles.length > 0) {
                setAcceptedFileList(validFiles);
            }
        }
    };

    showFileDoesNotExistMessage = (addedFiles, existingFileCount) => {
        const fileInformation = locale.sharedComponents.files;
        const multipleFilesMsg = fileInformation.messages.existingFiles;
        const singleFileMsg = fileInformation.messages.existingFile;
        let msg = singleFileMsg;

        if (addedFiles.length > 1) {
            const updatedString = existingFileCount === 1 ? `${existingFileCount} file` : `${existingFileCount} files`;
            msg = multipleFilesMsg.replace('[numberOfExistingFiles]', updatedString);
        }
        this.props.showSnackbar(msg);
    };

    showFilenameFormatMessage = (addedFiles, invalidFileCount) => {
        const fileInformation = locale.sharedComponents.files;
        const multipleFilesMsg = fileInformation.messages.invalidFormatFiles;
        const singleFileMsg = fileInformation.messages.invalidFormatFile;
        let msg = singleFileMsg;


        if (addedFiles.length > 1) {
            const updatedString = invalidFileCount === 1 ? `${invalidFileCount} file` : `${invalidFileCount} files`;
            msg = multipleFilesMsg.replace('[numberOfRejectedFiles]', updatedString);
        }
        this.props.showSnackbar(msg);
    };

    showInvalidFileLengthMessage = (addedFiles, invalidFileLengthCount) => {
        const fileInformation = locale.sharedComponents.files;
        const multipleFilesMsg = fileInformation.messages.invalidFileLengths;
        const singleFileMsg = fileInformation.messages.invalidFileLength;
        let msg = singleFileMsg;

        if (addedFiles.length > 1) {
            const updatedString = invalidFileLengthCount === 1 ? `${invalidFileLengthCount} file` : `${invalidFileLengthCount} files`;
            msg = multipleFilesMsg.replace('[numberOfLongFiles]', updatedString);
        }
        this.props.showSnackbar(msg);
    };

    // checks if we're uploading the same file again
    validateFileDoesNotExist = (addedFiles) => {
        const {acceptedFiles} = this.props;
        const validFiles = [];
        let existingFileCount = 0;
        let continueFileValidation = true;

        addedFiles.map(file => {
            const found = acceptedFiles.toJS().find(metadata => {
                return metadata.name === file.name;
            });

            if (!found) {
                validFiles.push(file);
            } else {
                existingFileCount++;
                continueFileValidation = false;
            }
        });

        if (existingFileCount > 0) {
            this.showFileDoesNotExistMessage(addedFiles, existingFileCount);
        }

        return [validFiles, continueFileValidation];
    };

    validateFilenameFormat = (addedFiles, maxNumberOfFiles) => {
        const validFiles = [];
        let invalidFileCount = 0;
        let continueFileValidation = true;

        addedFiles.map(file => {
            if (file.name.match(/^[a-zA-Z][a-zA-Z0-9_]*[.][a-z0-9]+$/)) {
                validFiles.push(file);
            } else {
                continueFileValidation = false;
                invalidFileCount++;
            }
        });

        if (validFiles.length < maxNumberOfFiles) {
            if (!continueFileValidation) {
                this.showFilenameFormatMessage(addedFiles, invalidFileCount);
            }
            continueFileValidation = true;
        }
        return [validFiles, continueFileValidation];
    };

    validFilenameLength = (addedFiles) => {
        const validFiles = [];
        const fileInformation = locale.sharedComponents.files;

        let continueFileValidation = true;
        let invalidFileLengthCount = 0;

        addedFiles.map(file => {
            if (file.name.length <= fileInformation.filenameLimit) {
                validFiles.push(file);
            } else {
                continueFileValidation = false;
                invalidFileLengthCount++;
            }
        });

        if (invalidFileLengthCount > 0) {
            this.showInvalidFileLengthMessage(addedFiles, invalidFileLengthCount);
        }

        return [validFiles, continueFileValidation];
    };

    validateNumberOfFiles = (addedFiles, maxNumberOfFiles) => {
        const {acceptedFiles, showSnackbar} = this.props;
        const fileInformation = locale.sharedComponents.files;
        const msg = fileInformation.messages.maxFiles.replace('[maxNumberOfFiles]', maxNumberOfFiles);
        let validFiles = addedFiles;
        let continueFileValidation = true;

        // check if the total number of accepted files is less than the limit
        if (acceptedFiles.size < maxNumberOfFiles) {
            // only allow maxNumberOfFiles to upload
            validFiles = addedFiles.slice(0, (maxNumberOfFiles - acceptedFiles.size));
        }

        if ((acceptedFiles.size < maxNumberOfFiles && (acceptedFiles.size + addedFiles.length) > maxNumberOfFiles) ||
         (acceptedFiles.size === maxNumberOfFiles)) {
            continueFileValidation = false;
            showSnackbar(msg);
        }

        return [validFiles, continueFileValidation];
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
