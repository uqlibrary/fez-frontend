import React from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';

export default function AddRecordStepper({activeStep, txt}) {
    return (
        <div className="Stepper">
            <Stepper activeStep={activeStep} style={{padding: '0', margin: '-10px auto'}}>
                {
                    txt.stepper.map((step, index) => {
                        return (<Step key={index}>
                            <StepLabel
                                style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{step.label}</StepLabel>
                        </Step>);
                    })
                }
            </Stepper>
        </div>
    );
}

AddRecordStepper.propTypes = {
    activeStep: PropTypes.number,
    txt: PropTypes.object
};
