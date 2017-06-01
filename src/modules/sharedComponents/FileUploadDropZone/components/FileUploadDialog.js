import React, {PureComponent} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

// custom components
import FileUploadStepper from '../containers/FileUploadStepper';
import {locale} from 'config';

import './FileUpload.scss';

const GETTING_STARTED_STEP = 'GETTING_STARTED_STEP';
const ADD_FILE_DETAILS_STEP = 'ADD_FILE_DETAILS_STEP';

let IS_UPLOAD_STEP;
let IS_CONFIRMATION_STEP;

export default class FileUploadDialog extends PureComponent {

    static propTypes = {
        acceptedFiles: PropTypes.array.isRequired,
        form: PropTypes.string.isRequired,
        isDialogOpen: PropTypes.bool,
        isUploadCompleted: PropTypes.bool,
        fileMetadata: PropTypes.object,
        formValues: PropTypes.object,
        cancelUpload: PropTypes.func,
        closeDialog: PropTypes.func,
        decreaseStep: PropTypes.func,
        increaseStep: PropTypes.func,
        openDialog: PropTypes.func,
        reset: PropTypes.func,
        resetState: PropTypes.func,
        showSnackbar: PropTypes.func,
        updateFileMetadata: PropTypes.func,
        uploadFile: PropTypes.func,
        stepperIndex: PropTypes.number,
        uploadProgress: PropTypes.object,
        uploadError: PropTypes.string
    };

