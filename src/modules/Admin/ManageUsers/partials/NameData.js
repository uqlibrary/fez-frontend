import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import UserFieldData from './UserFieldData';

import { default as locale } from 'locale/components';

export const NameData = ({ rowData, error, ...props }) => {
    const {
        editRow: {
            fields: { username, fullName, email, isAdmin, isSuperAdmin },
        },
    } = locale.components.manageUsers;

    return (
        <StandardCard subCard title="User information" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <UserFieldData
                    userFieldDataId="usr-full-name"
                    data={rowData.usr_full_name}
                    name="usr_full_name"
                    required
                    {...((!!error.usr_full_name && error.usr_full_name) || {})}
                    {...fullName}
                    {...props}
                />
                <UserFieldData
                    userFieldDataId="usr-email"
                    data={rowData.usr_email}
                    name="usr_email"
                    required
                    {...((!!error.usr_email && error.usr_email) || {})}
                    {...email}
                    {...props}
                />
                <UserFieldData
                    userFieldDataId="usr-username"
                    data={rowData.usr_username}
                    name="usr_username"
                    required
                    {...((!!error.usr_username && error.usr_username) || {})}
                    {...username}
                    {...props}
                />
                <UserFieldData
                    userFieldDataId="usr-administrator"
                    data={rowData.usr_administrator}
                    name="usr_administrator"
                    type="checkbox"
                    {...isAdmin}
                    {...props}
                />
                <UserFieldData
                    userFieldDataId="usr-super-administrator"
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
