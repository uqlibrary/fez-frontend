import * as React from 'react';
import { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { DecoratedField } from 'modules/SharedComponents/Toolbox/ReactHookForm/components/Controller';
import { validation } from 'config';
import { useForm } from 'hooks';

export type FormValues = {
    label: string;
    isPublic: boolean;
};

export type CreateListDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (data: FormValues) => void;
    // forwarded to Dialog's PaperProps.ref so ListSplitButtonMenu's clickAwayExcludeRef can ignore clicks here
    paperRef?: React.Ref<HTMLDivElement>;
};

const AddNewDialog: React.FC<CreateListDialogProps> = ({ open, onClose, onCreate, paperRef }) => {
    const {
        control,
        reset,
        setFocus,
        safelyHandleSubmit,
        formState: { hasValidationError, validationErrors, serverError, isSubmitting },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            label: '',
            isPublic: false,
        },
    });
    const error = validationErrors.label?.message || (serverError ? 'Failed to create list, please try again.' : '');

    useEffect(() => {
        if (open) reset();
    }, [open, reset]);

    const handleClose = () => {
        // istanbul ignore else
        if (!isSubmitting) onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                transition: {
                    onEntered: () => setFocus('label'),
                },
                paper: {
                    ref: paperRef,
                    component: 'form',
                    onSubmit: safelyHandleSubmit(onCreate),
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    fontSize: '1rem',
                }}
            >
                New preferred journal list
                <IconButton
                    data-testid="add-to-user-list-dialog-close-button"
                    onClick={handleClose}
                    size="small"
                    disabled={isSubmitting}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Field
                    control={control}
                    component={TextField}
                    data-testid="add-to-user-list-dialog-label"
                    name="label"
                    fullWidth
                    size="small"
                    margin="dense"
                    label="List name"
                    disabled={isSubmitting}
                    validate={[validation.required, validation.maxLength255Validator]}
                    error={!!error}
                    errorText={error}
                />
                <Field
                    control={control}
                    name="isPublic"
                    component={({ value, onChange }: DecoratedField) => (
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Checkbox
                                    data-testid="add-to-user-list-dialog-is-public-input"
                                    checked={value}
                                    onChange={e => onChange(e.target.checked)}
                                    disabled={isSubmitting}
                                />
                            }
                            label="Make this list public"
                        />
                    )}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                <Button
                    data-testid="add-to-user-list-dialog-cancel-button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    size="small"
                >
                    Cancel
                </Button>
                <Button
                    data-testid="add-to-user-list-dialog-add-button"
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={hasValidationError || isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddNewDialog;
