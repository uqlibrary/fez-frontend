import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Edit from '@material-ui/icons/Edit';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import Hidden from '@material-ui/core/Hidden';
import { ORG_TYPES_LOOKUP } from 'config/general';

export const styles = theme => ({
    rowSelected: {
        backgroundColor: ((theme.palette || {}).accent || {}).light,
    },
    selected: {
        color: 'white !important',
        fontWeight: theme.typography.fontWeightMedium,
    },
    hideIcon: {
        display: 'none',
    },
    primary: {
        fontSize: theme.typography.body2.fontSize,
    },
    identifierName: {
        fontSize: theme.typography.caption.fontSize,
        marginTop: 8,
        '&:before': {
            content: '"UQ Id: "',
        },
    },
    identifierSubtitle: {
        fontSize: theme.typography.caption.fontSize,
        '&:before': {
            content: '"UQ Username: "',
        },
    },
});

export class GrantListEditorRow extends PureComponent {
    static propTypes = {
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
        classes: PropTypes.object,
        width: PropTypes.string,
    };

    static defaultProps = {
        canEdit: false,
        locale: {
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
    };

    constructor(props) {
        super(props);
    }

    handleConfirmationBoxRef = ref => (this.confirmationBox = ref);

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    _deleteRecord = () => {
        if (!this.props.disabled && this.props.onDelete) {
            this.props.onDelete(this.props.grant, this.props.index);
        }
    };

    _onMoveUp = () => {
        if (!this.props.disabled && this.props.onMoveUp) {
            this.props.onMoveUp(this.props.grant, this.props.index);
        }
    };

    _onMoveDown = () => {
        if (!this.props.disabled && this.props.onMoveDown) {
            this.props.onMoveDown(this.props.grant, this.props.index);
        }
    };

    _handleEdit = () => {
        this.props.onEdit(this.props.grant, this.props.index);
    };

    getListItemTypoGraphy = (primaryText, secondaryText, primaryClass, secondaryClass) => (
        <ListItemText
            style={{ padding: 0 }}
            disableTypography
            primary={
                <Typography noWrap variant="body2" classes={{ root: primaryClass }}>
                    {primaryText}
                </Typography>
            }
            secondary={
                <Typography noWrap variant="caption" classes={{ root: secondaryClass }}>
                    {secondaryText}
                </Typography>
            }
        />
    );

    getGrantRowText = selectedClass => {
        const { grant, classes, width } = this.props;
        return (
            <Grid container spacing={0} alignContent={'center'} alignItems={'stretch'}>
                <Grid item xs={12} sm={5}>
                    {this.getListItemTypoGraphy(grant.grantAgencyName, '', `${classes.primary} ${selectedClass}`, '')}
                </Grid>
                <Hidden xsDown>
                    <Grid item sm={3}>
                        {this.getListItemTypoGraphy(
                            `${grant.grantId}`,
                            '',
                            `${width === 'xs' ? classes.identifierName : classes.primary} ${selectedClass}`,
                            '',
                        )}
                    </Grid>
                    <Grid item sm={4}>
                        {this.getListItemTypoGraphy(
                            `${ORG_TYPES_LOOKUP[grant.grantAgencyType] ? ORG_TYPES_LOOKUP[grant.grantAgencyType] : ''}`,
                            '',
                            `${width === 'xs' ? classes.identifierName : classes.primary} ${selectedClass}`,
                            '',
                        )}
                    </Grid>
                </Hidden>
            </Grid>
        );
    };

    render() {
        const {
            deleteRecordConfirmation,
            moveUpHint,
            moveDownHint,
            deleteHint,
            editHint,
            selectHint,
            editButtonId,
        } = this.props.locale;
        const { grant, canMoveDown, canMoveUp, disabled, classes, canEdit, index } = this.props;
        const ariaLabel =
            selectHint && selectHint.indexOf('[name]') > -1
                ? selectHint.replace('[name]', grant.nameAsPublished)
                : null;
        const selectedClass = grant.selected ? classes.selected : '';
        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={this.handleConfirmationBoxRef}
                    onAction={this._deleteRecord}
                    locale={deleteRecordConfirmation}
                />
                <ListItem divider style={{ padding: '8px 0 8px 0' }} aria-label={ariaLabel}>
                    <Grid container spacing={0}>
                        <Grid item xs={10} sm={11} md={9}>
                            {this.getGrantRowText(selectedClass)}
                        </Grid>
                        <Grid item xs={2} sm={1} md={3}>
                            <ListItemSecondaryAction
                                style={{ position: 'relative', width: '100%', margin: '0 0 -32px 0' }}
                            >
                                <Grid container spacing={0}>
                                    <Hidden smDown>
                                        <Grid item xs={8} style={{ textAlign: 'right' }}>
                                            <Tooltip
                                                title={moveUpHint}
                                                disableFocusListener={disabled || !canMoveUp}
                                                disableHoverListener={disabled || !canMoveUp}
                                                disableTouchListener={disabled || !canMoveUp}
                                            >
                                                <div style={{ display: 'inline' }}>
                                                    <IconButton
                                                        onClick={this._onMoveUp}
                                                        disabled={disabled || !canMoveUp}
                                                        aria-label={moveUpHint}
                                                    >
                                                        <KeyboardArrowUp classes={{ root: `${selectedClass}` }} />
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
                                                        onClick={this._onMoveDown}
                                                        disabled={disabled || !canMoveDown}
                                                        aria-label={moveDownHint}
                                                    >
                                                        <KeyboardArrowDown classes={{ root: `${selectedClass}` }} />
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
                                                            onClick={this._handleEdit}
                                                            disabled={disabled}
                                                            id={`${editButtonId}-${index}`}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}
                                        </Grid>
                                    </Hidden>
                                    <Grid
                                        item
                                        xs={this.props.width === 'sm' || this.props.width === 'xs' ? 12 : 4}
                                        style={{ textAlign: 'right' }}
                                    >
                                        <Tooltip
                                            title={deleteHint}
                                            disableFocusListener={disabled}
                                            disableHoverListener={disabled}
                                            disableTouchListener={disabled}
                                        >
                                            <div style={{ display: 'inline' }}>
                                                <IconButton
                                                    aria-label={deleteHint}
                                                    onClick={this._showConfirmation}
                                                    disabled={disabled}
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
    }
}

export default withStyles(styles)(withWidth()(GrantListEditorRow));
