import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';

export default class CustomStepper extends Component {
    static propTypes = {
        activeStep: PropTypes.number,
        steps: PropTypes.array
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.activeStep !== this.props.activeStep
        || nextProps.steps !== this.props.steps;
    }

    render() {
        const {activeStep, steps} = this.props;
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
}

