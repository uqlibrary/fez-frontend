import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Field } from 'redux-form/immutable';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { useFormContext } from 'react-hook-form';

import Grid from '@mui/material/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import UserFieldData from './UserFieldData';

import { validation } from 'config';
import { default as locale } from 'locale/components';
import { useIsUserSuperAdmin } from 'hooks';
// import { FORM_NAME } from './manageUserConfig';

// const selector = formValueSelector(FORM_NAME);

export const NameData = () => {
    // const dispatch = useDispatch();
    const isUserSuperAdmin = useIsUserSuperAdmin();

    const {
        title,
        editRow: {
            fields: { username, fullName, email, isAdmin, isSuperAdmin },
        },
    } = locale.components.manageUsers;

    const { control } = useFormContext();

    return (
        <StandardCard subCard title={title} smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    control={control}
                    component={UserFieldData}
                    userFieldDataId="usr-full-name"
                    name="usr_full_name"
                    required
                    autoFocus
                    validate={[validation.required, validation.spacelessMaxLength255Validator]}
                    {...fullName}
                />
                <Field
                    control={control}
                    component={UserFieldData}
                    userFieldDataId="usr-email"
                    name="usr_email"
                    required
                    validate={[validation.required, validation.email, validation.spacelessMaxLength255Validator]}
                    {...email}
                />
                <Field
                    control={control}
                    component={UserFieldData}
                    userFieldDataId="usr-username"
                    name="usr_username"
                    required
                    validate={[validation.required, validation.spacelessMaxLength20Validator]}
                    {...username}
                />
                <Field
                    component={UserFieldData}
                    userFieldDataId="usr-administrator"
                    name="usr_administrator"
                    type="checkbox"
                    // onChange={handleUserAdministrator}
                    {...isAdmin}
                />
                <Field
                    component={UserFieldData}
                    userFieldDataId="usr-super-administrator"
                    name="usr_super_administrator"
                    type="checkbox"
                    disabled={!isUserSuperAdmin}
                    // onChange={handleUserSuperAdministrator}
                    {...isSuperAdmin}
                />
            </Grid>
        </StandardCard>
    );
};

export default React.memo(NameData);
