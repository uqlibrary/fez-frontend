import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';

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

const AdminPanel = ({ action, locale, isOpen, title, id, onCancelAction, onClose, parentId, ...props }) => {
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

    const {
        handleSubmit,
        control,
        formState: { isDirty, isSubmitting, errors },
    } = useForm({
        defaultValues: props.initialValues,
        mode: 'onChange',
        shouldUnregister: action === ACTION.ADD,
    });
    const [apiError, setApiError] = React.useState('');

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.();
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
                        <form
                            onSubmit={handleSubmit(async data => {
                                try {
                                    setApiError('');
                                    await props.onAction(data);
                                } catch (error) {
                                    setApiError(error.message);
                                }
                            })}
                        >
                            <Box
                                id={`${componentId}-vc-content`}
                                data-testid={`${componentId}-vc-content`}
                                sx={{
                                    minWidth: 300,
                                    padding: 2,
                                }}
                            >
                                <Grid container padding={0} spacing={2}>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_title">{locale.form.title}</label>
                                        <Controller
                                            name="cvo_title"
                                            control={control}
                                            rules={{ required: 'Required' }}
                                            render={({ field }) => (
                                                <>
                                                    <TextField
                                                        {...field}
                                                        variant="standard"
                                                        required
                                                        inputProps={{ maxLength: 255 }}
                                                        fullWidth
                                                        textFieldId="cvo-title"
                                                        disabled={isSubmitting}
                                                    />
                                                    {errors.cvo_title && (
                                                        <p data-testid="title-require-error" style={{ color: 'red' }}>
                                                            {errors.cvo_title.message}
                                                        </p>
                                                    )}
                                                </>
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
                                                    inputProps={{ maxLength: 255 }}
                                                    fullWidth
                                                    textFieldId="cvo-desc"
                                                    multiline
                                                    minRows={2}
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_external_id" style={{ display: 'block' }}>
                                            {locale.form.externalId}
                                        </label>
                                        <Controller
                                            name="cvo_external_id"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    textFieldId="cvo-external-id"
                                                    inputProps={{ maxLength: 10 }}
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_hide" style={{ display: 'block' }}>
                                            {locale.form.inactive}
                                        </label>
                                        <Controller
                                            name="cvo_hide"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    {...field}
                                                    checked={!!field.value}
                                                    id="cvo-hide-input"
                                                    data-analyticsid="cvo-hide-input"
                                                    data-testid="cvo-hide-input"
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Grid
                                container
                                id={`${rootId}-actions`}
                                data-testid={`${rootId}-actions`}
                                sx={{ marginTop: 2 }}
                            >
                                <Grid item xs={12} justifyContent="flex-end" display={'flex'}>
                                    <Button
                                        variant={'outlined'}
                                        onClick={_onCancelAction}
                                        id={`${rootId}-cancel-button`}
                                        data-testid={`${rootId}-cancel-button`}
                                        fullWidth={isMobileView}
                                        disabled={isSubmitting}
                                        sx={{ marginInlineEnd: 2 }}
                                    >
                                        {locale.cancelButtonLabel}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        autoFocus
                                        color={'primary'}
                                        type={'submit'}
                                        id={`${rootId}-action-button`}
                                        data-testid={`${rootId}-action-button`}
                                        fullWidth={isMobileView}
                                        disabled={!isDirty || isSubmitting || JSON.stringify(errors) !== '{}'}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={25}
                                                id={`${rootId}-progress`}
                                                data-testid={`${rootId}-progress`}
                                            />
                                        ) : (
                                            locale.confirmButtonLabel
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                            {!!apiError && (
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Alert
                                            alertId={`${rootId}-alert`}
                                            title={locale.form.error.title}
                                            type="error_outline"
                                            message={apiError}
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
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onClose: PropTypes.func,
    props: PropTypes.object,
    parentId: PropTypes.number,
    initialValues: PropTypes.object,
};

export default React.memo(AdminPanel);
