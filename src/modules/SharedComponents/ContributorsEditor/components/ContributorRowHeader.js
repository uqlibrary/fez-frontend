import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import DeleteForever from '@mui/icons-material/DeleteForever';
import People from '@mui/icons-material/People';
import withStyles from '@mui/styles/withStyles';

export class ContributorRowHeader extends PureComponent {
    static propTypes = {
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

    static defaultProps = {
        hideDelete: false,
        hideReorder: false,
        locale: {
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
    };

    constructor(props) {
        super(props);
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    render() {
        const {
            deleteAll,
            deleteAllConfirmation,
            descriptionStep2,
            identifierColumn,
            nameColumn,
            reorderColumn,
            roleColumn,
        } = this.props.locale;

        const {
            classes,
            disabled,
            hideDelete,
            isInfinite,
            onDeleteAll,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
            canEdit,
        } = this.props;

        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={onDeleteAll}
                    locale={deleteAllConfirmation}
                />
                {showContributorAssignment && (
                    <Fragment>
                        <br />
                        {descriptionStep2}
                    </Fragment>
                )}
                <ListItem classes={{ root: classes.header }}>
                    <Hidden smDown>
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                    </Hidden>
                    <Grid container classes={{ container: classes.listContainer }}>
                        <Grid item xs={10} sm={5} md={3}>
                            <ListItemText secondary={nameColumn} secondaryTypographyProps={{ variant: 'caption' }} />
                        </Grid>
                        {showIdentifierLookup && (
                            <Grid item xs={12} sm={4}>
                                <Hidden smDown>
                                    <ListItemText
                                        secondary={identifierColumn}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </Hidden>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={5} md={4}>
                            {showRoleInput && (
                                <Hidden smDown>
                                    <ListItemText
                                        secondary={roleColumn}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </Hidden>
                            )}
                        </Grid>
                    </Grid>
                    <ListItemSecondaryAction classes={{ root: classes.paddingRight64 }}>
                        <Hidden smDown>
                            <ListItemText
                                secondary={reorderColumn}
                                secondaryTypographyProps={{ variant: 'caption' }}
                                classes={{
                                    secondary: `${classes.right} ${
                                        // eslint-disable-next-line no-nested-ternary
                                        isInfinite
                                            ? classes.infinitePaddingRight
                                            : canEdit
                                            ? classes.paddingRightEdit
                                            : classes.paddingRight
                                    }`,
                                }}
                            />
                        </Hidden>
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
                                    onClick={this._showConfirmation}
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
    }
}

export const styles = () => ({
    right: {
        textAlign: 'right',
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
        marginTop: 8,
    },
    paddingRightEdit: {
        paddingRight: 78,
    },
    paddingRight: { paddingRight: 40 },
    infinitePaddingRight: {
        paddingRight: 36,
    },
});

export default withStyles(styles)(ContributorRowHeader);
