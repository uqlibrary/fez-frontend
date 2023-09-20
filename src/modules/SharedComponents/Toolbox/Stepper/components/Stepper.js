import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { withWidth } from 'helpers/withWidth';

const StyledStepper = styled(Stepper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.hexToRGBA('#F7F7F7', 0),
    [theme.breakpoints.down('md')]: {
        padding: '12px 0 24px 8px',
        margin: '-24px 0 0 0',
    },
}));

export class CustomStepper extends Component {
    static propTypes = {
        activeStep: PropTypes.number,
        steps: PropTypes.array.isRequired,
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
        const { activeStep, steps, width } = this.props;
        return (
            <StyledStepper activeStep={activeStep}>
                {steps.map((step, index) => {
                    const label = width !== 'xs' && step.label;
                    return (
                        <Step key={`stepper_${index}`}>
                            <StepLabel sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                <span>{label}</span>
                            </StepLabel>
                        </Step>
                    );
                })}
            </StyledStepper>
        );
    }
}

export default withWidth()(CustomStepper);
