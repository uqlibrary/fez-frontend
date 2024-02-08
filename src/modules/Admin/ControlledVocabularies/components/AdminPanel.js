/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, getFormValues, getFormSyncErrors, Field, propTypes } from 'redux-form/immutable';
import Immutable from 'immutable';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { ACTION } from '../ControlledVocabularyContext';

const rootId = 'update_dialog';

const renderCheckbox = ({ input, label, ...props }) => (
    <Checkbox label={label} checked={input.value ? true : false} onChange={input.onChange} {...props} />
);

const AdminPanel = ({
    action,
    locale,
    isOpen,
    title,
    id,
    hideActionButton = false,
    hideCancelButton = false,
    onAction,
    onCancelAction,
    onClose,
    noMinContentWidth,
    error,
    formValues,
    formErrors,
    handleSubmit,
    submitting,
    pristine,
    valid,
    parentId,
    ...props
}) => {
    const componentId = `${rootId}-${id}`;
    console.log(formValues.toJS(), formErrors, submitting);

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
    };

    React.useEffect(() => {
        if (!props.initialized) props.initialize(props.initialValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.initialized]);

    return (
        <>
            {isOpen && (
                <Box
                    sx={{
                        marginBlockEnd: 2,
                        ...containerStyles,
                    }}
                >
                    <StandardCard title={title} standardCardId={`${componentId}`} subCard>
                        <form onSubmit={handleSubmit}>
                            <Box
                                id={`${componentId}-content`}
                                data-testid={`${componentId}-content`}
                                sx={{ minWidth: !noMinContentWidth ? 300 : 'auto', padding: 2 }}
                            >
                                <Grid container padding={0} spacing={2}>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_title">Title</label>
                                        <Field
                                            component={TextField}
                                            variant="standard"
                                            required
                                            inputProps={{ maxLength: 255 }}
                                            fullWidth
                                            textFieldId="cvo-title"
                                            name="cvo_title"
                                            disabled={submitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_desc">Description</label>
                                        <Field
                                            component={TextField}
                                            variant="standard"
                                            inputProps={{ maxLength: 255 }}
                                            fullWidth
                                            textFieldId="cvo-desc"
                                            name="cvo_desc"
                                            multiline
                                            minRows={2}
                                            disabled={submitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_external_id" style={{ display: 'block' }}>
                                            External ID
                                        </label>
                                        <Field
                                            component={TextField}
                                            variant="standard"
                                            textFieldId="cvo-external-id"
                                            inputProps={{ maxLength: 10 }}
                                            name="cvo_external_id"
                                            disabled={submitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_image_filename">Filename</label>
                                        <Field
                                            component={TextField}
                                            variant="standard"
                                            fullWidth
                                            textFieldId="cvo-image-filename"
                                            inputProps={{ maxLength: 64 }}
                                            name="cvo_image_filename"
                                            disabled={submitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_order" style={{ display: 'block' }}>
                                            Order
                                        </label>
                                        <Field
                                            component={TextField}
                                            variant="standard"
                                            textFieldId="cvo-order"
                                            name="cvo_order"
                                            disabled={submitting}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_hide" style={{ display: 'block' }}>
                                            Disabled
                                        </label>
                                        <Field
                                            component={renderCheckbox}
                                            variant="standard"
                                            id="cvo-hide"
                                            inputProps={{
                                                id: 'cvo-hide-input',
                                                'data-analyticsid': 'cvo-hide-input',
                                                'data-testid': 'cvo-hide-input',
                                            }}
                                            name="cvo_hide"
                                            type="checkbox"
                                            disabled={submitting}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            {(!hideCancelButton || !hideActionButton) && (
                                <Grid
                                    container
                                    id={`${rootId}-actions`}
                                    data-testid={`${rootId}-actions`}
                                    sx={{ marginTop: 2 }}
                                >
                                    <Grid item xs={12} justifyContent="flex-end" display={'flex'}>
                                        {!hideCancelButton && (
                                            <Button
                                                variant={'outlined'}
                                                onClick={_onCancelAction}
                                                id={`${rootId}-cancel-button`}
                                                data-testid={`${rootId}-cancel-button`}
                                                fullWidth={isMobileView}
                                                disabled={submitting}
                                                sx={{ marginInlineEnd: 2 }}
                                            >
                                                {locale.cancelButtonLabel}
                                            </Button>
                                        )}
                                        {!hideActionButton && (
                                            <Button
                                                variant="contained"
                                                autoFocus
                                                color={'primary'}
                                                type={'submit'}
                                                // onClick={_onAction}
                                                id={`${rootId}-action-button`}
                                                data-testid={`${rootId}-action-button`}
                                                fullWidth={isMobileView}
                                                disabled={pristine || submitting || !valid}
                                            >
                                                {submitting ? (
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
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                            {!!error && (
                                <Grid container id={`${rootId}-alert`} data-testid={`${rootId}-alert`}>
                                    <Grid item xs={12}>
                                        <Alert title="Error" type="error_outline" message={error.message} />
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
    ...propTypes, // all redux-form props
    action: PropTypes.oneOf(['', 'add', 'edit']).isRequired,
    locale: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onClose: PropTypes.func,
    props: PropTypes.object,
    alertProps: PropTypes.object,
    isBusy: PropTypes.bool,
};

export default React.memo(AdminPanel);
