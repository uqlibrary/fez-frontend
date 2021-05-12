import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { makeStyles } from '@material-ui/core/styles';

import { ScrollToSection } from 'modules/SharedComponents/Toolbox/ScrollToSection';
import NameData from './NameData';
import NotesData from './NotesData';
import UsernameIdData from './UsernameIdData';
import ResearcherIdentifierData from './ResearcherIdentifierData';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { checkForExistingAuthor } from 'actions';
import { default as locale } from 'locale/components';

const useStyles = makeStyles(theme => ({
    background: {
        backgroundColor: theme.palette.secondary.light,
        padding: theme.spacing(2),
    },
}));

export const FullAuthorDetails = ({ disabled, data: rowData, mode, onEditingApproved, onEditingCanceled, columns }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const existingAuthorFieldError = useSelector(state => state.get('manageAuthorsReducer').existingAuthorFieldError);

    const {
        form: { deleteConfirmationLocale, editButton, cancelButton, addButton },
        editRow: { validation },
    } = locale.components.manageAuthors;

    const [data, setData] = React.useState(rowData || {});
    const [error, setError] = React.useState({});

    const checkForExisting = React.useRef((query, authorField, autId) =>
        dispatch(checkForExistingAuthor(query, authorField, autId, validation)),
    );

    const handleChange = (name, value) => setData(data => ({ ...data, [name]: value }));

    const handleSave = () => {
        const newData = data;
        delete newData.tableData;
        onEditingApproved(mode, data, rowData);
    };

    const handleDelete = () => {
        onEditingApproved(mode, data, rowData);
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
    React.useEffect(() => {
        if (!!data.aut_org_username && data.aut_org_username.length >= 5) {
            checkForExisting.current(data.aut_org_username, 'aut_org_username', data.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.aut_org_username]);

    /* Run this effect on aut_student_username change */
    React.useEffect(() => {
        if (!!data.aut_student_username && data.aut_student_username.length === 8) {
            checkForExisting.current(data.aut_student_username, 'aut_student_username', data.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.aut_student_username]);

    /* Run this effect on aut_org_staff_id change */
    React.useEffect(() => {
        if (!!data.aut_org_staff_id && data.aut_org_staff_id.length === 7) {
            checkForExisting.current(data.aut_org_staff_id, 'aut_org_staff_id', data.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.aut_org_staff_id]);

    /* Run this effect on aut_org_student_id change */
    React.useEffect(() => {
        if (!!data.aut_org_student_id && data.aut_org_student_id.length === 8) {
            checkForExisting.current(data.aut_org_student_id, 'aut_org_student_id', data.aut_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.aut_org_student_id]);

    React.useEffect(() => {
        if (mode === 'delete') {
            showConfirmation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    React.useEffect(() => {
        setError(() => ({
            ...columns.reduce(
                (errorObject, column) => !!column.validate && { ...errorObject, ...column.validate(data) },
                {},
            ),
            ...(!!existingAuthorFieldError ? existingAuthorFieldError : {}),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, existingAuthorFieldError]);

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
                        <div className={classes.background}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <NameData rowData={data} onChange={handleChange} error={error} />
                                </Grid>
                                <Grid item xs={12}>
                                    <UsernameIdData rowData={data} onChange={handleChange} error={error} />
                                </Grid>
                                <Grid item xs={12}>
                                    <ResearcherIdentifierData rowData={data} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <NotesData rowData={data} onChange={handleChange} />
                                </Grid>
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
                                                key={JSON.stringify(error)}
                                                id={`authors-${mode}-this-author-save`}
                                                data-testid={`authors-${mode}-this-author-save`}
                                                disabled={
                                                    disabled ||
                                                    Object.keys(error).filter(field => error[field].error).length > 0
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
    mode: PropTypes.string,
    onEditingApproved: PropTypes.func,
    onEditingCanceled: PropTypes.func,
    rowData: PropTypes.object,
};

export default React.memo(FullAuthorDetails);
