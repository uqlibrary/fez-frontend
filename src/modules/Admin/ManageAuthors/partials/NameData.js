import { useFormContext } from 'react-hook-form';
import React from 'react';

import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import Grid from '@mui/material/GridLegacy';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { validation } from 'config';
import { default as locale } from 'locale/components';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AuthorFieldData } from './AuthorFieldData';
import { AuthorTextFieldData } from './AuthorTextFieldData';
import Divider from '@mui/material/Divider';

export const NameData = () => {
    const {
        title: cardTitle,
        editRow: {
            fields: { title, displayName, firstName, middleName, lastName, isNameOverride, position, email },
        },
    } = locale.components.manageAuthors;
    const { control, isSubmitting } = useFormContext();

    return (
        <StandardCard subCard title={cardTitle} smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    {...displayName}
                    control={control}
                    component={AuthorTextFieldData}
                    authorFieldDataId="aut-display-name"
                    name="aut_display_name"
                    autoFocus
                    validate={[validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...title}
                    control={control}
                    component={AuthorTextFieldData}
                    authorFieldDataId="aut-title"
                    name="aut_title"
                    validate={[validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...firstName}
                    control={control}
                    component={AuthorTextFieldData}
                    authorFieldDataId="aut-fname"
                    name="aut_fname"
                    required
                    validate={[validation.required, validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...middleName}
                    control={control}
                    component={AuthorTextFieldData}
                    authorFieldDataId="aut-mname"
                    name="aut_mname"
                    validate={[validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...lastName}
                    control={control}
                    component={AuthorTextFieldData}
                    name="aut_lname"
                    authorFieldDataId="aut-lname"
                    required
                    validate={[validation.required, validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...isNameOverride}
                    control={control}
                    component={props => (
                        <AuthorFieldData
                            {...props}
                            displayLabelForMobileMode
                            // eslint-disable-next-line no-unused-vars
                            component={({ isValidating, authorFieldDataId, value, onChange, ...componentProps }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            {...componentProps}
                                            checked={value === 1}
                                            onChange={e => onChange(e.target.checked ? 1 : 0)}
                                        />
                                    }
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    )}
                    authorFieldDataId="aut-name-overridden"
                    name="aut_name_overridden"
                />
                <Grid xs={12} sx={{ mx: 2 }}>
                    <Divider />
                </Grid>
                <Field
                    {...position}
                    control={control}
                    component={AuthorTextFieldData}
                    authorFieldDataId="aut-position"
                    name="aut_position"
                    validate={[validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...email}
                    control={control}
                    component={AuthorTextFieldData}
                    authorFieldDataId="aut-email"
                    name="aut_email"
                    validate={[validation.email, validation.spacelessMaxLength255Validator]}
                />
            </Grid>
        </StandardCard>
    );
};

export default React.memo(NameData);
