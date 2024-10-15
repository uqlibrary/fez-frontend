import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { ACTION } from '../ControlledVocabularyContext';

const rootId = 'update_dialog';

const AdminPanel = ({
    action,
    locale,
    isOpen,
    title,
    id,
    hideActionButton = false,
    hideCancelButton = false,
    onCancelAction,
    onClose,
    noMinContentWidth,
    error,
    parentId,
    ...props
}) => {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid },
        reset,
    } = useForm({
        defaultValues: props.initialValues,
        mode: 'onChange', // Enables validation to update on input change
    });

    const componentId = `${rootId}-${id}`;

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.only('xs')) || false;

    let containerStyles;
    if (action === ACTION.ADD) {
        containerStyles = !!parentId
            ? {}
            : {
                  backgroundColor: '#eee',
                  padding: '20px',
                  boxShadow: 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
              };
    } else if (action === ACTION.EDIT) {
        containerStyles = {
            backgroundColor: '#eee',
            padding: '20px',
            boxShadow: 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
        };
    }

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.();
        reset(); // Resets the form when cancel is clicked
    };

    return (
        <>
            {isOpen && (
                <Box
                    sx={{
                        marginBlockEnd: 2,
                        ...containerStyles,
                    }}
                    data-testid={`${componentId}-container`}
                >
                    <StandardCard title={title} standardCardId={`${componentId}`} subCard>
                        <form onSubmit={handleSubmit(props.onSubmit)}>
                            <Box
                                id={`${componentId}-vc-content`}
                                data-testid={`${componentId}-vc-content`}
                                sx={{ minWidth: !noMinContentWidth ? 300 : 'auto', padding: 2 }}
                            >
                                <Grid container padding={0} spacing={2}>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_title">{locale.form.title}</label>
                                        <Controller
                                            name="cvo_title"
                                            control={control}
                                            rules={{ required: 'Required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    required
                                                    fullWidth
                                                    inputProps={{ maxLength: 255 }}
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_desc">{locale.form.description}</label>
                                        <Controller
                                            name="cvo_desc"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    fullWidth
                                                    multiline
                                                    minRows={2}
                                                    inputProps={{ maxLength: 255 }}
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_external_id">{locale.form.externalId}</label>
                                        <Controller
                                            name="cvo_external_id"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    inputProps={{ maxLength: 10 }}
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_image_filename">{locale.form.filename}</label>
                                        <Controller
                                            name="cvo_image_filename"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    fullWidth
                                                    inputProps={{ maxLength: 64 }}
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_order">{locale.form.order}</label>
                                        <Controller
                                            name="cvo_order"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField {...field} variant="standard" disabled={isSubmitting} />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_hide">{locale.form.inactive}</label>
                                        <Controller
                                            name="cvo_hide"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            {(!hideCancelButton || !hideActionButton) && (
                                <Grid container sx={{ marginTop: 2 }}>
                                    <Grid item xs={12} justifyContent="flex-end" display={'flex'}>
                                        {!hideCancelButton && (
                                            <Button
                                                variant="outlined"
                                                onClick={_onCancelAction}
                                                disabled={isSubmitting}
                                                fullWidth={isMobileView}
                                                sx={{ marginInlineEnd: 2 }}
                                            >
                                                {locale.cancelButtonLabel}
                                            </Button>
                                        )}
                                        {!hideActionButton && (
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                color="primary"
                                                disabled={!isValid || isSubmitting}
                                                fullWidth={isMobileView}
                                            >
                                                {isSubmitting ? (
                                                    <CircularProgress size={25} />
                                                ) : (
                                                    locale.confirmButtonLabel
                                                )}
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                            {error && (
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Alert
                                            alertId={`${rootId}-alert`}
                                            title={locale.form.error.title}
                                            type="error_outline"
                                            message={error.message}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </form>
                    </StandardCard>
                </Box>
            )}
        </>
    );
};

AdminPanel.propTypes = {
    action: PropTypes.oneOf(['', 'add', 'edit']).isRequired,
    locale: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onClose: PropTypes.func,
    error: PropTypes.object,
    initialValues: PropTypes.object,
    parentId: PropTypes.string,
    onSubmit: PropTypes.func,
};

export default React.memo(AdminPanel);
