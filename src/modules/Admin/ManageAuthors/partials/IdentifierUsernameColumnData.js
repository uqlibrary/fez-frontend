import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import AuthorFieldData from './AuthorFieldData';
import ColumnData from './ColumnData';

import { default as locale } from 'locale/components';

export const NameColumnData = ({ rowData }) => {
    const {
        header: {
            columns: { orgStaffId, orgStudentId, orgUsername, studentUsername, refNum },
        },
    } = locale.components.manageAuthors;
    return (
        <ColumnData
            data={
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-title-${rowData.tableData.id}`}
                            data={rowData.aut_org_staff_id}
                            title={orgStaffId.title}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-mname-${rowData.tableData.id}`}
                            data={rowData.aut_org_username}
                            title={orgUsername.title}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-fname-${rowData.tableData.id}`}
                            data={rowData.aut_student_id}
                            title={orgStudentId.title}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-lname-${rowData.tableData.id}`}
                            data={rowData.aut_student_username}
                            title={studentUsername.title}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <AuthorFieldData
                            authorFieldDataId={`aut-position-${rowData.tableData.id}`}
                            data={rowData.aut_ref_num}
                            title={refNum.title}
                        />
                    </Grid>
                </Grid>
            }
            columnDataId={`aut-name-${rowData.tableData.id}`}
        />
    );
};

NameColumnData.propTypes = {
    rowData: PropTypes.object,
};

export default React.memo(NameColumnData);
