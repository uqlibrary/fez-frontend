import React from 'react';
import { Field } from '../ReactHookForm';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { default as locale } from './locale';
import { DecoratedField } from 'modules/SharedComponents/Toolbox/ReactHookForm/components/Controller';
import { FieldProps } from 'modules/SharedComponents/Toolbox/ReactHookForm/components/Field';

interface CommissionedResearchReportFieldProps extends Pick<FieldProps, 'control' | 'validate' | 'name'> {
    disabled?: boolean;
}

const CommissionedResearchReportField = ({
    control,
    disabled,
    validate,
    name = 'commissionedResearchReport',
}: CommissionedResearchReportFieldProps) => (
    <Field
        name={name}
        control={control}
        disabled={disabled}
        validate={validate}
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
