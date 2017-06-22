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

        let validFiles = this.validateNumberOfFiles(addedFiles);
        validFiles = this.validateFilenameFormat(validFiles);

        if (this.props.acceptedFiles.size > 0) {
            validFiles = this.validateFileNotAdded(validFiles);
        }

        // check if the total number of files dropped/added plus the files already added are over the limit
        const isOverLimit = (validFiles.length + acceptedFiles.size) > fileInformation.limit;

        if (isOverLimit) {
            const msg = fileInformation.messages.maxFiles.replace('[maxNumberOfFiles]', fileInformation.limit);
            showSnackbar(msg);
        } else {
            if (validFiles.length > 0) {
                setAcceptedFileList(validFiles);
            } else {
                showSnackbar(fileInformation.messages.acceptedFiles);
            }
        }
    };

    // checks if we're uploading the same file again
    validateFileNotAdded = (addedFiles) => {
        const {acceptedFiles} = this.props;
        const validFiles = [];

        addedFiles.map(file => {
            const found = acceptedFiles.toJS().find(metadata => {
                return metadata.name === file.name;
            });

            if (!found) {
                validFiles.push(file);
            }
        });

        return validFiles;
    };

    validateFilenameFormat = (acceptedFiles) => {
        const validFiles = [];

        acceptedFiles.map(file => {
            if (file.name.match(/^[a-zA-Z][a-zA-Z0-9_]*[.][a-z0-9]+$/)) {
                validFiles.push(file);
            }
        });

        return validFiles;
    };

    validateNumberOfFiles = (acceptedFiles) => {
        const fileInformation = locale.sharedComponents.files;
        const maxNumberOfFiles = fileInformation.limit;
        let validFiles = acceptedFiles;

        // check if the user has more than the maximum of files uploaded in one hit
        if (acceptedFiles.length > maxNumberOfFiles) {
            // alert user they're trying to upload more than files than maxNumberOfFiles
            const msg = fileInformation.messages.maxFiles.replace('[maxNumberOfFiles]', maxNumberOfFiles);
            this.props.showSnackbar(msg);

            // only allow maxNumberOfFiles to upload
            validFiles = acceptedFiles.slice(0, maxNumberOfFiles);
        }

        return validFiles;
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
