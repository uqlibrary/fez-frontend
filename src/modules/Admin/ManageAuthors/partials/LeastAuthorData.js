import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ColumnData from '../partials/ColumnData';

export const LeastAuthorData = ({ rowData }) => {
    return (
        <Grid container>
            <Grid item xs={6}>
                <ColumnData data={rowData.aut_display_name} columnDataId={`aut-display-name-${rowData.tableData.id}`} />
            </Grid>
            <Grid item xs={6}>
                <ColumnData
                    data={rowData.aut_org_username || rowData.aut_student_username}
                    columnDataId={`${(rowData.aut_student_username && 'aut-student-username') || 'aut-org-username'}-${
                        rowData.tableData.id
                    }`}
                />
            </Grid>
        </Grid>
    );
};

LeastAuthorData.propTypes = {
    rowData: PropTypes.object,
};

export default React.memo(LeastAuthorData);
