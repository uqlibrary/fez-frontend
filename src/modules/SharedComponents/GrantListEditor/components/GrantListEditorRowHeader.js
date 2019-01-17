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

export class GrantListEditorRowHeader extends PureComponent {
    static propTypes = {
        onDeleteAll: PropTypes.func.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        isInfinite: PropTypes.bool,
        classes: PropTypes.object
    };

    static defaultProps = {
        locale: {
            GrantName: 'Name as published',
            GrantID: 'UQ identifier',
            GrantType: 'Role',
            reorderColumn: 'Reorder entries',
            deleteAll: 'Remove all entries',
            deleteAllConfirmation: {
                confirmationTitle: 'Delete all',
                confirmationMessage: 'Are you sure you want to delete all entries?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
        },
    };

    constructor(props) {
        super(props);
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    render() {
        const {GrantName, GrantID, GrantType, deleteAll, deleteAllConfirmation, reorderColumn} = this.props.locale;
        const {classes, isInfinite} = this.props;
        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this.props.onDeleteAll}
                    locale={deleteAllConfirmation}
                />
                <ListItem classes={{root: classes.header}}>
                    <Hidden xsDown>
                        <ListItemIcon>
                            <People/> Hello
                        </ListItemIcon>
                    </Hidden>
                    <ListItemText secondary={GrantName} secondaryTypographyProps={{variant: 'caption'}}/>
                    <ListItemText secondary={GrantID} secondaryTypographyProps={{variant: 'caption'}}/>
                    <ListItemText secondary={GrantType} secondaryTypographyProps={{variant: 'caption'}}/>
                    <ListItemText secondary={reorderColumn} secondaryTypographyProps={{variant: 'caption'}} classes={{secondary: `${classes.right} ${isInfinite ? classes.paddingRight36 : classes.paddingRight24}`}}/>
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

export default withStyles(styles)(GrantListEditorRowHeader);
