import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { useSelector } from 'react-redux';
import { getFormSyncErrors, getFormAsyncErrors, reduxForm, getFormValues } from 'redux-form/immutable';
import debounce from 'debounce-promise';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import makeStyles from '@mui/styles/makeStyles';

import { ScrollToSection } from 'modules/SharedComponents/Toolbox/ScrollToSection';
import NameData from './NameData';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from 'locale/components';
import { FORM_NAME, DEBOUNCE_VALUE } from './manageUserConfig';
import { checkForExisting } from '../helpers';
import UserDetailsRow from './UserDetailsRow';

const useStyles = makeStyles(theme => ({
    background: {
        backgroundColor: theme.palette.secondary.light,
        padding: theme.spacing(2),
    },
}));

export const FullUserDetails = ({
    disabled,
    data: rowData,
    mode,
    onEditingApproved,
    onEditingCanceled,
    submitting,
}) => {
    const classes = useStyles();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const formValues = useSelector(state => getFormValues(FORM_NAME)(state));
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const asyncFormErrors = useSelector(state => getFormAsyncErrors(FORM_NAME)(state));

    const disableSubmit =
        (!!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0) ||
        (!!asyncFormErrors &&
            asyncFormErrors instanceof Immutable.Map &&
            Object.keys(asyncFormErrors.toJS()).length > 0);

    const {
        form: { deleteConfirmationLocale, editButton, cancelButton, addButton },
    } = locale.components.manageUsers;

    const handleSave = () => onEditingApproved(mode, formValues.toJS(), rowData);
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

    return (
        <React.Fragment>
            {(mode === 'update' || mode === 'add') && (
                <TableRow onKeyDown={handleKeyPress} id="user-edit-row" data-testid="user-edit-row">
                    <TableCell colSpan={9}>
                        <ScrollToSection scrollToSection>
                            <form>
                                <div className={classes.background}>
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
                                                        onClick={handleSave}
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
                                    </Grid>
                                </div>
                            </form>
                        </ScrollToSection>
                    </TableCell>
                </TableRow>
            )}

            {mode === 'delete' && (
                <TableRow
                    onKeyDown={handleKeyPress}
                    id="author-delete-row"
                    data-testid="author-delete-row"
                    className={classes.background}
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
    submitting: PropTypes.bool,
};

const FullUserDetailsReduxForm = reduxForm({
    form: FORM_NAME,
    asyncValidate: debounce(checkForExisting, DEBOUNCE_VALUE),
    asyncChangeFields: ['usr_username'],
})(FullUserDetails);

export default React.memo(FullUserDetailsReduxForm);
