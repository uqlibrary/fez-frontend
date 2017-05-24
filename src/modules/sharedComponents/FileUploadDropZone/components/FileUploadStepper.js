import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import Immutable from 'immutable';


import FileUploadSummary from '../containers/FileUploadSummary';
import FileUploadMetadata from './FileUploadMetadata';

let CONFIRMATION_STEP = 0;
let UPLOAD_STEP = 0;

export default class FileUploadStepper extends Component {

    static propTypes = {
        acceptedFiles: PropTypes.array.isRequired,
        stepperIndex: PropTypes.number.isRequired
    };

    static defaultProps = {
        isOpen: Immutable.fromJS(false)
    };

    constructor(props) {
        super(props);

        CONFIRMATION_STEP = this.props.acceptedFiles.length;
        UPLOAD_STEP = this.props.acceptedFiles.length + 1;
    }

    render() {
        const {stepperIndex, acceptedFiles} = this.props;

        const steps = acceptedFiles.map(file => {
            return (<Step key={file.name} disabled={stepperIndex === UPLOAD_STEP}>
                <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{file.name}</StepLabel>
            </Step>);
        });

        return (
            <div className="Stepper">
                <Stepper activeStep={stepperIndex} style={{padding: '0 25px', margin: '-10px auto' }} onChange={this.handleNext}>
                    {steps}
                    <Step disabled={stepperIndex === UPLOAD_STEP}>
                        <StepLabel style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>Confirm and upload</StepLabel>
                    </Step>
                </Stepper>
                {stepperIndex < CONFIRMATION_STEP && (
                    <FileUploadMetadata stepperIndex={stepperIndex} file={acceptedFiles[stepperIndex]} />
                )}

                {stepperIndex === CONFIRMATION_STEP && (
                    <FileUploadSummary
                        acceptedFiles={acceptedFiles} />
                )}

                {stepperIndex === UPLOAD_STEP && (
                    <FileUploadSummary
                        acceptedFiles={acceptedFiles} showProgress/>
                )}
            </div>
        );
    }
}
