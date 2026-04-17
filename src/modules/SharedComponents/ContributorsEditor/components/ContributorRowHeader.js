import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/GridLegacy';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import DeleteForever from '@mui/icons-material/DeleteForever';
import People from '@mui/icons-material/People';

export const ContributorRowHeader = ({
    classes,
    disabled,
    hideDelete = false,
    isInfinite,
    locale = {
        contributorAssignmentColumn: 'Select your name',
        deleteAll: 'Remove all records',
        deleteAllConfirmation: {
            confirmationTitle: 'Delete all',
            confirmationMessage: 'Are you sure you want to delete all records?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
        descriptionStep2: 'Step 2 - Select your name from the list below',
        identifierColumn: 'UQ identifier / Organisation',
        nameColumn: 'Name as published',
        reorderColumn: 'Reorder records',
        roleColumn: 'Role',
    },
    onDeleteAll,
    showContributorAssignment,
    showIdentifierLookup,
    showRoleInput,
    canEdit,
}) => {
    const [confirmationBox, setConfirmationBox] = React.useState(null);

    const setConfirmation = ref => {
        setConfirmationBox(ref);
    };

    const showConfirmation = () => {
        confirmationBox.showConfirmation();
    };

    const {
        deleteAll,
        deleteAllConfirmation,
        descriptionStep2,
        identifierColumn,
        nameColumn,
        reorderColumn,
        roleColumn,
    } = locale;

    return (
        <Fragment>
            <ConfirmDialogBox onRef={setConfirmation} onAction={onDeleteAll} locale={deleteAllConfirmation} />
            {showContributorAssignment && (
                <Fragment>
                    <br />
                    {descriptionStep2}
                </Fragment>
            )}
            <ListItem sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.2)', marginTop: 1 }}>
                <ListItemIcon sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <People />
                </ListItemIcon>

                <Grid container classes={{ container: classes?.listContainer }}>
                    <Grid item xs={10} sm={5} md={3}>
                        <ListItemText
                            secondary={nameColumn}
                            slotProps={{
                                secondary: { variant: 'caption' },
                            }}
                        />
                    </Grid>
                    {showIdentifierLookup && (
                        <Grid item xs={12} sm={4}>
                            <ListItemText
                                secondary={identifierColumn}
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                                slotProps={{
                                    secondary: { variant: 'caption' },
                                }}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={5} md={4}>
                        {showRoleInput && (
                            <ListItemText
                                secondary={roleColumn}
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                                slotProps={{
                                    secondary: { variant: 'caption' },
                                }}
                            />
                        )}
                    </Grid>
                </Grid>
                <ListItemSecondaryAction classes={{ root: classes?.paddingRight64 }}>
                    <ListItemText
                        secondary={reorderColumn}
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiListItemText-secondary': {
                                textAlign: 'right',
                                paddingRight: '40px',
                                ...(isInfinite && { paddingRight: '36px' }),
                                ...(canEdit && { paddingRight: '78px' }),
                            },
                        }}
                        slotProps={{
                            secondary: { variant: 'caption' },
                        }}
                    />
                </ListItemSecondaryAction>
                <ListItemSecondaryAction>
                    <Tooltip
                        title={deleteAll}
                        disableFocusListener={disabled || hideDelete}
                        disableHoverListener={disabled || hideDelete}
                        disableTouchListener={disabled || hideDelete}
                    >
                        <span>
                            <IconButton
                                onClick={showConfirmation}
                                disabled={disabled || hideDelete}
                                aria-label={deleteAll}
                                size="large"
                            >
                                <DeleteForever />
                            </IconButton>
                        </span>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>
        </Fragment>
    );
};

ContributorRowHeader.propTypes = {
    classes: PropTypes.object,
    disabled: PropTypes.bool,
    hideDelete: PropTypes.bool,
    isInfinite: PropTypes.bool,
    locale: PropTypes.object,
    onDeleteAll: PropTypes.func.isRequired,
    showContributorAssignment: PropTypes.bool,
    showIdentifierLookup: PropTypes.bool,
    showRoleInput: PropTypes.bool,
    canEdit: PropTypes.bool,
};

export default React.memo(ContributorRowHeader);
