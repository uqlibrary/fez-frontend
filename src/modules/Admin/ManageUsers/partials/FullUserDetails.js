import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FormProvider } from 'react-hook-form';
import { useForm } from 'hooks';
import { useWatch } from 'react-hook-form';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { ScrollToSection } from 'modules/SharedComponents/Toolbox/ScrollToSection';
import NameData from './NameData';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from 'locale/components';
import UserDetailsRow from './UserDetailsRow';
import { checkForExistingUser } from 'actions';

const classes = {
    background: {
        backgroundColor: 'secondary.light',
        padding: 2,
    },
};

export const FullUserDetails = ({ disabled, data: rowData, mode, onEditingApproved, onEditingCanceled }) => {
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
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

    const disableSubmit = !isDirty || isSubmitting || JSON.stringify(errors) !== '{}';

    const {
        form: { deleteConfirmationLocale, editButton, cancelButton, addButton },
    } = locale.components.manageUsers;

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
    const watchedFields = useWatch({ control, name: ['usr_username'] });
    // Track previous field values to validate only the changed field
    React.useEffect(() => {
        setApiError('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(watchedFields)]);

    const validateField = async (field, value, usrId, asyncErrors) => {
        try {
            await dispatch(
                checkForExistingUser(
                    value,
                    field,
                    usrId,
                    locale.components.manageUsers.editRow.validation,
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
        const fields = ['usr_username'];
        const asyncErrors = {}; // Modify to retrieve actual asyncErrors if available

        const validationPromises = fields.map(async field => {
            const fieldValue = data[field];
            const usrId = data?.usr_id;
            if (fieldValue && fieldValue !== '' && isFieldChanged(field)) {
                return validateField(field, fieldValue, usrId, asyncErrors);
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
            {locale.components.manageUsers.validationAlertTitle}
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

            // Convert empty strings to null as empty string won't submit successfully
            const fields = ['usr_administrator', 'usr_super_administrator'];
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
        <React.Fragment>
            {(mode === 'update' || mode === 'add') && (
                <TableRow onKeyDown={handleKeyPress} id="user-edit-row" data-testid="user-edit-row">
                    <TableCell colSpan={9}>
                        <ScrollToSection scrollToSection>
                            <FormProvider {...validatedForm}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Box sx={{ ...classes.background }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <NameData />
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
                                                            id={`users-${mode}-this-user-save`}
                                                            data-analyticsid={`users-${mode}-this-user-save`}
                                                            data-testid={`users-${mode}-this-user-save`}
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
                                                            id={`users-${mode}-this-user-cancel`}
                                                            data-analyticsid={`users-${mode}-this-user-cancel`}
                                                            data-testid={`users-${mode}-this-user-cancel`}
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
                    sx={{ ...classes.background }}
                >
                    <ConfirmationBox
                        confirmationBoxId="users-delete-this-user-confirmation"
                        onAction={handleDelete}
                        onClose={handleCancelDelete}
                        isOpen={isOpen}
                        locale={deleteConfirmationLocale}
                    />
                    <TableCell colSpan={3}>
                        <UserDetailsRow rowData={rowData} />
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
};

FullUserDetails.propTypes = {
    data: PropTypes.object,
    disabled: PropTypes.bool,
    mode: PropTypes.string,
    onEditingApproved: PropTypes.func,
    onEditingCanceled: PropTypes.func,
    rowData: PropTypes.object,
};

export default React.memo(FullUserDetails);
