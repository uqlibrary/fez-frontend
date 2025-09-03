import React from 'react';
import PropTypes from 'prop-types';

import { useForm, Controller } from 'react-hook-form';

import Grid from '@mui/material/GridLegacy';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const rootId = 'quicklinks-admin';

const QuickLinkAdmin = ({ locale, item, action, onSubmitClick, onCancelClick, busy = false }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ defaultValues: item });

    const { isDelete, primaryButtonLabel, primaryButtonLabelBusy } = React.useMemo(() => {
        const isDelete = action === 'DELETE';
        const primaryButtonLabel = isDelete ? locale.button.delete : locale.button.save;
        const primaryButtonLabelBusy = isDelete ? locale.button.deleteBusy : locale.button.saveBusy;
        return { isDelete, primaryButtonLabel, primaryButtonLabelBusy };
    }, [action, locale.button.delete, locale.button.deleteBusy, locale.button.save, locale.button.saveBusy]);

    const buttonArray = [
        <Button
            type="submit"
            fullWidth
            color={isDelete ? 'error' : 'primary'}
            variant="contained"
            disabled={busy}
            data-testid={`${rootId}-action-button`}
        >
            {busy ? primaryButtonLabelBusy : primaryButtonLabel}
        </Button>,
        <Button
            fullWidth
            variant="contained"
            color="default"
            onClick={onCancelClick}
            disabled={busy}
            data-testid={`${rootId}-alt-button`}
        >
            {locale.button.cancel}
        </Button>,
    ];
    const buttons = isDelete ? buttonArray.reverse() : buttonArray;

    return (
        <form onSubmit={handleSubmit(onSubmitClick)} className="formAddQuickLink" data-testid={`${rootId}-form`}>
            <Grid container mt={2} spacing={2}>
                <Grid item xs={12}>
                    <Box data-testid="qlk_title">
                        <Controller
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    variant="standard"
                                    label={`${locale.fields.title}*`}
                                    multiline
                                    maxRows={2}
                                    disabled={isDelete}
                                    error={!!!field.value}
                                    slotProps={{
                                        htmlInput: {
                                            'data-testid': 'qlk_title-input',
                                        },
                                    }}
                                />
                            )}
                            rules={{ required: true }}
                            name="qlk_title"
                            control={control}
                        />
                        {errors.qlk_title?.type === 'required' && (
                            <Box sx={{ color: 'error.main' }} fontSize={'0.75rem'} role="alert">
                                Required
                            </Box>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box data-testid="qlk_link">
                        <Controller
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    variant="standard"
                                    label={`${locale.fields.link}*`}
                                    multiline
                                    maxRows={3}
                                    disabled={isDelete}
                                    error={!!!field.value}
                                    slotProps={{
                                        htmlInput: {
                                            'data-testid': 'qlk_link-input',
                                        },
                                    }}
                                />
                            )}
                            rules={{ required: true }}
                            name="qlk_link"
                            control={control}
                        />
                        {errors.qlk_link?.type === 'required' && (
                            <Box sx={{ color: 'error.main' }} fontSize={'0.75rem'} role="alert">
                                Required
                            </Box>
                        )}
                    </Box>
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
