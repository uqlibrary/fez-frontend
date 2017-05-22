import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';

import {TextField} from 'uqlibrary-react-toolbox';
import DatePicker from 'material-ui/DatePicker';
import {locale} from 'config';

import './FileUpload.scss';

const STEP_1 = 0;
const GETTING_STARTED_STEP = 'GETTING_STARTED_STEP';
const ADD_FILE_DETAILS_STEP = 'ADD_FILE_DETAILS_STEP';
const CONFIRMATION_STEP = 'CONFIRMATION_STEP';
const UPLOAD_FILE_STEP = 'UPLOAD_FILE_STEP';

export default class FileUploadDialog extends Component {

    static propTypes = {
        uploadFile: PropTypes.func,
        open: PropTypes.bool,
        acceptedFiles: PropTypes.array,
        rejectedFiles: PropTypes.array
    };

    static defaultProps = {
        open: false
    };

    constructor(props) {
        super(props);

        this.state = {
            closeDialog: false,
            fileSummary: [],
            progressStep: GETTING_STARTED_STEP,
            stepIndex: 0
        };
    }

    handleClose = () => {
        this.setState({closeDialog: true});
    };

    setProgressStep = () => {
        if (this.state.stepIndex < STEP_1) {
            this.setState({progressStep: GETTING_STARTED_STEP});
        } else if (this.state.stepIndex >= STEP_1 && this.state.stepIndex < (this.props.acceptedFiles.length - 1)) {
            this.setState({progressStep: ADD_FILE_DETAILS_STEP});
        } else if (this.state.stepIndex === (this.props.acceptedFiles.length - 1)) {
            this.setState({progressStep: CONFIRMATION_STEP});
        } else {
            this.setState({progressStep: UPLOAD_FILE_STEP});
        }
    };

    uploadFile = () => {
        // acceptedFiles.map(file => {
        //     if (file.name.match(/^[a-zA-Z][a-zA-Z0-9_]*[\.][a-z0-9]+$/)) {
        //         console.log('good file', file.name);
        //     } else {
        //         console.log('bad file', file.name);
        //     }
        // });
        console.log('uploading files', this.props.acceptedFiles);
        this.props.uploadFile(this.props.acceptedFiles);
    };

    handleNext = () => {
        if (this.state.progressStep === ADD_FILE_DETAILS_STEP) {
            this.setState({stepIndex: (this.state.stepIndex + 1)});
        }

        this.setProgressStep();
    };

    handlePrevious = () => {
        // handle the stepper
        this.setState({stepIndex: this.state.stepIndex - 1});
        this.setProgressStep();
    };

    getIcon = (mimeType) => {
        switch(mimeType) {
            case 'application/pdf':
                return 'movie';
            case 'image/jpeg':
            case 'image/pjpeg':
            case 'image/x-png':
            case 'image/png':
            case 'image/gif':
                return 'photo';
            default:
                return 'insert_drive_file';
        }
    };

    formatBytes = (bytes, decimals) => {
        if(bytes === 0) return '0 Bytes';

        const kb = 1000;
        const dm = decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const result = Math.floor(Math.log(bytes) / Math.log(kb));

        return parseFloat((bytes / Math.pow(kb, result)).toFixed(dm)) + ' ' + sizes[result];
    };

    getFileSummary = (file) => {
        return (
            <div>
                <FontIcon
                className="material-icons">{this.getIcon(file.type)}</FontIcon> {file.name} <span>({this.formatBytes(file.size)})</span>
            </div>
        );
    };

    getNextButtonLabel = () => {
        const fileInformation = locale.sharedComponents.files;
        if (this.state.progressStep === GETTING_STARTED_STEP) {
            return fileInformation.buttons.getStartedLabel;
        } else if (this.state.progressStep === ADD_FILE_DETAILS_STEP) {
            return fileInformation.buttons.stepperNextLabel;
        } else if (this.state.progressStep === CONFIRMATION_STEP) {
            return fileInformation.buttons.uploadFilesLabel;
        } else {
            return 'Got ot!';
        }
    };

    render() {
        const fileInformation = locale.sharedComponents.files;
        const actions = [
            <FlatButton
                label={this.state.progressStep !== GETTING_STARTED_STEP ? fileInformation.buttons.backLabel : locale.global.labels.buttons.cancel}
                onTouchTap={this.state.progressStep !== GETTING_STARTED_STEP ? this.handlePrevious : this.handleClose}
            />,
            <RaisedButton
                label={this.getNextButtonLabel()}
                secondary
                onTouchTap={this.state.progressStep !== CONFIRMATION_STEP ? this.handleNext : this.uploadFile}
            />,
        ];

        const DateTimeFormat = global.Intl.DateTimeFormat;
        const stepIndex = this.state.stepIndex;

        let steps = [];

        if (this.state.progressStep === ADD_FILE_DETAILS_STEP && this.props.acceptedFiles) {
            steps = this.props.acceptedFiles.map(file => {
                return (<Step key={file.name}>
                    <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{file.name}</StepLabel>
                </Step>);
            });
        }

        if (this.state.progressStep === ADD_FILE_DETAILS_STEP) {
            const file = this.props.acceptedFiles[stepIndex];
            this.state.fileSummary[stepIndex] = this.getFileSummary(file);
        }

        return (
            <Dialog
                title={fileInformation.dialog.title}
                actions={actions}
                modal={false}
                open={this.props.open && !this.state.closeDialog }
            >
                {this.state.progressStep === GETTING_STARTED_STEP && (
                    fileInformation.dialog.explanationText
                )}

                {this.state.progressStep === ADD_FILE_DETAILS_STEP && (
                    <div className="layout-fill">
                        <Stepper activeStep={stepIndex} style={{padding: '0 25px', margin: '-10px auto' }} onChange={this.handleNext}>
                            {steps}
                            <Step>
                                <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>Confirm and upload</StepLabel>
                            </Step>
                        </Stepper>
                        <div className="columns">
                            <div className="column">
                                {this.state.fileSummary[stepIndex]}
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField} name={`filesDescription-${stepIndex}`} type="text" fullWidth multiLine
                                       rows={3} floatingLabelText={fileInformation.fields.descriptionLabel}/>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Toggle name={`filesAccessConditions-${stepIndex}`}
                                        label={fileInformation.fields.accessConditionsLabel}
                                        defaultToggled />
                            </div>
                            <div className="column">
                                <Field component={DatePicker} floatingLabelText={fileInformation.fields.embargoDateLabel} fullWidth name={`fileEmbargoDate-${stepIndex}`} locale="en-AU" DateTimeFormat={DateTimeFormat} />
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                {fileInformation.dialog.disclaimer}
                            </div>
                        </div>
                    </div>
                )}

                {this.state.progressStep === CONFIRMATION_STEP && (
                    <div className="layout-fill">
                        <div className="columns">
                            <div className="column">
                                <h3>{fileInformation.dialog.lastStepTitle}</h3>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                {this.state.fileSummary}
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                {fileInformation.dialog.disclaimer}
                            </div>
                        </div>
                    </div>
                )}

                {this.state.progressStep === UPLOAD_FILE_STEP && (
                    <div className="columns">
                        <div className="column">
                            UPLOADING FILES
                        </div>
                    </div>
                )}
            </Dialog>
        );
    }
}
