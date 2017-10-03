import React from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';

function CustomStepper({activeStep, steps}) {
    return (
        <div className="Stepper">
            <Stepper activeStep={activeStep} style={{padding: '0', margin: '-10px auto'}}>
                {
                    steps.map((step, index) => {
                        return (
                            <Step key={`stepper_${index}`}>
                                <StepLabel
                                    style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                    {step.label}
                                </StepLabel>
                            </Step>
                        );
                    })
                }
            </Stepper>
        </div>
    );
}

CustomStepper.propTypes = {
    activeStep: PropTypes.number,
    steps: PropTypes.array
};

export default CustomStepper;
