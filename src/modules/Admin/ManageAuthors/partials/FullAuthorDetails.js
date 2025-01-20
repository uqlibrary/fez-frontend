import AuthorFieldData from './AuthorFieldData';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { validation } from 'config';
import OverriddenIcon from '@mui/icons-material/Lock';
import NotOverriddenIcon from '@mui/icons-material/LockOpenOutlined';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
// import debounce from 'debounce-promise';
import { DEBOUNCE_VALUE } from './manageAuthorConfig';
import { checkForExistingAuthor } from 'actions';
import { useDispatch } from 'react-redux';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
// import { Controller } from 'react-hook-form';
// import Controller from 'modules/SharedComponents/Toolbox/ReactHookForm/components/Controller.js';
import debounce from 'lodash.debounce';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { FormProvider } from 'react-hook-form';
import React from 'react';
import PropTypes from 'prop-types';
// import Immutable from 'immutable';
// import { useSelector } from 'react-redux';
// import { getFormSyncErrors, getFormAsyncErrors, reduxForm, getFormValues } from 'redux-form/immutable';
// import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
// import { useValidatedForm } from 'hooks';
// import { Controller, useForm } from 'react-hook-form';
import { useValidatedForm } from 'hooks';
// import debounce from 'debounce-promise';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

import { ScrollToSection } from 'modules/SharedComponents/Toolbox/ScrollToSection';
import ColumnData from './ColumnData';
import NameData from './NameData';
import LeastAuthorData from './LeastAuthorData';
import UsernameIdData from './UsernameIdData';
import ResearcherIdentifierData from './ResearcherIdentifierData';
import NotesData from './NotesData';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from 'locale/components';
// import { FORM_NAME, DEBOUNCE_VALUE } from './manageAuthorConfig'; //todo: remove the file
// import { checkForExisting } from '../helpers';

