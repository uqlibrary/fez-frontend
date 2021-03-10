import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const NameColumnData = ({ rowData }) => {
    const {
        header: {
            columns: { title, displayName, firstName, middleName, lastName, position },
        },
    } = locale.components.manageAuthors;
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-title-${rowData.tableData.id}`}
                    data={rowData.aut_title}
                    title={title.title}
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-fname-${rowData.tableData.id}`}
                            data={rowData.aut_fname}
                            title={firstName.title}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-mname-${rowData.tableData.id}`}
                            data={rowData.aut_mname}
                            title={middleName.title}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-lname-${rowData.tableData.id}`}
                            data={rowData.aut_lname}
                            title={lastName.title}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-display-name-${rowData.tableData.id}`}
                    data={rowData.aut_display_name}
                    title={displayName.title}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-position-${rowData.tableData.id}`}
                    data={rowData.aut_position}
                    title={position.title}
                />
            </Grid>
        </Grid>
    );
};

NameColumnData.propTypes = {
    rowData: PropTypes.object,
};

export default React.memo(NameColumnData);
