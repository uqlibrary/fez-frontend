import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const NameData = ({
    rowData,
    ...props
    // helperText,
}) => {
    /* Delete default error flag */
    // delete props.error;

    const {
        header: {
            columns: { title, displayName, firstName, middleName, lastName, position },
        },
    } = locale.components.manageAuthors;

    /* Display error from the customised errorObject from helperText */
    // const errorObject = JSON.parse(helperText || '{}');

    return (
        <StandardCard subCard title="Name information" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <AuthorFieldData
                    authorFieldDataId="aut-display-name"
                    data={rowData.aut_display_name}
                    name="aut_display_name"
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
            </Grid>
        </StandardCard>
    );
};

NameData.propTypes = {
    rowData: PropTypes.object,
    onChange: PropTypes.func,
    index: PropTypes.number,
    helperText: PropTypes.string,
    error: PropTypes.bool,
};

export default React.memo(
    NameData,
    (prevProps, nextProps) =>
        prevProps.rowData.aut_fname === nextProps.rowData.aut_fname &&
        prevProps.rowData.aut_mname === nextProps.rowData.aut_mname &&
        prevProps.rowData.aut_lname === nextProps.rowData.aut_lname &&
        prevProps.rowData.aut_title === nextProps.rowData.aut_title &&
        prevProps.rowData.aut_display_name === nextProps.rowData.aut_display_name,
);
