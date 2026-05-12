import React from 'react';
import { Field } from '../../ReactHookForm';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { validation } from 'config';
import PropTypes from 'prop-types';

const CommissionedResearchReportField = ({ control, disabled, name = 'commissionedResearchReport' }) => (
    <Field
        name={name}
        control={control}
        disabled={disabled}
        validate={[validation.required]}
        data-testid="commissioned-research-report"
        component={props => (
            <FormControlLabel
                disabled={/* eslint-disable-line react/prop-types */ props?.disabled}
                control={<Checkbox {...props} checked={/* eslint-disable-line react/prop-types */ !!props?.value} />}
                label={
                    <Typography
                        color={
                            /* eslint-disable-line react/prop-types */ (!!props?.state?.error && 'error') || 'secondary'
                        }
                    >
                        This report was commissioned by an external client/organisation.
                    </Typography>
                }
            />
        )}
    />
);

CommissionedResearchReportField.propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
};

export default CommissionedResearchReportField;
