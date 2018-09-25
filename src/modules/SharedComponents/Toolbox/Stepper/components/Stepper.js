import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    stepper: {
        backgroundColor: theme.hexToRGBA('#F7F7F7', 0)
    }
});

export class CustomStepper extends Component {
    static propTypes = {
        activeStep: PropTypes.number,
        steps: PropTypes.array,
        classes: PropTypes.object
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.activeStep !== this.props.activeStep
        || nextProps.steps !== this.props.steps;
    }

    render() {
        const {activeStep, steps, classes} = this.props;
        return (
            <Stepper activeStep={activeStep} className={classes.stepper}>
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
        );
    }
}

export default withStyles(styles, {withTheme: true})(CustomStepper);
