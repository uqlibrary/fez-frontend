// import debounce from 'debounce-promise';
import { DEBOUNCE_VALUE } from './manageAuthorConfig';
import { checkForExistingAuthor } from 'actions';
import { useDispatch } from 'react-redux';
// import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
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
import { useForm } from 'hooks';
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
export const FullAuthorDetails = ({ disabled, data: rowData, mode, onEditingApproved, onEditingCanceled }) => {
    const validatedForm = useForm({
        defaultValues: rowData,
        mode: 'onChange',
    });
    const {
        handleSubmit,
        formState: { isDirty, isSubmitting, errors },
    } = validatedForm;
    const [apiError, setApiError] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const dispatch = useDispatch();
    const { control, watch, getValues, setValue, setError, trigger, clearErrors } = validatedForm;

    console.dummy = () => {};
    console.dummy(
        'checkForExistingAuthor=',
        checkForExistingAuthor,
        dispatch,
        trigger,
        clearErrors,
        DEBOUNCE_VALUE,
        debounce,
        control,
        watch,
        getValues,
        setValue,
        setError,
    );

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    // const formValues = useSelector(state => getFormValues(FORM_NAME)(state));
    // const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    // const asyncFormErrors = useSelector(state => getFormAsyncErrors(FORM_NAME)(state));

    const disableSubmit = !isDirty || isSubmitting || JSON.stringify(errors) !== '{}';
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

    const validateField = async (field, value, autId, asyncErrors) => {
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
            )
                .then(() => {
                    clearErrors(field); // Clear errors if validation passes
                })
                .catch(error => {
                    // console.error('Error during author validation:', error);
                    console.log('setError', field, error.message);
                    setError(field, { type: 'manual', message: error.message }); // Set error if validation fails
                    // trigger(field);
                });
            clearErrors(field); // Clear errors if validation passes
        } catch (error) {
            setError(field, { type: 'manual', message: error.message }); // Set error if validation fails
        }
    };

    const validateAsync = async value => {
        const fields = ['aut_org_username', 'aut_org_staff_id', 'aut_student_username', 'aut_org_student_id'];
        const asyncErrors = {}; // Modify to retrieve actual asyncErrors if available

        fields.forEach(field => {
            const value = getValues(field);
            const autId = getValues('aut_id');
            if (value && value !== '') {
                validateField(field, value, autId, asyncErrors);
            } else {
                clearErrors(field); // Clear errors for fields with no value
            }
        });

        return new Promise((resolve, reject) => {
            reject('all rejected' + (value ? '1' : '0')); // Reject with an Error object
        });
    };

    const onSubmit = async data => {
        setSubmitting(true);
        try {
            console.log('errors.aut_org_username2 before', errors?.aut_org_username2);
            await validateAsync(data);
            console.log('errors.aut_org_username2 after', errors?.aut_org_username2);

            clearErrors();

            await handleSave(data);
        } catch (error) {
            // If validation fails, show error
            // setError('aut_org_username2', { type: 'manual', message: error });
            console.log('errors.aut_org_username2 after2', errors?.aut_org_username2);
            setApiError(error); // Set error if validation fails
        } finally {
            setSubmitting(false);
        }
        console.log('errors.aut_org_username2 after3', errors?.aut_org_username2);
        return true;
    };

    return (
        <React.Fragment>
            {(mode === 'update' || mode === 'add') && (
                <TableRow onKeyDown={handleKeyPress} id="author-edit-row" data-testid="author-edit-row">
                    <TableCell colSpan={4}>
                        <ScrollToSection scrollToSection>
                            <FormProvider {...validatedForm}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Box sx={{ backgroundColor: 'secondary.light', padding: 2 }}>
                                        <Grid container spacing={2}>
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
};

// const FullAuthorDetailsReduxForm = reduxForm({
//     form: FORM_NAME,
//     asyncValidate: debounce(checkForExisting, DEBOUNCE_VALUE),//todo: asyncValidate
//     asyncChangeFields: ['aut_org_username', 'aut_org_staff_id', 'aut_student_username', 'aut_org_student_id'],
// })(FullAuthorDetails);

export default React.memo(FullAuthorDetails);