    static defaultProps = {
        isOpen: Immutable.fromJS(false),
        uploadError: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            fileSummary: [],
            currentStep: GETTING_STARTED_STEP,
            uploadProgress: []
        };
    }

    componentWillUpdate(nextProps) {
        IS_UPLOAD_STEP = nextProps.acceptedFiles && nextProps.stepperIndex > nextProps.acceptedFiles.length;
        IS_CONFIRMATION_STEP = nextProps.acceptedFiles && nextProps.stepperIndex === nextProps.acceptedFiles.length;
    }

    cancelUpload = () => {
        this.props.showSnackbar(locale.sharedComponents.files.messages.cancelledUpload);
        this.closeDialog();
        this.props.cancelUpload();
        dispatch(submit('remoteSubmit'));
    };

    closeDialog = () => {
        // save the form data into the state so that we can generate the list of files that were uploaded
        this.setUploadedDataState();

        this.props.closeDialog();
        this.setState({
            currentStep: GETTING_STARTED_STEP
        });
        this.props.resetState();
        this.props.reset(); // resets the form fields in the dialog
    };

    getDialogTitle = () => {
        const dialogTitles = locale.sharedComponents.files.dialog.titles;
        let title = '';

        if (this.state.currentStep === 'GETTING_STARTED_STEP') {
            title = dialogTitles.gettingStarted;
        } else {
            if (IS_UPLOAD_STEP) {
                title = dialogTitles.uploadingFiles;
            } else if (IS_CONFIRMATION_STEP) {
                title = dialogTitles.confirmation;
            } else {
                title = dialogTitles.fileMetadata;
            }
        }

        return title;
    };

    getPreviousButtonLabel = () => {
        const fileInformation = locale.sharedComponents.files;
        switch(this.state.currentStep) {
            case GETTING_STARTED_STEP:
                return locale.global.labels.buttons.cancel;
            default:
                if (IS_UPLOAD_STEP) {
                    return fileInformation.buttons.cancelUpload;
                }
                return fileInformation.buttons.backLabel;
        }
    };

    getPreviousButtonFunc = () => {
        switch(this.state.currentStep) {
            case GETTING_STARTED_STEP:
                return this.closeDialog();
            case ADD_FILE_DETAILS_STEP:
                if (this.props.stepperIndex === 0) {
                    return this.setCurrentStep('back');
                }

                if (IS_UPLOAD_STEP) {
                    this.cancelUpload();
                }
                return this.props.decreaseStep();
            default:
                return this.setCurrentStep('back');
        }
    };

    getNextButtonLabel = () => {
        const fileInformation = locale.sharedComponents.files;
        let label = fileInformation.buttons.getStartedLabel;

        if (this.state.currentStep === GETTING_STARTED_STEP) {
            label = fileInformation.buttons.getStartedLabel;
        } else if (this.state.currentStep === ADD_FILE_DETAILS_STEP) {
            if (IS_CONFIRMATION_STEP) {
                label = fileInformation.buttons.uploadFilesLabel;
            } else if (IS_UPLOAD_STEP) {
                label = locale.global.labels.buttons.close;
            } else {
                label = fileInformation.buttons.stepperNextLabel;
            }
        }

        return label;
    };

    getNextButtonFunc = () => {
        switch(this.state.currentStep) {
            case ADD_FILE_DETAILS_STEP:
                if (IS_UPLOAD_STEP) {
                    return this.closeDialog();
                } else if (IS_CONFIRMATION_STEP) {
                    return this.uploadFile();
                } else {
                    return this.props.increaseStep();
                }
            default:
                return this.setCurrentStep();
        }
    };

    setCurrentStep = (dir = 'forward') => {
        if (dir === 'forward') {
            switch (this.state.currentStep) {
                case GETTING_STARTED_STEP:
                    this.setState({currentStep: ADD_FILE_DETAILS_STEP});
                    break;
                default:
                    this.setState({currentStep: GETTING_STARTED_STEP});
            }
        } else {
            if (this.state.currentStep === ADD_FILE_DETAILS_STEP) {
                this.setState({currentStep: GETTING_STARTED_STEP});
            }
        }
    };

    setUploadedDataState = () => {
        const {formValues, isUploadCompleted, uploadError} = this.props;

        if (isUploadCompleted && uploadError.length === 0) {
            const fields = locale.sharedComponents.files.fields.metadata;

            const fileMetadata = {};

            this.props.acceptedFiles.map((file, index) => {
                const data = {};
                data.file = file;

                Object.keys(fields).map(id => {
                    data[fields[id]] = formValues.get(`${fields[id]}-${index}`);
                });

                fileMetadata[file.name] = data;
            });

            const combinedList = Object.assign({}, fileMetadata, this.props.fileMetadata.toJS());
            this.props.updateFileMetadata(combinedList);
        }
    };

    uploadFile = () => {
        this.props.increaseStep();
        this.props.uploadFile(this.props.acceptedFiles);
    };

    render() {
        const {
            acceptedFiles,
            isDialogOpen,
            isUploadCompleted,
            form,
            uploadError
        } = this.props;

        const fileInformation = locale.sharedComponents.files;
        const backButtonVisibility = (isUploadCompleted && IS_UPLOAD_STEP || uploadError.length > 0) ? {display: 'none'} : {};
        const actions = [
            <FlatButton
                className="prevBtn"
                label={this.getPreviousButtonLabel()}
                onTouchTap={this.getPreviousButtonFunc}
                style={backButtonVisibility}
            />,
            <RaisedButton
                label={this.getNextButtonLabel()}
                secondary
                onTouchTap={this.getNextButtonFunc}
                disabled={(IS_UPLOAD_STEP &&  (!isUploadCompleted && uploadError.length === 0))}
            />,
        ];

        return (
            <Dialog
                title={this.getDialogTitle()}
                actions={actions}
                modal={false}
                open={isDialogOpen}
                className="uploadFileDialog"
                actionsContainerClassName="actionsPanel"
                bodyClassName="stepperContentPanel"
            >
                {this.state.currentStep === GETTING_STARTED_STEP && (
                    fileInformation.dialog.explanationText
                )}

                {this.state.currentStep === ADD_FILE_DETAILS_STEP && (
                    <FileUploadStepper
                        form={form}
                        acceptedFiles={acceptedFiles}
                    />
                )}
            </Dialog>
        );
    }
}
