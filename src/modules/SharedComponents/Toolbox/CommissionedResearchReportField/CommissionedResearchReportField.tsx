import React from 'react';
import { Control } from 'react-hook-form';
import { Field } from '../ReactHookForm';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { validation } from 'config';
import { default as locale } from './locale';
import { DecoratedField } from 'modules/SharedComponents/Toolbox/ReactHookForm/components/Controller';

interface CommissionedResearchReportFieldProps {
    name?: string;
    control: Control;
    disabled?: boolean;
}

const CommissionedResearchReportField = ({
    control,
    disabled,
    name = 'commissionedResearchReport',
}: CommissionedResearchReportFieldProps) => (
    <Field
        name={name}
        control={control}
        disabled={disabled}
        validate={[validation.required]}
        data-testid="commissioned-research-report"
        component={({ disabled, value, state, ...props }: DecoratedField) => (
            <FormControlLabel
                disabled={disabled}
                control={<Checkbox {...props} checked={!!value} />}
                label={
                    <Typography
                        color={(!!state?.error && 'error') || 'secondary'}
                        data-testid={`commissioned-research-report-${(state?.error && 'error') || 'label'}`}
                    >
                        {locale.label}
                    </Typography>
                }
            />
        )}
    />
);

export default CommissionedResearchReportField;
