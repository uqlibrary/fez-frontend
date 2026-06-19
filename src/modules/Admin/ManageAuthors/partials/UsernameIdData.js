import { useFormContext } from 'react-hook-form';
import React from 'react';

import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import Grid from '@mui/material/GridLegacy';

import AuthorFieldData from './AuthorFieldData';
import DataSwitch from './DataSwitch';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { default as locale } from 'locale/components';
import { validation } from 'config';

export const UsernameIdColumnData = () => {
    const {
        editRow: {
            fields: { orgStaffId, orgStudentId, orgUsername, studentUsername, isRhdStudent, refNum },
        },
    } = locale.components.manageAuthors;
    const { control } = useFormContext();

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
                    {...isRhdStudent}
                    control={control}
                    component={DataSwitch}
                    data-testid="aut-rhd-student"
                    name="aut_rhd_student"
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

export default React.memo(UsernameIdColumnData);
