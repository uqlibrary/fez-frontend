import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import Edit from '@mui/icons-material/Edit';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ORG_TYPES_LOOKUP } from 'config/general';
import { useWidth } from 'hooks';

const classes = {
    selected: {
        color: 'white !important',
        fontWeight: 'fontWeightMedium',
    },
    primary: {
        fontSize: 'body2.fontSize',
    },
    identifierName: {
        fontSize: 'caption.fontSize',
        marginTop: 1,
        '&:before': {
            content: '"UQ Id: "',
        },
    },
};

export const GrantListEditorRow = ({
    canEdit = false,
    index,
    grant,
    canMoveUp,
    canMoveDown,
    onMoveUp,
    onMoveDown,
    onDelete,
    onEdit,
    locale = {
        suffix: ' grant',
        moveUpHint: 'Move entry up the order',
        moveDownHint: 'Move entry down the order',
        deleteHint: 'Remove this entry',
        editHint: 'Edit this entry',
        editButtonId: 'edit-grant-info',
        deleteRecordConfirmation: {
            confirmationTitle: 'Delete entry',
            confirmationMessage: 'Are you sure you want to delete this entry?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
    },
    disabled,
}) => {
    const width = useWidth();
    const [confirmationBox, setConfirmationBox] = React.useState();

    const showConfirmation = () => {
        confirmationBox.showConfirmation();
    };

    const deleteRecord = () => {
        /* c8 ignore else */
        if (!disabled && onDelete) {
            onDelete(grant, index);
        }
    };

    const moveUp = () => {
        /* c8 ignore else */
        if (!disabled && onMoveUp) {
            onMoveUp(grant, index);
        }
    };

    const moveDown = () => {
        /* c8 ignore else */
        if (!disabled && onMoveDown) {
            onMoveDown(grant, index);
        }
    };

    const handleEdit = () => {
        onEdit(grant, index);
    };

    const getListItemTypoGraphy = (primaryText, secondaryText, primaryClass, secondaryClass) => (
        <ListItemText
            style={{ padding: 0 }}
            disableTypography
            primary={
                <Typography noWrap variant="body2" sx={{ ...primaryClass }}>
                    {primaryText}
                </Typography>
            }
            secondary={
                <Typography noWrap variant="caption" sx={{ ...secondaryClass }}>
                    {secondaryText}
                </Typography>
            }
        />
    );

    const getGrantRowText = selectedClass => {
        return (
            <Grid container spacing={0} alignContent={'center'} alignItems={'stretch'}>
                <Grid item xs={12} sm={5}>
                    {getListItemTypoGraphy(grant.grantAgencyName, '', { ...classes.primary, ...selectedClass }, {})}
                </Grid>
                <Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {getListItemTypoGraphy(
                        `${grant.grantId}`,
                        '',
                        { ...(width === 'xs' ? classes.identifierName : classes.primary), ...selectedClass },
                        {},
                    )}
                </Grid>
                <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {getListItemTypoGraphy(
                        `${ORG_TYPES_LOOKUP[grant.grantAgencyType] ? ORG_TYPES_LOOKUP[grant.grantAgencyType] : ''}`,
                        '',
                        { ...(width === 'xs' ? classes.identifierName : classes.primary), ...selectedClass },
                        {},
                    )}
                </Grid>
            </Grid>
        );
    };

    const { deleteRecordConfirmation, moveUpHint, moveDownHint, deleteHint, editHint, selectHint, editButtonId } =
        locale;

    const ariaLabel =
        selectHint && selectHint.indexOf('[name]') > -1 ? selectHint.replace('[name]', grant.nameAsPublished) : null;
    const selectedClass = grant.selected ? classes.selected : {};
    return (
        <Fragment>
            <ConfirmDialogBox onRef={setConfirmationBox} onAction={deleteRecord} locale={deleteRecordConfirmation} />
            <ListItem divider style={{ padding: '8px 0 8px 0' }} aria-label={ariaLabel}>
                <Grid container spacing={0} data-testid={`grant-list-row-${index}`}>
                    <Grid item xs={10} sm={11} md={9}>
                        {getGrantRowText(selectedClass)}
                    </Grid>
                    <Grid item xs={2} sm={1} md={3}>
                        <ListItemSecondaryAction style={{ position: 'relative', width: '100%', margin: '0 0 -32px 0' }}>
                            <Grid container spacing={0}>
                                <Grid item xs={8} sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                    <Tooltip
                                        title={moveUpHint}
                                        disableFocusListener={disabled || !canMoveUp}
                                        disableHoverListener={disabled || !canMoveUp}
                                        disableTouchListener={disabled || !canMoveUp}
                                    >
                                        <div style={{ display: 'inline' }}>
                                            <IconButton
                                                onClick={moveUp}
                                                disabled={disabled || !canMoveUp}
                                                aria-label={moveUpHint}
                                                size="large"
                                                data-testid={`grant-list-move-up=${index}`}
                                            >
                                                <KeyboardArrowUp sx={{ ...selectedClass }} />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                    <Tooltip
                                        title={moveDownHint}
                                        disableFocusListener={disabled || !canMoveDown}
                                        disableHoverListener={disabled || !canMoveDown}
                                        disableTouchListener={disabled || !canMoveDown}
                                    >
                                        <div style={{ display: 'inline' }}>
                                            <IconButton
                                                onClick={moveDown}
                                                disabled={disabled || !canMoveDown}
                                                aria-label={moveDownHint}
                                                size="large"
                                                data-testid={`grant-list-move-down=${index}`}
                                            >
                                                <KeyboardArrowDown sx={{ ...selectedClass }} />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                    {canEdit && (
                                        <Tooltip
                                            title={editHint}
                                            disableFocusListener={disabled}
                                            disableHoverListener={disabled}
                                            disableTouchListener={disabled}
                                        >
                                            <span>
                                                <IconButton
                                                    aria-label={editHint}
                                                    onClick={handleEdit}
                                                    disabled={disabled}
                                                    id={`${editButtonId}-${index}`}
                                                    data-analyticsid={`${editButtonId}-${index}`}
                                                    size="large"
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    )}
                                </Grid>
                                <Grid item xs={width === 'sm' || width === 'xs' ? 12 : 4} sx={{ textAlign: 'right' }}>
                                    <Tooltip
                                        title={deleteHint}
                                        disableFocusListener={disabled}
                                        disableHoverListener={disabled}
                                        disableTouchListener={disabled}
                                    >
                                        <div style={{ display: 'inline' }}>
                                            <IconButton
                                                aria-label={deleteHint}
                                                onClick={showConfirmation}
                                                disabled={disabled}
                                                size="large"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </ListItemSecondaryAction>
                    </Grid>
                </Grid>
            </ListItem>
        </Fragment>
    );
};

GrantListEditorRow.propTypes = {
    canEdit: PropTypes.bool,
    index: PropTypes.number.isRequired,
    grant: PropTypes.object.isRequired,
    canMoveUp: PropTypes.bool,
    canMoveDown: PropTypes.bool,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
};

export default React.memo(GrantListEditorRow);
