import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form/immutable';

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
    onCancelAction,
    onClose,
    noMinContentWidth,
    error,
    handleSubmit,
    submitting,
    pristine,
    valid,
    parentId,
    ...props
}) => {
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
                    data-testid={`${componentId}-container`}
                >
                    <StandardCard title={title} standardCardId={`${componentId}`} subCard>
                        <form onSubmit={handleSubmit}>
                            <Box
                                id={`${componentId}-vc-content`}
                                data-testid={`${componentId}-vc-content`}
                                sx={{ minWidth: !noMinContentWidth ? 300 : 'auto', padding: 2 }}
                            >
                                <Grid container padding={0} spacing={2}>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_title">{locale.form.title}</label>
                                        <TextField
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
                                        <label htmlFor="cvo_desc">{locale.form.description}</label>
                                        <TextField
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
                                            {locale.form.externalId}
                                        </label>
                                        <TextField
                                            variant="standard"
                                            textFieldId="cvo-external-id"
                                            inputProps={{ maxLength: 10 }}
                                            name="cvo_external_id"
                                            disabled={submitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <label htmlFor="cvo_hide" style={{ display: 'block' }}>
                                            {locale.form.inactive}
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