// console.log('Controller=', Controller);
export const FullAuthorDetails = ({
    disabled,
    data: rowData,
    mode,
    onEditingApproved,
    onEditingCanceled,
    submitting,
}) => {
    const validatedForm = useValidatedForm({
        defaultValues: rowData,
        mode: 'onChange',
    });
    const {
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
    } = validatedForm;
    const [apiError, setApiError] = React.useState('');

    const dispatch = useDispatch();
    const { control, watch, getValues, setValue, setError, trigger, clearErrors } = validatedForm;
    const [autOrgUsername, setAutOrgUsername] = React.useState(getValues('aut_org_username2'));
    const [watchedField] = watch(['aut_org_username2']);
    React.useEffect(() => {
        setAutOrgUsername(watchedField);
    }, [watchedField]);
    const [autNameOverridden, setAutNameOverridden] = React.useState(getValues('aut_name_overridden'));
    const handleNameOverridden = () => {
        setAutNameOverridden(Number(!autNameOverridden));
        setValue('aut_name_overridden', Number(!autNameOverridden));
        setError('aut_org_username2', { type: 'manual', message: 'Error message' });
    };

    console.dummy = () => {};
    console.dummy(
        'checkForExistingAuthor=',
        checkForExistingAuthor,
        dispatch,
        trigger,
        clearErrors,
        DEBOUNCE_VALUE,
        debounce,
    );
    const myCheckForExisting = async (value, field) => {
        console.log('field', field);
        setError(field, { type: 'manual', message: 'error.message' }); // Set error if validation fails
        trigger(field);
        // setApiError('error.message'); // Set error if validation fails
        return 'error.message: ' + value + ', ' + field;
    };
    const validateAsync = async value => {
        const result = await myCheckForExisting(value, 'aut_org_username2');
        return result;
    };
    // const myCheckForExisting = debounce(async (value, field) => {
    //     return 'error.message: ' + value + ', ' + field;
    // }, DEBOUNCE_VALUE);
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // const myCheckForExisting = React.useCallback(
    //     debounce(async (value, field) => {
    //         return 'error.message: ' + value + ', ' + field;
    //         // console.log('debounce checkForExisting', value, field);
    //         // if (Math.PI > 3.141) return 'error.message: ' + value + ', ' + field;
    //         // // if (Math.PI > 3.14) return; // disable the code block
    //         // const autId = getValues('aut_id');
    //         // const asyncErrors = {};
    //         // try {
    //         //     await dispatch(
    //         //         checkForExistingAuthor(
    //         //             value, // Field value to search
    //         //             field, // Field name to validate
    //         //             autId, // Author ID
    //         //             locale.components.manageAuthors.editRow.validation, // Validation messages
    //         //             asyncErrors,
    //         //         ),
    //         //     );

    //         //     clearErrors(field); // Clear errors if validation passes
    //         // } catch (error) {
    //         //     console.log('setError', field, error.message);
    //         //     setError(field, { type: 'manual', message: error.message }); // Set error if validation fails
    //         //     trigger(field);
    //         // }
    //         // return 'test';
    //     }, DEBOUNCE_VALUE),
    //     [],
    // );

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    // const formValues = useSelector(state => getFormValues(FORM_NAME)(state));
    // const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    // const asyncFormErrors = useSelector(state => getFormAsyncErrors(FORM_NAME)(state));

    const disableSubmit = !isDirty || isSubmitting || JSON.stringify(errors) !== '{}' || !!apiError;
    // const disableSubmit =
    //     (!!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0) ||
    //     (!!asyncFormErrors &&
    //         asyncFormErrors instanceof Immutable.Map &&
    //         Object.keys(asyncFormErrors.toJS()).length > 0);

    const {
        form: { deleteConfirmationLocale, editButton, cancelButton, addButton },
    } = locale.components.manageAuthors;

    const handleSave = formValues => onEditingApproved(mode, formValues, rowData);
    const handleDelete = () => onEditingApproved(mode, rowData, rowData);
    const handleCancel = () => onEditingCanceled(mode, rowData);
    const handleKeyPress = e => e.key === 'Escape' && onEditingCanceled(mode, rowData);

    const handleCancelDelete = () => {
        handleCancel();
        hideConfirmation();
    };

    React.useEffect(() => {
        if (mode === 'delete') {
            showConfirmation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    return (
        <React.Fragment>
            {(mode === 'update' || mode === 'add') && (
                <TableRow onKeyDown={handleKeyPress} id="author-edit-row" data-testid="author-edit-row">
                    <TableCell colSpan={4}>
                        <ScrollToSection scrollToSection>
                            <FormProvider {...validatedForm}>
                                <form
                                    onSubmit={handleSubmit(async data => {
                                        try {
                                            if ((await validateAsync()) !== true) return false;
                                            await handleSave(data);
                                        } catch (error) {
                                            console.error(error);
                                            setApiError(error.message);
                                        }
                                        return true;
                                    })}
                                >
                                    <Box sx={{ backgroundColor: 'secondary.light', padding: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="dummy"
                                                    required
                                                    onKeyDown={ev => {
                                                        if (ev.key === 'Enter') {
                                                            setError('dummy', {
                                                                type: 'manual',
                                                                message: 'press enter',
                                                            });
                                                            console.log('set error enter');
                                                        }
                                                    }}
                                                    error={!!errors.dummy}
                                                    errorText={errors.dummy?.message}
                                                />
                                                <Button
                                                    onClick={() => {
                                                        setError('dummy', {
                                                            type: 'manual',
                                                            message: 'click',
                                                        });
                                                        console.log('set error click');
                                                    }}
                                                >
                                                    set error
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Field
                                                    control={control}
                                                    component={AuthorFieldData}
                                                    onKeyDown={ev => {
                                                        if (ev.key === 'Enter') {
                                                            setError('aut_org_username2', 'press enter');
                                                            console.log('set error enter');
                                                        }
                                                    }}
                                                    authorFieldDataId="aut-org-username"
                                                    name="aut_org_username2"
                                                    validate={[validation.spacelessMaxLength20Validator]}
                                                    InputProps={{
                                                        ...((!!autOrgUsername && {
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Tooltip title={'isUsernameOverridden.label'}>
                                                                        <span>
                                                                            <IconButton
                                                                                aria-label={
                                                                                    'isUsernameOverridden.label'
                                                                                }
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
                                            </Grid>

                                            <Grid item xs={12}>
                                                <NameData />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <UsernameIdData />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ResearcherIdentifierData />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <NotesData />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid
                                                    container
                                                    direction="row-reverse"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    spacing={2}
                                                >
                                                    <Grid item>
                                                        <Button
                                                            id={`authors-${mode}-this-author-save`}
                                                            data-analyticsid={`authors-${mode}-this-author-save`}
                                                            data-testid={`authors-${mode}-this-author-save`}
                                                            disabled={disableSubmit || submitting || disabled}
                                                            variant="contained"
                                                            color="primary"
                                                            type="submit"
                                                        >
                                                            {mode === 'update' ? editButton : addButton}
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            id={`authors-${mode}-this-author-cancel`}
                                                            data-analyticsid={`authors-${mode}-this-author-cancel`}
                                                            data-testid={`authors-${mode}-this-author-cancel`}
                                                            disabled={disabled}
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={handleCancel}
                                                        >
                                                            {cancelButton}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            {!!apiError && (
                                                <Grid xs={12}>
                                                    <Alert
                                                        alertId="api_error_alert"
                                                        type="error_outline"
                                                        message={apiError}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                </form>
                            </FormProvider>
                        </ScrollToSection>
                    </TableCell>
                </TableRow>
            )}
            {mode === 'delete' && (
                <TableRow
                    onKeyDown={handleKeyPress}
                    id="author-delete-row"
                    data-testid="author-delete-row"
                    sx={{ backgroundColor: 'secondary.light', padding: 2 }}
                >
                    <ConfirmationBox
                        confirmationBoxId="authors-delete-this-author-confirmation"
                        onAction={handleDelete}
                        onClose={handleCancelDelete}
                        isOpen={isOpen}
                        locale={deleteConfirmationLocale}
                    />
                    <TableCell>
                        <Checkbox disabled size="small" />
                    </TableCell>
                    <TableCell>
                        <ColumnData data={rowData.aut_id} columnDataId={`aut-id-${rowData.tableData.id}`} />
                    </TableCell>
                    <TableCell colSpan={3}>
                        <LeastAuthorData rowData={rowData} />
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
};

FullAuthorDetails.propTypes = {
    data: PropTypes.object,
    disabled: PropTypes.bool,
    mode: PropTypes.string,
    onEditingApproved: PropTypes.func,
    onEditingCanceled: PropTypes.func,
    submitting: PropTypes.bool,
};

// const FullAuthorDetailsReduxForm = reduxForm({
//     form: FORM_NAME,
//     asyncValidate: debounce(checkForExisting, DEBOUNCE_VALUE),//todo: asyncValidate
//     asyncChangeFields: ['aut_org_username', 'aut_org_staff_id', 'aut_student_username', 'aut_org_student_id'],
// })(FullAuthorDetails);

export default React.memo(FullAuthorDetails);
