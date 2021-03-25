import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';

import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const UsernameIdColumnData = ({ rowData, ...props }) => {
    const {
        header: {
            columns: { orgStaffId, orgStudentId, orgUsername, studentUsername, refNum },
        },
    } = locale.components.manageAuthors;

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <AuthorFieldData
                    authorFieldDataId={`aut-org-staff-id${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_org_staff_id}
                    name="aut_org_staff_id"
                    {...props}
                    label={
                        <React.Fragment>
                            {orgStaffId.label}
                            <Tooltip title={orgStaffId.helperText}>
                                <InfoIcon style={{ marginLeft: '6px' }} />
                            </Tooltip>
                        </React.Fragment>
                    }
                    placeholder=""
                />
            </Grid>
            <Grid item xs={6}>
                <AuthorFieldData
                    authorFieldDataId={`aut-org-username${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_org_username}
                    name="aut_org_username"
                    {...orgUsername}
                    {...props}
                />
            </Grid>
            <Grid item xs={6}>
                <AuthorFieldData
                    authorFieldDataId={`aut-org-student-id${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_org_student_id}
                    name="aut_org_student_id"
                    {...props}
                    label={
                        <React.Fragment>
                            {orgStudentId.label}
                            <Tooltip title={orgStudentId.helperText}>
                                <InfoIcon style={{ marginLeft: '6px' }} />
                            </Tooltip>
                        </React.Fragment>
                    }
                    placeholder=""
                />
            </Grid>
            <Grid item xs={6}>
                <AuthorFieldData
                    authorFieldDataId={`aut-student-username${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_student_username}
                    name="aut_student_username"
                    {...studentUsername}
                    {...props}
                />
            </Grid>
            <Grid item xs={12}>
                <AuthorFieldData
                    authorFieldDataId={`aut-ref-num${!!rowData.tableData ? '-' + rowData.tableData.id : ''}`}
                    data={rowData.aut_ref_num}
                    name="aut_ref_num"
                    {...refNum}
                    {...props}
                />
            </Grid>
        </Grid>
    );
};

UsernameIdColumnData.propTypes = {
    rowData: PropTypes.object,
};

export default React.memo(UsernameIdColumnData);
