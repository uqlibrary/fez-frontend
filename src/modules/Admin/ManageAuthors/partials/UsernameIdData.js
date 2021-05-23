import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Field, formValueSelector, change } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import OverriddenIcon from '@material-ui/icons/Lock';
import NotOverriddenIcon from '@material-ui/icons/LockOpenOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import AuthorFieldData from './AuthorFieldData';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { default as locale } from 'locale/components';
import { validation } from 'config';
import { FORM_NAME } from './manageAuthorConfig';

const selector = formValueSelector(FORM_NAME);

export const UsernameIdColumnData = ({ ...props }) => {
    const dispatch = useDispatch();
    const {
        editRow: {
            fields: { orgStaffId, orgStudentId, orgUsername, studentUsername, refNum, isUsernameOverridden },
        },
    } = locale.components.manageAuthors;

    const autOrgUsername = useSelector(state => selector(state, 'aut_org_username'));
    const autNameOverridden = useSelector(state => selector(state, 'aut_name_overridden'));

    const handleNameOverridden = () => {
        dispatch(change(FORM_NAME, 'aut_name_overridden', Number(!autNameOverridden)));
        // props.onChange('aut_name_overridden', Number(!rowData.aut_name_overridden));
    };

    return (
        <StandardCard subCard title="Username & IDs" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    {...orgStaffId}
                    {...props}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-org-staff-id"
                    // data={rowData.aut_org_staff_id}
                    name="aut_org_staff_id"
                    validate={[validation.maxLength12]}
                    // {...((!!error.aut_org_staff_id && error.aut_org_staff_id) || {})}
                />
                <Field
                    {...orgUsername}
                    {...props}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-org-username"
                    // data={rowData.aut_org_username}
                    name="aut_org_username"
                    validate={[validation.maxLength20]}
                    // {...((!!error.aut_org_username && error.aut_org_username) || {})}
                    InputProps={{
                        ...((!!autOrgUsername && {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={isUsernameOverridden.label}>
                                        <span>
                                            <IconButton
                                                aria-label={isUsernameOverridden.label}
                                                onClick={handleNameOverridden}
                                                id="aut-name-overridden"
                                                data-testid="aut-name-overridden"
                                            >
                                                {autNameOverridden ? (
                                                    <OverriddenIcon
                                                        id="name-is-overridden"
                                                        data-testid="name-is-overridden"
                                                        color="primary"
                                                    />
                                                ) : (
                                                    <NotOverriddenIcon
                                                        id="name-is-not-overridden"
                                                        data-testid="name-is-not-overridden"
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
                <Field
                    {...props}
                    {...orgStudentId}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-org-student-id"
                    // data={rowData.aut_org_student_id}
                    name="aut_org_student_id"
                    validate={[validation.maxLength11]}
                    // {...((!!error.aut_org_student_id && error.aut_org_student_id) || {})}
                />
                <Field
                    {...studentUsername}
                    {...props}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-student-username"
                    // data={rowData.aut_student_username}
                    name="aut_student_username"
                    validate={[validation.maxLength30]}
                    // {...((!!error.aut_student_username && error.aut_student_username) || {})}
                />
                <Field
                    {...refNum}
                    {...props}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-ref-num"
                    // data={rowData.aut_ref_num}
                    name="aut_ref_num"
                    validate={[validation.maxLength50]}
                />
            </Grid>
        </StandardCard>
    );
};

UsernameIdColumnData.propTypes = {
    rowData: PropTypes.object,
    error: PropTypes.object,
    onChange: PropTypes.func,
};

export default React.memo(UsernameIdColumnData);
