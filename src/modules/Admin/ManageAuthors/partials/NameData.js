import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const NameData = ({ rowData, error, ...props }) => {
    const {
        editRow: {
            fields: { title, displayName, firstName, middleName, lastName, position, email },
        },
    } = locale.components.manageAuthors;

    return (
        <StandardCard subCard title="Name information" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <AuthorFieldData
                    authorFieldDataId="aut-display-name"
                    data={rowData.aut_display_name}
                    name="aut_display_name"
                    autoFocus
                    {...displayName}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-title"
                    data={rowData.aut_title}
                    name="aut_title"
                    {...title}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-fname"
                    data={rowData.aut_fname}
                    name="aut_fname"
                    required
                    {...((!!error.author && !!error.author.aut_fname && error.author.aut_fname) || {})}
                    {...firstName}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-mname"
                    data={rowData.aut_mname}
                    name="aut_mname"
                    {...middleName}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-lname"
                    data={rowData.aut_lname}
                    name="aut_lname"
                    required
                    {...((!!error.author && !!error.author.aut_lname && error.author.aut_lname) || {})}
                    {...lastName}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-position"
                    data={rowData.aut_position}
                    name="aut_position"
                    {...position}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-email"
                    data={rowData.aut_email}
                    name="aut_email"
                    {...email}
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
