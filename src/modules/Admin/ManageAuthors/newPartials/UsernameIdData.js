import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import OverriddenIcon from '@material-ui/icons/Lock';
import NotOverriddenIcon from '@material-ui/icons/LockOpenOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';

export const UsernameIdColumnData = ({ rowData, ...props }) => {
    const {
        editRow: {
            fields: { orgStaffId, orgStudentId, orgUsername, studentUsername, refNum, isUsernameOverridden },
        },
    } = locale.components.manageAuthors;

    const handleIsUsernameOverridden = () => {};

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
                    InputProps={{
                        ...((!!rowData.aut_org_username && {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={isUsernameOverridden.label}>
                                        <span>
                                            <IconButton
                                                aria-label={isUsernameOverridden.label}
                                                onClick={handleIsUsernameOverridden}
                                                id="aut-is-scopus-id-authenticated"
                                                data-testid="aut-is-scopus-id-authenticated"
                                            >
                                                {rowData.aut_is_username_overridden_by_admin ? (
                                                    <OverriddenIcon
                                                        id="scopus-id-is-authenticated"
                                                        data-testid="scopus-id-is-authenticated"
                                                        color="primary"
                                                    />
                                                ) : (
                                                    <NotOverriddenIcon
                                                        id="scopus-id-is-not-authenticated"
                                                        data-testid="scopus-id-is-not-authenticated"
                                                        color="secondary"
                                                    />
                                                )}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }) ||
                            {}),
                    }}
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
