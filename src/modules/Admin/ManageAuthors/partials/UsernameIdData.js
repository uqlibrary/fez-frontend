import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'throttle-debounce';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import OverriddenIcon from '@material-ui/icons/Lock';
import NotOverriddenIcon from '@material-ui/icons/LockOpenOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { default as locale } from 'locale/components';
import { checkForExistingAuthor } from 'actions';

export const UsernameIdColumnData = ({ rowData, ...props }) => {
    const dispatch = useDispatch();

    const existingAuthorFieldError = useSelector(state => state.get('manageAuthorsReducer').existingAuthorFieldError);

    const {
        editRow: {
            fields: { orgStaffId, orgStudentId, orgUsername, studentUsername, refNum, isUsernameOverridden },
            validation: {
                /* orgStaffIdErrorText, orgStudentIdErrorText, */
                studentUsernameErrorText,
                orgUsernameErrorText,
            },
        },
    } = locale.components.manageAuthors;

    const [orgUsernameError, setOrgUsernameError] = React.useState(null);
    const [studentUsernameError, setStudentUsernameError] = React.useState(null);

    /**
     * @todo uncomment below code for aut_org_staff_id and aut_org_student_id validation error
     */
    // const [orgStaffIdError, setOrgStaffIdError] = React.useState(null);
    // const [orgStudentIdError, setOrgStudentIdError] = React.useState(null);

    const checkForExisting = React.useRef(
        throttle(500, (query, authorField, autId) => dispatch(checkForExistingAuthor(query, authorField, autId))),
    );

    /* Run this effect on aut_org_username change */
    React.useEffect(() => {
        if (!!rowData.aut_org_username && rowData.aut_org_username.length >= 5) {
            checkForExisting.current(rowData.aut_org_username, 'aut_org_username', rowData.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowData.aut_org_username]);

    /* Run this effect on aut_student_username change */
    React.useEffect(() => {
        if (!!rowData.aut_student_username && rowData.aut_student_username.length === 8) {
            checkForExisting.current(rowData.aut_student_username, 'aut_student_username', rowData.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowData.aut_student_username]);

    /* Run this effect on aut_org_staff_id change */
    /**
    @TODO   uncomment this block once api successfully search on aut_org_staff_id
    React.useEffect(() => {
        if (!!rowData.aut_org_staff_id && rowData.aut_org_staff_id.length === 7) {
            checkForExisting.current(rowData.aut_org_staff_id, 'aut_org_staff_id', rowData.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowData.aut_org_staff_id]);
    */

    /* Run this effect on aut_org_student_id change */
    /**
    @TODO   uncomment this block once api successfully search on aut_org_student_id
    React.useEffect(() => {
        if (!!rowData.aut_org_student_id && rowData.aut_org_student_id.length === 8) {
            checkForExisting.current(rowData.aut_org_student_id, 'aut_org_student_id', rowData.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowData.aut_org_student_id]);
    */

    React.useEffect(() => {
        if (!!existingAuthorFieldError) {
            const { field, error } = existingAuthorFieldError;
            switch (field) {
                case 'aut_org_username':
                    setOrgUsernameError(error ? { error: true, errorText: orgUsernameErrorText } : { error: false });
                    break;
                case 'aut_student_username':
                    setStudentUsernameError(
                        error ? { error: true, errorText: studentUsernameErrorText } : { error: false },
                    );
                    break;
                /*
                case 'aut_org_staff_id':
                    setOrgStaffIdError(error ? { error: true, errorText: orgStaffIdErrorText } : { error: false });
                    break;
                case 'aut_org_student_id':
                    setOrgStudentIdError(error ? { error: true, errorText: orgStudentIdErrorText } : { error: false });
                    break;
                */
                default:
                    break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingAuthorFieldError]);

    const handleNameOverridden = () => {
        props.onChange('aut_name_overridden', Number(!rowData.aut_name_overridden));
    };

    return (
        <StandardCard subCard title="Username & IDs" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <AuthorFieldData
                    authorFieldDataId="aut-org-staff-id"
                    data={rowData.aut_org_staff_id}
                    name="aut_org_staff_id"
                    {...orgStaffId}
                    {...props}
                    // {...orgStaffIdError}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-org-username"
                    data={rowData.aut_org_username}
                    name="aut_org_username"
                    {...orgUsername}
                    {...(!!orgUsernameError ? orgUsernameError : {})}
                    {...props}
                    InputProps={{
                        ...((!!rowData.aut_org_username && {
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
                                                {rowData.aut_name_overridden ? (
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
                <AuthorFieldData
                    authorFieldDataId="aut-org-student-id"
                    data={rowData.aut_org_student_id}
                    name="aut_org_student_id"
                    {...props}
                    {...orgStudentId}
                    // {...orgStudentIdError}
                />
                <AuthorFieldData
                    authorFieldDataId="aut-student-username"
                    data={rowData.aut_student_username}
                    name="aut_student_username"
                    {...studentUsername}
                    {...props}
                    {...studentUsernameError}
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
    onChange: PropTypes.func,
};

export default React.memo(UsernameIdColumnData);
