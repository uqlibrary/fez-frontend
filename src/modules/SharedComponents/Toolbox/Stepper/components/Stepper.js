import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import withStyles from '@mui/styles/withStyles';
import { withWidth } from 'helpers/withWidth';

export const styles = theme => ({
    stepper: {
        padding: theme.spacing(3),
        backgroundColor: theme.hexToRGBA('#F7F7F7', 0),
        [theme.breakpoints.down('md')]: {
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
        return (
            nextProps.width !== this.props.width ||
            nextProps.activeStep !== this.props.activeStep ||
            nextProps.steps !== this.props.steps
        );
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

export default withStyles(styles)(withWidth()(CustomStepper));
