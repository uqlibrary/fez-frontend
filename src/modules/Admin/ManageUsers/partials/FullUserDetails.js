import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { makeStyles } from '@material-ui/core/styles';

import { ScrollToSection } from 'modules/SharedComponents/Toolbox/ScrollToSection';
import NameData from './NameData';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from 'locale/components';

const useStyles = makeStyles(theme => ({
    background: {
        backgroundColor: theme.palette.secondary.light,
        padding: theme.spacing(2),
    },
}));

export const FullUserDetails = ({ disabled, data: rowData, mode, onEditingApproved, onEditingCanceled, columns }) => {
    const classes = useStyles();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [error, setError] = React.useState({});

    const {
        form: { deleteConfirmationLocale, editButton, cancelButton, addButton },
    } = locale.components.manageUsers;

    const [data, setData] = React.useState(rowData || {});

    const handleChange = (name, value) => {
        setData(data => ({ ...data, [name]: value }));
    };

    const handleSave = () => {
        // eslint-disable-next-line no-unused-vars
        const { tableData, ...newData } = data;
        onEditingApproved(mode, newData, rowData);
    };

    const handleDelete = () => {
        onEditingApproved(mode, data, rowData);
    };

    const handleCancel = () => onEditingCanceled(mode, rowData);

    const handleKeyPress = e => {
        if (e.key === 'Escape') onEditingCanceled(mode, rowData);
    };

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

    React.useEffect(() => {
        setError(
            columns.reduce((errorObject, column) => {
                return !!column.validate && !!column.validate(data)
                    ? { ...errorObject, [column.field]: column.validate(data) }
                    : { ...errorObject };
            }, {}),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <TableRow onKeyDown={handleKeyPress}>
            <TableCell colSpan={9}>
                <ConfirmationBox
                    confirmationBoxId="users-delete-this-user-confirmation"
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
                                    <Grid
                                        container
                                        direction="row-reverse"
                                        justify="flex-start"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Grid item>
                                            <Button
                                                id={`users-${mode}-this-user-save`}
                                                data-testid={`users-${mode}-this-user-save`}
                                                disabled={disabled || Object.keys(error).length > 0}
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
                    </ScrollToSection>
                )}
            </TableCell>
        </TableRow>
    );
};

FullUserDetails.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.object,
    disabled: PropTypes.bool,
    mode: PropTypes.string,
    onEditingApproved: PropTypes.func,
    onEditingCanceled: PropTypes.func,
    rowData: PropTypes.object,
};

export default React.memo(FullUserDetails);
