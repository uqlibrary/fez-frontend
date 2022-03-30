import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteForever from '@material-ui/icons/DeleteForever';
import People from '@material-ui/icons/People';
import { withStyles } from '@material-ui/core/styles';

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
                    <Hidden xsDown>
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
                                <Hidden xsDown>
                                    <ListItemText
                                        secondary={identifierColumn}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </Hidden>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={5} md={4}>
                            {showRoleInput && (
                                <Hidden xsDown>
                                    <ListItemText
                                        secondary={roleColumn}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                </Hidden>
                            )}
                        </Grid>
                    </Grid>
                    <ListItemSecondaryAction classes={{ root: classes.paddingRight64 }}>
                        <Hidden xsDown>
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
