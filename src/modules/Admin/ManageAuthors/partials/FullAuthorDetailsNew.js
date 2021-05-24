import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
    // useDispatch,
    useSelector,
} from 'react-redux';
import { getFormSyncErrors, getFormAsyncErrors, reduxForm, getFormValues } from 'redux-form/immutable';
import debounce from 'debounce-promise';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { makeStyles } from '@material-ui/core/styles';

import { ScrollToSection } from 'modules/SharedComponents/Toolbox/ScrollToSection';
import NameData from './NameData';
import UsernameIdData from './UsernameIdData';
import ResearcherIdentifierData from './ResearcherIdentifierData';
// import NotesData from './NotesData';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
// import { checkForExistingAuthor } from 'actions';
import { default as locale } from 'locale/components';
import { FORM_NAME } from './manageAuthorConfig';
import { checkForExisting } from '../helpers';

const useStyles = makeStyles(theme => ({
    background: {
        backgroundColor: theme.palette.secondary.light,
        padding: theme.spacing(2),
    },
}));

// const selector = formValueSelector(FORM_NAME);

// const onSubmit = (values, dispatch, props) => {
//     console.log(values.toJS(), props);
//     return props.onEditingApproved(props.mode, values.toJS(), props.data).catch(error => {
//         throw new SubmissionError({ _error: error.message });
//     });
// };

export const FullAuthorDetails = ({
    disabled,
    data: rowData,
    // handleSubmit,
    mode,
    onEditingApproved,
    onEditingCanceled,
    // columns,
    submitting,
    submitSucceeded,
}) => {
    console.log(rowData);
    const classes = useStyles();
    // const dispatch = useDispatch();
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
        // editRow: { validation },
    } = locale.components.manageAuthors;

    // const [data] = React.useState(rowData || {});
    // const [error, setError] = React.useState({});

    // const checkForExisting = React.useRef((query, authorField, autId) =>
    //     dispatch(checkForExistingAuthor(query, authorField, autId, validation)),
    // );

    // const handleChange = (name, value) => setData(data => ({ ...data, [name]: value }));

    const handleSave = () => {
        onEditingApproved(mode, formValues.toJS(), rowData);
    };

    const handleDelete = () => {
        onEditingApproved(mode, rowData, rowData);
    };

    const handleCancel = () => onEditingCanceled(mode, rowData);

    const handleKeyPress = e => {
        e.key === 'Escape' && onEditingCanceled(mode, rowData);
    };

    const handleCancelDelete = () => {
        handleCancel();
        hideConfirmation();
    };

    /* Run this effect on aut_org_username change */
    // React.useEffect(() => {
    //     if (!!data.aut_org_username && data.aut_org_username.length >= 5) {
    //         checkForExisting.current(data.aut_org_username, 'aut_org_username', data.aut_id);
    //     }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data.aut_org_username]);

    /* Run this effect on aut_student_username change */
    // React.useEffect(() => {
    //     if (!!data.aut_student_username && data.aut_student_username.length === 8) {
    //         checkForExisting.current(data.aut_student_username, 'aut_student_username', data.aut_id);
    //     }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data.aut_student_username]);

    /* Run this effect on aut_org_staff_id change */
    // React.useEffect(() => {
    //     if (!!data.aut_org_staff_id && data.aut_org_staff_id.length === 7) {
    //         checkForExisting.current(data.aut_org_staff_id, 'aut_org_staff_id', data.aut_id);
    //     }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data.aut_org_staff_id]);

    /* Run this effect on aut_org_student_id change */
    // React.useEffect(() => {
    //     if (!!data.aut_org_student_id && data.aut_org_student_id.length === 8) {
    //         checkForExisting.current(data.aut_org_student_id, 'aut_org_student_id', data.aut_id);
    //     }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data.aut_org_student_id]);

    React.useEffect(() => {
        if (mode === 'delete') {
            showConfirmation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // React.useEffect(() => {
    //     setError(() => ({
    //         ...columns.reduce(
    //             (errorObject, column) => !!column.validate && { ...errorObject, ...column.validate(data) },
    //             {},
    //         ),
    //         ...(!!existingAuthorFieldError ? existingAuthorFieldError : {}),
    //     }));
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data, existingAuthorFieldError]);

    return (
        <TableRow onKeyDown={handleKeyPress} id="author-edit-row" data-testid="author-edit-row">
            <TableCell colSpan={4}>
                <ConfirmationBox
                    confirmationBoxId="authors-delete-this-author-confirmation"
                    onAction={handleDelete}
                    onClose={handleCancelDelete}
                    isOpen={isOpen}
                    locale={deleteConfirmationLocale}
                />
                {(mode === 'update' || mode === 'add') && (
                    <ScrollToSection scrollToSection>
                        <form>
                            <div className={classes.background}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <NameData />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <UsernameIdData />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ResearcherIdentifierData />
                                    </Grid>
                                    {/* <Grid item xs={12}>
                                        <NotesData />
                                    </Grid> */}
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction="row-reverse"
                                            justify="flex-start"
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            <Grid item>
                                                <Button
                                                    // key={JSON.stringify(error)}
                                                    id={`authors-${mode}-this-author-save`}
                                                    data-testid={`authors-${mode}-this-author-save`}
                                                    disabled={
                                                        disableSubmit || submitting || submitSucceeded || disabled
                                                    }
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSave}
                                                >
                                                    {mode === 'update' ? editButton : addButton}
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    id={`authors-${mode}-this-author-cancel`}
                                                    data-testid={`authors-${mode}-this-author-cancel`}
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
                )}
            </TableCell>
        </TableRow>
    );
};

FullAuthorDetails.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.object,
    disabled: PropTypes.bool,
    handleSubmit: PropTypes.func,
    mode: PropTypes.string,
    onEditingApproved: PropTypes.func,
    onEditingCanceled: PropTypes.func,
    rowData: PropTypes.object,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const FullAuthorDetailsReduxForm = reduxForm({
    form: FORM_NAME,
    // onSubmit,
    asyncValidate: debounce(checkForExisting, 1000),
    asyncChangeFields: ['aut_org_username', 'aut_org_staff_id', 'aut_student_username', 'aut_org_student_id'],
})(FullAuthorDetails);

export default React.memo(FullAuthorDetailsReduxForm);
