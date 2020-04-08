import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/global';

import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Person from '@material-ui/icons/Person';
import PersonOutlined from '@material-ui/icons/PersonOutlined';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Lock from '@material-ui/icons/Lock';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ContributorRowText } from './ContributorRowText';

export const styles = theme => ({
    listContainer: {
        padding: '0',
    },
    listItem: {
        borderLeft: '5px solid transparent',
        cursor: 'pointer',
        width: '100%',
        margin: '0',
    },
    disabledListItem: {
        width: '100%',
        margin: '0',
        outline: 'none !important',
        '&:focus': {
            outline: 'none !important',
        },
    },
    highlighted: {
        borderLeft: '5px solid red',
    },
    rowSelected: {
        backgroundColor: ((theme.palette || {}).accent || {}).main,
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
    },
    identifierSubtitle: {
        fontSize: theme.typography.caption.fontSize,
    },
});

export class ContributorRow extends PureComponent {
    static propTypes = {
        canEdit: PropTypes.bool,
        canMoveDown: PropTypes.bool,
        canMoveUp: PropTypes.bool,
        classes: PropTypes.object,
        contributor: PropTypes.object.isRequired,
        disabled: PropTypes.bool,
        hideDelete: PropTypes.bool,
        hideReorder: PropTypes.bool,
        index: PropTypes.number.isRequired,
        locale: PropTypes.object,
        onSelect: PropTypes.func,
        onDelete: PropTypes.func,
        onEdit: PropTypes.func,
        onMoveDown: PropTypes.func,
        onMoveUp: PropTypes.func,
        width: PropTypes.string,
        required: PropTypes.bool,
        enableSelect: PropTypes.bool,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
    };

