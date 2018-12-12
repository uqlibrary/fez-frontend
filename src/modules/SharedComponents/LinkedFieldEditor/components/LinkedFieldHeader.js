import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteForever from '@material-ui/icons/DeleteForever';
import People from '@material-ui/icons/People';
import {withStyles} from '@material-ui/core/styles';

export class LinkedFieldHeader extends PureComponent {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        isInfinite: PropTypes.bool,
        classes: PropTypes.object
    };

    static defaultProps = {
        locale: {
            contributorAssignmentColumn: 'Select your name',
            nameColumn: 'Name as published',
            identifierColumn: 'UQ identifier',
            roleColumn: 'Role',
            reorderColumn: 'Reorder records',
            deleteAll: 'Remove all records',
            deleteAllConfirmation: {
                confirmationTitle: 'Delete all',
                confirmationMessage: 'Are you sure you want to delete all records?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            descriptionStep2: 'Step 2 - Select your name from the list below'
        },
    };

    constructor(props) {
        super(props);
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    render() {
        const {nameColumn, identifierColumn, reorderColumn, deleteAll, deleteAllConfirmation, roleColumn} = this.props.locale;
        const {classes, showIdentifierLookup, isInfinite, showRoleInput} = this.props;
        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.props.onDeleteAll}
                    locale={deleteAllConfirmation}
                />
                {
                    this.props.showContributorAssignment &&
                    <Fragment>
                        <br/>
                        {this.props.locale.descriptionStep2}
                    </Fragment>
                }
                <ListItem classes={{root: classes.header}}>
                    <Hidden xsDown>
                        <ListItemIcon>
                            <People/>
                        </ListItemIcon>
                    </Hidden>
                    <ListItemText secondary={nameColumn} secondaryTypographyProps={{variant: 'caption'}}/>
                    {
                        showIdentifierLookup &&
                        <Hidden xsDown>
                            <ListItemText secondary={identifierColumn} secondaryTypographyProps={{variant: 'caption'}}/>
                        </Hidden>
                    }
                    {
                        showRoleInput &&
                        <Hidden xsDown>
                            <ListItemText secondary={roleColumn} secondaryTypographyProps={{variant: 'caption'}}/>
                        </Hidden>
                    }
                    <Hidden xsDown>
                        <ListItemText secondary={reorderColumn} secondaryTypographyProps={{variant: 'caption'}} classes={{secondary: `${classes.right} ${isInfinite ? classes.paddingRight36 : classes.paddingRight24}`}}/>
                    </Hidden>
                    <ListItemSecondaryAction classes={{root: isInfinite ? classes.paddingRight14 : ''}}>
                        <Tooltip title={deleteAll}>
                            <IconButton
                                onClick={this._showConfirmation}
                                disabled={this.props.disabled}
                            >
                                <DeleteForever/>
                            </IconButton>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>
            </Fragment>
        );
    }
}

const styles = () => ({
    right: {
        textAlign: 'right'
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
        marginTop: 8
    },
    paddingRight24: {
        paddingRight: 24
    },
    paddingRight36: {
        paddingRight: 36
    },
    paddingRight14: {
        paddingRight: 14
    }
});

export default withStyles(styles)(LinkedFieldHeader);
