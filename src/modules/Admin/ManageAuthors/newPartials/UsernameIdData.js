import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const UsernameIdColumnData = ({ rowData, ...props }) => {
    const {
        header: {
            columns: { orgStaffId, orgStudentId, orgUsername, studentUsername, refNum },
        },
    } = locale.components.manageAuthors;

    return (
        <StandardCard subCard title="Username & IDs" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <AuthorFieldData
                    authorFieldDataId="aut-org-staff-id"
                    data={rowData.aut_org_staff_id}
                    name="aut_org_staff_id"
                    {...orgStaffId}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-org-username"
                    data={rowData.aut_org_username}
                    name="aut_org_username"
                    {...orgUsername}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-org-student-id"
                    data={rowData.aut_org_student_id}
                    name="aut_org_student_id"
                    {...props}
                    {...orgStudentId}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-student-username"
                    data={rowData.aut_student_username}
                    name="aut_student_username"
                    {...studentUsername}
                    {...props}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-ref-num"
                    data={rowData.aut_ref_num}
                    name="aut_ref_num"
                    {...refNum}
                    {...props}
                />
            </Grid>
        </StandardCard>
    );
};

UsernameIdColumnData.propTypes = {
    rowData: PropTypes.object,
};

export default React.memo(UsernameIdColumnData);
