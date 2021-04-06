import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import UserFieldData from './UserFieldData';

import { default as locale } from 'locale/components';

export const NameData = ({ rowData, ...props }) => {
    const {
        editRow: {
            fields: { username, fullName, email, isAdmin, isSuperAdmin, password },
        },
    } = locale.components.manageUsers;

    /* Display error from the customised errorObject from helperText */
    // const errorObject = JSON.parse(helperText || '{}');

    return (
        <StandardCard subCard title="User information" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <UserFieldData
                    authorFieldDataId="usr-full-name"
                    data={rowData.usr_full_name}
                    name="usr_full_name"
                    {...fullName}
                    {...props}
                />
                <UserFieldData
                    authorFieldDataId="usr-email"
                    data={rowData.usr_email}
                    name="usr_email"
                    // {...((!!error.author && !!error.author.usr_email && error.author.usr_email) || {})}
                    {...email}
                    {...props}
                />
                <UserFieldData
                    authorFieldDataId="usr-username"
                    data={rowData.usr_username}
                    name="usr_username"
                    {...username}
                    {...props}
                />
                <UserFieldData
                    authorFieldDataId="usr-password"
                    data={rowData.usr_password}
                    name="usr_password"
                    {...password}
                    {...props}
                />
                <UserFieldData
                    authorFieldDataId="usr-administrator"
                    data={rowData.usr_administrator}
                    name="usr_administrator"
                    type="checkbox"
                    {...isAdmin}
                    {...props}
                />
                <UserFieldData
                    authorFieldDataId="usr-super-administrator"
                    data={rowData.usr_super_administrator}
                    name="usr_super_administrator"
                    type="checkbox"
                    {...isSuperAdmin}
                    {...props}
                />
            </Grid>
        </StandardCard>
    );
};

NameData.propTypes = {
    rowData: PropTypes.object,
    onChange: PropTypes.func,
    index: PropTypes.number,
    helperText: PropTypes.string,
    error: PropTypes.object,
};

export default React.memo(NameData);
