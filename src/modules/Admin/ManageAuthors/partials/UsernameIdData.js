import { checkForExistingAuthor, clearAuthorAlerts } from 'actions';
import { useDispatch } from 'react-redux';
import debounce from 'debounce-promise';
import { DEBOUNCE_VALUE } from './manageAuthorConfig';
// import { checkForExisting } from '../helpers'; // todo: delete file
import { useFormContext } from 'react-hook-form';
import React from 'react';
import PropTypes from 'prop-types';
// import { useSelector, useDispatch } from 'react-redux';
// import { Field, formValueSelector, change } from 'redux-form/immutable';//todo: replace formValueSelector and change
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

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
// import { FORM_NAME } from './manageAuthorConfig';//todo: delete file

// const selector = formValueSelector(FORM_NAME);

export const UsernameIdColumnData = () => {
    const dispatch = useDispatch();
    const {
        editRow: {
            fields: { orgStaffId, orgStudentId, orgUsername, studentUsername, refNum, isUsernameOverridden },
        },
    } = locale.components.manageAuthors;

    const { control, watch, setValue, getValues, setError, clearErrors } = useFormContext();

    const [autOrgUsername, setAutOrgUsername] = React.useState(getValues('aut_org_username'));
    const [watchedField] = watch(['aut_org_username']);
    React.useEffect(() => {
        setAutOrgUsername(watchedField);
    }, [watchedField]);

    const [autNameOverridden, setAutNameOverridden] = React.useState(getValues('aut_name_overridden'));
    const handleNameOverridden = () => {
        setAutNameOverridden(Number(!autNameOverridden));
        setValue('aut_name_overridden', Number(!autNameOverridden));
    };

    const watchedFields = watch([
        'aut_org_username',
        'aut_org_staff_id',
        'aut_student_username',
        'aut_org_student_id',
        'aut_id',
    ]);
    const autId = watchedFields[4]; // Assuming aut_id is at index 4
    console.log('watchedFields=', JSON.stringify(watchedFields));

    console.dummy = () => {};
    console.dummy('todo:', clearAuthorAlerts); // todo: see if clearAuthorAlerts is used
    // Debounced validation function
    const debouncedValidateField = React.useCallback(
        (field, value, autId, asyncErrors) => {
            debounce(async () => {
                try {
                    console.log('dispatching checkForExistingAuthor');
                    dispatch(
                        checkForExistingAuthor(
                            value, // Field value to search
                            field, // Field name to validate
                            autId, // Author ID
                            locale.components.manageAuthors.editRow.validation, // Validation messages
                            asyncErrors,
                        ),
                    );
                    clearErrors(field); // Clear errors if validation passes
                } catch (error) {
                    if (getValues(`${field}_error`) !== error.message) {
                        setError(field, { type: 'manual', message: error.message }); // Set error if validation fails
                        setValue(`${field}_error`, error.message); // Store the error message to compare later
                    }
                }
            }, DEBOUNCE_VALUE)();
        },
        [dispatch, clearErrors, getValues, setError, setValue],
    );

    // Track previous field values to validate only the changed field
    React.useEffect(() => {
        const fields = ['aut_org_username', 'aut_org_staff_id', 'aut_student_username', 'aut_org_student_id'];
        const asyncErrors = {}; // Modify to retrieve actual asyncErrors if available

        fields.forEach((field, index) => {
            const value = watchedFields[index];
            if (value && value !== '') {
                // debouncedValidateField(field, value, autId, asyncErrors);
                console.dummy = () => {};
                console.dummy(
                    'field, value, autId, asyncErrors=',
                    field,
                    value,
                    autId,
                    asyncErrors,
                    debouncedValidateField,
                );
                console.log('field=', field);
                console.log('value=', value);
            } else {
                clearErrors(field); // Clear errors for fields with no value
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(watchedFields)]);

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
