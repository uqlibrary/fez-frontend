import React from 'react';
import PropTypes from 'prop-types';

import { useForm, Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const QuickLinkAdmin = ({ item, action, onSubmitClick, onCancelClick, busy = false }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ defaultValues: item });

    const isDelete = action === 'DELETE';
    const primaryButtonLabel = isDelete ? 'Delete' : 'Save';
    const primaryButtonLabelBusy = isDelete ? 'Deleting...' : 'Saving...';

    const buttonArray = [
        <Button type="submit" fullWidth color={isDelete ? 'error' : 'primary'} variant="contained" disabled={busy}>
            {busy ? primaryButtonLabelBusy : primaryButtonLabel}
        </Button>,
        <Button fullWidth variant="contained" color="default" onClick={onCancelClick} disabled={busy}>
            Cancel
        </Button>,
    ];
    const buttons = isDelete ? buttonArray.reverse() : buttonArray;

    return (
        <form onSubmit={handleSubmit(onSubmitClick)} className="formAddQuickLink">
            <Grid container mt={2} spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                variant="standard"
                                label="Title"
                                required
                                multiline
                                maxRows={2}
                                disabled={isDelete}
                            />
                        )}
                        name="title"
                        control={control}
                    />
                    {errors.title && errors.title.message}
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                variant="standard"
                                label="Link"
                                required
                                multiline
                                maxRows={3}
                                disabled={isDelete}
                            />
                        )}
                        name="target"
                        control={control}
                    />
                    {errors.target && errors.target.message}
                </Grid>
                {buttons.map((button, index) => (
                    <Grid item xs={12} key={index}>
                        {button}
                    </Grid>
                ))}
            </Grid>
        </form>
    );
};

QuickLinkAdmin.propTypes = {
    item: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    busy: PropTypes.bool,
};

export default React.memo(QuickLinkAdmin);
