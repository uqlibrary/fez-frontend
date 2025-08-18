import { useFormContext } from 'react-hook-form';
import React from 'react';

import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import Grid from '@mui/material/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { validation } from 'config';
import { default as locale } from 'locale/components';

export const NameData = () => {
    const {
        title: cardTitle,
        editRow: {
            fields: { title, displayName, firstName, middleName, lastName, position, email },
        },
    } = locale.components.manageAuthors;
    const { control } = useFormContext();

    return (
        <StandardCard subCard title={cardTitle} smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    {...displayName}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-display-name"
                    name="aut_display_name"
                    autoFocus
                    validate={[validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...title}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-title"
                    name="aut_title"
                    validate={[validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...firstName}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-fname"
                    name="aut_fname"
                    required
                    validate={[validation.required, validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...middleName}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-mname"
                    name="aut_mname"
                    validate={[validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...lastName}
                    control={control}
                    component={AuthorFieldData}
                    name="aut_lname"
                    authorFieldDataId="aut-lname"
                    required
                    validate={[validation.required, validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...position}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-position"
                    name="aut_position"
                    validate={[validation.spacelessMaxLength255Validator]}
                />
                <Field
                    {...email}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-email"
                    name="aut_email"
                    validate={[validation.email, validation.spacelessMaxLength255Validator]}
                />
            </Grid>
        </StandardCard>
    );
};

export default React.memo(NameData);
