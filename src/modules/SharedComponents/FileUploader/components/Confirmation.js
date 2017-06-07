import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

// custom components
import {locale} from 'config';
import './Confirmation.scss';
import './buttons.scss';
import FileUploadInfoRow from './FileUploadInfoRow';

const fileUploadProgress = [];
let IS_UPLOAD_STEP;

export default class Confirmation extends PureComponent {

    static propTypes = {
        acceptedFiles: PropTypes.array.isRequired,
        cancelUpload: PropTypes.func,
        closeDialog: PropTypes.func,
        decreaseStep: PropTypes.func,
        fileMetadata: PropTypes.object,
        form: PropTypes.string.isRequired,
        formValues: PropTypes.object,
        increaseStep: PropTypes.func,
        isUploadCompleted: PropTypes.bool,
        reset: PropTypes.func,
        showProgress: PropTypes.bool,
        showSnackbar: PropTypes.func,
        uploadFile: PropTypes.func,
        updateFileMetadata: PropTypes.func,
        uploadError: PropTypes.string
    };

    constructor(props) {
        super(props);
        IS_UPLOAD_STEP = false;
    }

    componentWillUpdate(nextProps) {
        IS_UPLOAD_STEP = nextProps.acceptedFiles && nextProps.stepperIndex > nextProps.acceptedFiles.length;
        fileUploadProgress[nextProps.uploadProgress.get('name')] = nextProps.uploadProgress.get('progress');
    }

    cancelFileUpload = () => {
        const {cancelUpload, closeDialog, showSnackbar} = this.props;
        const fileInformation = locale.sharedComponents.files;

        showSnackbar(fileInformation.messages.cancelledUpload);
        closeDialog();
        cancelUpload();
    };

    closeFileUploadDialog = () => {
        const {closeDialog, reset} = this.props;

        // save the form data into the state so that we can generate the list of files that were uploaded
        this.setUploadedDataState();

        closeDialog();
        reset(); // resets the redux form fields in the dialog. Function available in redux-form itself
    };

    setUploadedDataState = () => {
        const {acceptedFiles, fileMetadata, formValues, isUploadCompleted, updateFileMetadata, uploadError} = this.props;
        if (isUploadCompleted && uploadError.length === 0) {
            const fields = locale.sharedComponents.files.fields.metadata;
            const fileList = {};

            acceptedFiles.map((file, index) => {
                const data = {};
                data.file = file;

                Object.keys(fields).map(id => {
                    data[fields[id]] = formValues.get(`${fields[id]}${index}`);
                });

                fileList[file.name] = data;
            });

            const combinedList = Object.assign({}, fileList, fileMetadata.toJS());
            updateFileMetadata(combinedList);
        }
    };

    uploadSelectedFiles = () => {
        const {increaseStep, uploadFile, acceptedFiles} = this.props;
        increaseStep();
        uploadFile(acceptedFiles);
    };

    render() {
        const {
            showProgress,
            acceptedFiles,
            decreaseStep,
            isUploadCompleted,
            showSnackbar,
            uploadError
        } = this.props;

        const fileInformation = locale.sharedComponents.files;
        const filesToUpload = acceptedFiles.map(file => {
            return (
                <FileUploadInfoRow key={file.name} file={file} uploadProgress={fileUploadProgress[file.name]} showProgress={showProgress} />
            );
        });

        const prevBtnLabel = !showProgress ? fileInformation.buttons.backLabel : fileInformation.buttons.cancelUpload;
        const prevBtnFunc = !showProgress ? decreaseStep : this.cancelFileUpload;
        const nextBtnLabel = !showProgress ? fileInformation.buttons.uploadFilesLabel : locale.global.labels.buttons.close;
        const nextBtnFunc = !showProgress ? this.uploadSelectedFiles : this.closeFileUploadDialog;
        const prevDisabledBtn = (IS_UPLOAD_STEP && isUploadCompleted && uploadError.length === 0);
        const nextDisabledBtn = (IS_UPLOAD_STEP && !isUploadCompleted && uploadError.length === 0);

        if (uploadError && uploadError.length > 0) {
            showSnackbar(fileInformation.messages.uploadError.default);
        }

        return (
            <div>
                <div className="columns">
                    <div className="column">
                        <h3>{fileInformation.fields.title}</h3>
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        {filesToUpload}
                    </div>
                </div>
                {!showProgress && (
                <div className="columns">
                    <div className="column">
                        {fileInformation.dialog.disclaimer}
                    </div>
                </div>
                )}
                <div className="buttonsContainer">
                    <FlatButton
                        className="prevBtn"
                        label={prevBtnLabel}
                        onTouchTap={prevBtnFunc}
                        disabled={prevDisabledBtn}
                    />
                    <RaisedButton
                        label={nextBtnLabel}
                        secondary
                        onTouchTap={nextBtnFunc}
                        disabled={nextDisabledBtn}
                    />
                </div>
            </div>
        );
    }
}