    static defaultProps = {
        canEdit: false,
        locale: {
            suffix: ' listed contributor',
            moveUpHint: 'Move record up the order',
            moveDownHint: 'Move record down the order',
            deleteHint: 'Remove this record',
            editHint: 'Edit this record',
            selectHint: 'Select this record ([name]) to assign it to you',
            lockedTooltip: 'You are not able to edit this row',
            deleteRecordConfirmation: {
                confirmationTitle: 'Delete record',
                confirmationMessage: 'Are you sure you want to delete this record?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
            deleteButtonId: 'delete-record',
            editButtonId: 'edit-record',
        },
        hideReorder: false,
        hideDelete: false,
        required: false,
        enableSelect: false,
    };

    constructor(props) {
        super(props);
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    _onDelete = () => {
        if (!this.props.disabled && this.props.onDelete) {
            this.props.onDelete(this.props.contributor, this.props.index);
        }
    };

    _onMoveUp = () => {
        if (!this.props.disabled && this.props.onMoveUp) {
            this.props.onMoveUp(this.props.contributor, this.props.index);
        }
    };

    _onMoveDown = () => {
        if (!this.props.disabled && this.props.onMoveDown) {
            this.props.onMoveDown(this.props.contributor, this.props.index);
        }
    };

    _onSelectKeyboard = event => {
        if (event.key === 'Enter') {
            this._select();
        }
    };

    _onSelect = event => {
        this._select();
        event && event.currentTarget.blur();
    };

    _select = () => {
        const { disabled, onSelect, index, enableSelect } = this.props;
        if (!disabled && !!onSelect && enableSelect) {
            onSelect(index);
        }
    };

    _handleEdit = () => {
        const { canEdit, index } = this.props;
        canEdit && !!this.props.onEdit && this.props.onEdit(index);
    };

    getRowIcon() {
        const {
            contributor,
            disabled,
            locale: { lockedTooltip },
        } = this.props;
        if (parseInt(contributor.uqIdentifier, 10)) {
            return <HowToRegIcon />;
        } else if (contributor.selected) {
            return <Person />;
        } else if ((disabled || contributor.disabled) && !this.props.enableSelect) {
            return lockedTooltip ? (
                <Tooltip title={lockedTooltip}>
                    <Lock />
                </Tooltip>
            ) : (
                <Lock />
            );
        } else {
            return <PersonOutlined />;
        }
    }

    render() {
        const {
            contributor,
            canEdit,
            canMoveDown,
            canMoveUp,
            disabled,
            classes,
            hideReorder,
            hideDelete,
            required,
            index,
            locale: {
                deleteRecordConfirmation,
                moveUpHint,
                moveDownHint,
                deleteHint,
                editHint,
                selectHint,
                deleteButtonId,
                editButtonId,
            },
        } = this.props;

        const selectedClass = contributor.selected ? classes.selected : '';

        const ariaLabel =
            (!disabled &&
                `${selectHint.replace('[name]', contributor.nameAsPublished)} ${(required && locale.requiredLabel) ||
                    ''}`.trim()) ||
            '';

        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._onDelete}
                    locale={deleteRecordConfirmation}
                />
                <ListItem
                    divider
                    classes={{
                        root: `${classes.listItem || ''} ${(required && classes.highlighted) ||
                            ''} ${(contributor.selected && classes.rowSelected) || ''} ${(!contributor.disabled &&
                            classes.disabledListItem) ||
                            ''}`.trim(),
                    }}
                    onClick={this._onSelect}
                    tabIndex={contributor.disabled || this.props.disabled ? -1 : 0}
                    onKeyDown={contributor.disabled ? this._onSelectKeyboard : () => {}}
                    aria-label={ariaLabel}
                    id={`contributor-editor-row-${this.props.index}`}
                >
                    <Hidden xsDown>
                        <ListItemIcon classes={{ root: selectedClass }}>{this.getRowIcon()}</ListItemIcon>
                    </Hidden>
                    <ContributorRowText
                        index={this.props.index}
                        canEdit={this.props.canEdit}
                        contributor={this.props.contributor}
                        classes={this.props.classes}
                        width={this.props.width}
                        showRoleInput={this.props.showRoleInput}
                        selectedClass={selectedClass}
                        suffix={this.props.locale.suffix}
                    />
                    <ListItemSecondaryAction>
                        {canMoveUp && (
                            <Tooltip
                                title={moveUpHint}
                                disableFocusListener={disabled || hideReorder}
                                disableHoverListener={disabled || hideReorder}
                                disableTouchListener={disabled || hideReorder}
                            >
                                <span>
                                    <IconButton
                                        id={`move-up-${index}`}
                                        onClick={this._onMoveUp}
                                        disabled={disabled || hideReorder}
                                        aria-label={moveUpHint}
                                    >
                                        <KeyboardArrowUp classes={{ root: `${selectedClass}` }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                        {canMoveDown && (
                            <Tooltip
                                title={moveDownHint}
                                disableFocusListener={disabled || hideReorder}
                                disableHoverListener={disabled || hideReorder}
                                disableTouchListener={disabled || hideReorder}
                            >
                                <span>
                                    <IconButton
                                        id={`move-down-${index}`}
                                        onClick={this._onMoveDown}
                                        disabled={disabled || hideReorder}
                                        aria-label={moveDownHint}
                                    >
                                        <KeyboardArrowDown classes={{ root: `${selectedClass}` }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                        {canEdit && (
                            <Tooltip
                                title={editHint}
                                disableFocusListener={disabled || !!contributor.disabled}
                                disableHoverListener={disabled || !!contributor.disabled}
                                disableTouchListener={disabled || !!contributor.disabled}
                            >
                                <span>
                                    <IconButton
                                        aria-label={editHint}
                                        onClick={this._handleEdit}
                                        disabled={disabled || !!contributor.disabled}
                                        id={`${editButtonId}-${index}`}
                                    >
                                        <Edit classes={{ root: `${selectedClass}` }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                        <Tooltip
                            title={deleteHint}
                            disableFocusListener={disabled || hideDelete}
                            disableHoverListener={disabled || hideDelete}
                            disableTouchListener={disabled || hideDelete}
                        >
                            <span>
                                <IconButton
                                    aria-label={deleteHint}
                                    onClick={this._showConfirmation}
                                    disabled={disabled || hideDelete}
                                    id={`${deleteButtonId}-${index}`}
                                >
                                    <Delete classes={{ root: `${selectedClass}` }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>
            </Fragment>
        );
    }
}

export default withStyles(styles)(withWidth()(ContributorRow));
