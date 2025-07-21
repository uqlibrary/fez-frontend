import { checkForExistingAuthor } from 'actions';
import { useDispatch } from 'react-redux';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { FormProvider } from 'react-hook-form';
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'hooks';
import { useWatch } from 'react-hook-form';

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

export const FullAuthorDetails = ({ disabled, data: rowData, mode, onEditingApproved, onEditingCanceled }) => {
    const validatedForm = useForm({
        defaultValues: rowData,
        mode: 'onChange',
        shouldUseNativeValidation: false, // Disable HTML5 form validation
    });
    const {
        handleSubmit,
        control,
        trigger,
        formState: { isDirty, isSubmitting, errors, dirtyFields },
    } = validatedForm;
    const isFieldChanged = fieldName => {
        return dirtyFields[fieldName]; // Returns true if the field is changed
    };
    const [apiError, setApiError] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const dispatch = useDispatch();
    const { setError, clearErrors } = validatedForm;

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const disableSubmit = !isDirty || isSubmitting || JSON.stringify(errors) !== '{}';

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

    React.useEffect(() => {
        trigger();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger]);

    const watchedFields = useWatch({
        control,
        name: ['aut_org_username', 'aut_org_staff_id', 'aut_student_username', 'aut_org_student_id'],
    });
    // Track previous field values to validate only the changed field
    React.useEffect(() => {
        setApiError('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(watchedFields)]);

    const validateField = async (field, value, autId, asyncErrors) => {
        try {
            await dispatch(
                checkForExistingAuthor(
                    value,
                    field,
                    autId,
                    locale.components.manageAuthors.editRow.validation,
                    asyncErrors,
                ),
            );
            clearErrors(field); // Clear errors if validation passes
        } catch (error) {
            setError(field, { type: 'manual', message: error.message }); // Set error if validation fails
            throw error; // Propagate error to caller
        }
    };

    const validateAsync = async data => {
        const fields = ['aut_org_username', 'aut_org_staff_id', 'aut_student_username', 'aut_org_student_id'];
        const asyncErrors = {}; // Modify to retrieve actual asyncErrors if available

        const validationPromises = fields.map(async field => {
            const fieldValue = data[field];
            const autId = data?.aut_id;
            if (fieldValue && fieldValue !== '' && isFieldChanged(field)) {
                return validateField(field, fieldValue, autId, asyncErrors);
            } else {
                clearErrors(field); // Clear errors for fields with no value
                return Promise.resolve();
            }
        });

        try {
            await Promise.all(validationPromises);
            clearErrors(); // Clear all errors if validation passes
            return Promise.resolve('Validation passed');
        } catch (error) {
            return Promise.reject(error.message);
        }
    };

    const getAllUniqueErrorMessages = () => {
        // Collect manual errors
        const errorMessages = [
            ...Object.values(errors)
                .filter(error => error.type === 'manual') // Filter only errors with type 'manual'
                .map(error => error.message), // Map to get the message
            apiError,
        ].filter(Boolean); // Remove falsy values like null or undefined

        const uniqueMessages = new Set(errorMessages);
        return Array.from(uniqueMessages);
    };

    const errorMessagesList = getAllUniqueErrorMessages();
    const message = (
        <span>
            {locale.components.manageAuthors.validationAlertTitle}
            <ul>
                {errorMessagesList &&
                    errorMessagesList.length > 0 &&
                    errorMessagesList.map((item, index) => (
                        <li key={`key-${index}`} data-testid={`key-${index}`}>
                            {item}
                        </li>
                    ))}
            </ul>
        </span>
    );
    const alertProps = {
        message: message,
        title: 'Validation',
        type: 'warning',
    };

    const onSubmit = async data => {
        setSubmitting(true);
        try {
            await validateAsync(data);

            // Convert empty strings to null as empty string will violate unique key constraints
            const fields = ['aut_org_username', 'aut_org_staff_id', 'aut_student_username'];
            fields.forEach(field => {
                if (data[field] === '') {
                    data[field] = null;
                }
            });

            clearErrors();

            await handleSave(data);
        } catch (error) {
            setApiError(error);
        } finally {
            setSubmitting(false);
        }
        return true;
    };

    return (
        <Box display={'table'}>
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

                                            {(!!apiError || !!Object.keys(errors).length) && (
                                                <Grid xs={12}>
                                                    <Alert alertId="api_error_alert" {...alertProps} />
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
        </Box>
    );
};

FullAuthorDetails.propTypes = {
    data: PropTypes.object,
    disabled: PropTypes.bool,
    mode: PropTypes.string,
    onEditingApproved: PropTypes.func,
    onEditingCanceled: PropTypes.func,
};

export default React.memo(FullAuthorDetails);
