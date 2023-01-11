import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import withStyles from '@mui/styles/withStyles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null) || 'xs'
    );
}
const withWidth = () => WrappedComponent => props => {
    const width = useWidth();
    return <WrappedComponent {...props} width={width} />;
};

export const styles = theme => ({
    stepper: {
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
