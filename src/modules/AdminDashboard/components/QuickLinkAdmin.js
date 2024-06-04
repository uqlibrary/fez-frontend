import React from 'react';
import PropTypes from 'prop-types';

import { useForm, Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const QuickLinkAdmin = ({ locale, item, action, onSubmitClick, onCancelClick, busy = false }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ defaultValues: item });

    const isDelete = action === 'DELETE';
    const primaryButtonLabel = isDelete ? locale.button.delete : locale.button.save;
    const primaryButtonLabelBusy = isDelete ? locale.button.deleteBusy : locale.button.saveBusy;

    const buttonArray = [
        <Button type="submit" fullWidth color={isDelete ? 'error' : 'primary'} variant="contained" disabled={busy}>
            {busy ? primaryButtonLabelBusy : primaryButtonLabel}
        </Button>,
        <Button fullWidth variant="contained" color="default" onClick={onCancelClick} disabled={busy}>
            {locale.button.cancel}
        </Button>,
    ];
    const buttons = isDelete ? buttonArray.reverse() : buttonArray;

    return (
        <form onSubmit={handleSubmit(onSubmitClick)} className="formAddQuickLink" data-testid="quicklinks-admin-form">
            <Grid container mt={2} spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                variant="standard"
                                label={locale.fields.title}
                                required
                                multiline
                                maxRows={2}
                                disabled={isDelete}
                                inputProps={{
                                    'data-testid': 'qlk_title',
                                }}
                            />
                        )}
                        name="qlk_title"
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
                                label={locale.fields.link}
                                required
                                multiline
                                maxRows={3}
                                disabled={isDelete}
                                inputProps={{
                                    'data-testid': 'qlk_link',
                                }}
                            />
                        )}
                        name="qlk_link"
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
    locale: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    busy: PropTypes.bool,
};

export default React.memo(QuickLinkAdmin);
