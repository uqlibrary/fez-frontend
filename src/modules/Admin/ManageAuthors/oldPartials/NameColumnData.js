import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const NameColumnData = ({ rowData, helperText, ...props }) => {
    /* Delete default error flag */
    delete props.error;

    const {
        header: {
            columns: { title, displayName, firstName, middleName, lastName, position },
        },
    } = locale.components.manageAuthors;

    /* Display error from the customised errorObject from helperText */
    const errorObject = JSON.parse(helperText || '{}');

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-title${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_title}
                    name="aut_title"
                    {...title}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-fname${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                            data={rowData.aut_fname}
                            name="aut_fname"
                            required
                            {...firstName}
                            {...props}
                            {...(!!errorObject.aut_fname ? errorObject.aut_fname : {})}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-mname${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                            data={rowData.aut_mname}
                            name="aut_mname"
                            {...middleName}
                            {...props}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-lname${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                            data={rowData.aut_lname}
                            name="aut_lname"
                            required
                            {...lastName}
                            {...props}
                            {...(!!errorObject.aut_lname ? errorObject.aut_lname : {})}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-display-name${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_display_name}
                    name="aut_display_name"
                    {...displayName}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-position${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_position}
                    name="aut_position"
                    {...position}
                    {...props}
                />
            </Grid>
        </Grid>
    );
};

NameColumnData.propTypes = {
    rowData: PropTypes.object,
    helperText: PropTypes.string,
    error: PropTypes.bool,
};

export default React.memo(NameColumnData);
