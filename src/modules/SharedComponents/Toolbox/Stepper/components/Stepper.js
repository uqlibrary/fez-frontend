import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

export const styles = theme => ({
    stepper: {
        backgroundColor: theme.hexToRGBA('#F7F7F7', 0),
        [theme.breakpoints.down('sm')]: {
            padding: '12px 0 24px 8px',
            margin: '-24px 0 0 0',
        },
    },
    stepperLabel: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
});

export class CustomStepper extends Component {
    static propTypes = {
        activeStep: PropTypes.number,
        steps: PropTypes.array.isRequired,
        classes: PropTypes.object.isRequired,
        width: PropTypes.any,
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.activeStep !== this.props.activeStep || nextProps.steps !== this.props.steps;
    }

    render() {
        const { activeStep, steps, classes, width } = this.props;
        return (
            <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((step, index) => {
                    const label = width !== 'xs' && step.label;
                    return (
                        <Step key={`stepper_${index}`}>
                            <StepLabel className={classes.stepperLabel}>
                                <span>{label}</span>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withWidth()(CustomStepper));
