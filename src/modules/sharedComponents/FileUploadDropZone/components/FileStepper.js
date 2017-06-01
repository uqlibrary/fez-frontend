import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import Immutable from 'immutable';

// custom components
import Confirmation from '../containers/Confirmation';
import Metadata from '../containers/Metadata';
import './FileStepper.scss';


let CONFIRMATION_STEP = 0;
let UPLOAD_STEP = 0;

export default class FileStepper extends PureComponent {

    static propTypes = {
        acceptedFiles: PropTypes.array.isRequired,
        form: PropTypes.string.isRequired,
        stepperIndex: PropTypes.number.isRequired,
        documentAccessTypes: PropTypes.array,
        loadDocumentAccessTypes: PropTypes.func
    };

    static defaultProps = {
        isOpen: Immutable.fromJS(false)
    };

    constructor(props) {
        super(props);

        CONFIRMATION_STEP = this.props.acceptedFiles.length;
        UPLOAD_STEP = this.props.acceptedFiles.length + 1;
    }

    componentDidMount() {
        this.props.loadDocumentAccessTypes();
    }

    render() {
        const {
            stepperIndex,
            acceptedFiles,
            form,
        } = this.props;

        const steps = acceptedFiles.map(file => {
            return (<Step key={file.name} disabled={stepperIndex === UPLOAD_STEP} className="step">
                <StepLabel className="stepLabel">{file.name}</StepLabel>
            </Step>);
        });

        return (
            <div className="Stepper">
                <Stepper activeStep={stepperIndex} style={{padding: '0 25px', margin: '-10px auto' }} onChange={this.handleNext}>
                    {steps}
                    <Step disabled={stepperIndex === UPLOAD_STEP}>
                        <StepLabel className="stepLabel">Confirm and upload</StepLabel>
                    </Step>
                </Stepper>

                {stepperIndex < CONFIRMATION_STEP && (
                    <Metadata
                        stepperIndex={stepperIndex}
                        form={form}
                        file={acceptedFiles[stepperIndex]}
                        dataSource={this.props.documentAccessTypes} />
                )}

                {stepperIndex === CONFIRMATION_STEP && (
                    <Confirmation
                        form={form}
                        acceptedFiles={acceptedFiles} />
                )}

                {stepperIndex === UPLOAD_STEP && (
                    <Confirmation
                        form={form}
                        acceptedFiles={acceptedFiles} showProgress/>
                )}
            </div>
        );
    }
}
