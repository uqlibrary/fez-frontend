import { useFormContext } from 'react-hook-form';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { useWatch } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import OverriddenIcon from '@mui/icons-material/Lock';
import NotOverriddenIcon from '@mui/icons-material/LockOpenOutlined';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import AuthorFieldData from './AuthorFieldData';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { default as locale } from 'locale/components';
import { validation } from 'config';

export const UsernameIdColumnData = () => {
    const {
        editRow: {
            fields: { orgStaffId, orgStudentId, orgUsername, studentUsername, refNum, isUsernameOverridden },
        },
    } = locale.components.manageAuthors;

    const { control, setValue, getValues } = useFormContext();

    const [autOrgUsername, setAutOrgUsername] = React.useState(getValues('aut_org_username'));
    const [watchedField] = useWatch({ control, name: ['aut_org_username'] });
    React.useEffect(() => {
        setAutOrgUsername(watchedField);
    }, [watchedField]);

    const [autNameOverridden, setAutNameOverridden] = React.useState(getValues('aut_name_overridden'));
    const handleNameOverridden = () => {
        setAutNameOverridden(Number(!autNameOverridden));
        setValue('aut_name_overridden', Number(!autNameOverridden), { shouldDirty: true });
    };

    return (
        <StandardCard subCard title="Username & IDs" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    {...orgStaffId}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-org-staff-id"
                    name="aut_org_staff_id"
                    validate={[validation.spacelessMaxLength12Validator]}
                />
                <Field
                    {...orgUsername}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-org-username"
                    name="aut_org_username"
                    validate={[validation.spacelessMaxLength20Validator]}
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
                                                data-analyticsid="aut-name-overridden"
                                                data-testid="aut-name-overridden"
                                                size="large"
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
                    {...orgStudentId}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-org-student-id"
                    name="aut_org_student_id"
                    validate={[validation.spacelessMaxLength11Validator]}
                />
                <Field
                    {...studentUsername}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-student-username"
                    name="aut_student_username"
                    validate={[validation.spacelessMaxLength30Validator]}
                />
                <Field
                    {...refNum}
                    control={control}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-ref-num"
                    name="aut_ref_num"
                    validate={[validation.spacelessMaxLength50Validator]}
                />
            </Grid>
        </StandardCard>
    );
};
UsernameIdColumnData.propTypes = {
    control: PropTypes.object.isRequired,
    validatedForm: PropTypes.object.isRequired,
};

export default React.memo(UsernameIdColumnData);
