import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

const useStyles = makeStyles(() => ({
    right: {
        textAlign: 'right',
    },
    center: {
        textAlign: 'center',
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    },
}));

export const ListRowHeader = ({ onDeleteAll, locale, disabled, hideReorder, listEditorId }) => {
    const classes = useStyles();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const { nameColumn, reorderColumn, deleteAll, deleteAllConfirmation } = locale;

    return (
        <div style={{ flexGrow: 1, padding: 8 }}>
            <ConfirmationBox
                onAction={onDeleteAll}
                onClose={hideConfirmation}
                isOpen={isOpen}
                locale={deleteAllConfirmation}
                confirmationBoxId={`${listEditorId}-delete-all`}
            />
            <Grid container alignItems="center" spacing={2} className={classes.header}>
                <Grid item xs={hideReorder ? 10 : 5} sm={hideReorder ? 11 : 6}>
                    <Typography variant="caption">{nameColumn}</Typography>
                </Grid>
                {!hideReorder && (
                    <Grid item xs={5} sm={5} className={classes.right}>
                        <Typography variant="caption">{reorderColumn}</Typography>
                    </Grid>
                )}
                <Grid item xs={2} sm={1} className={classes.center}>
                    <Tooltip title={deleteAll}>
                        <span>
                            <IconButton
                                onClick={showConfirmation}
                                disabled={disabled}
                                id={`delete-all-${listEditorId}`}
                                data-analyticsid={`delete-all-${listEditorId}`}
                                data-testid={`delete-all-${listEditorId}`}
                                size="large"
                            >
                                <DeleteForever />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
        </div>
    );
};

ListRowHeader.propTypes = {
    onDeleteAll: PropTypes.func.isRequired,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    hideReorder: PropTypes.bool,
    listEditorId: PropTypes.string,
};

ListRowHeader.defaultProps = {
    locale: {
        nameColumn: 'Name',
        reorderColumn: 'Reorder items',
        deleteAll: 'Remove all items',
        deleteAllConfirmation: {
            confirmationTitle: 'Delete all',
            confirmationMessage: 'Are you sure you want to delete all items?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
    },
};

export default React.memo(ListRowHeader);
