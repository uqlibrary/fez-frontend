import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { numberToWords, validation } from 'config';
import { ORG_TYPES_LOOKUP } from 'config/general';
import { locale } from 'locale';

import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Person from '@material-ui/icons/Person';
import PersonOutlined from '@material-ui/icons/PersonOutlined';
import Delete from '@material-ui/icons/Delete';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

export const styles = (theme) => ({
    listItem: {
        padding: '0'
    },
    rowSelected: {
        backgroundColor: ((theme.palette || {}).accent || {}).light
    },
    selected: {
        color: 'white !important',
        fontWeight: theme.typography.fontWeightMedium
    },
    hideIcon: {
        display: 'none'
    },
    primary: {
        fontSize: theme.typography.body2.fontSize,
    },
    identifierName: {
        fontSize: theme.typography.caption.fontSize,
        marginTop: 8,
        '&:before': {
            content: '"UQ Id: "'
        }
    },
    identifierSubtitle: {
        fontSize: theme.typography.caption.fontSize,
        '&:before': {
            content: '"UQ Username: "'
        }
    },
    highlighted: {
        borderLeft: '5px solid red'
    }
});

export class ContributorRow extends PureComponent {
    static propTypes = {
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
        onMoveDown: PropTypes.func,
        onMoveUp: PropTypes.func,
        showContributorAssignment: PropTypes.bool,
        width: PropTypes.string,
    };

    static defaultProps = {
        locale: {
            suffix: ' listed contributor',
            moveUpHint: 'Move record up the order',
            moveDownHint: 'Move record down the order',
            deleteHint: 'Remove this record',
            selectHint: 'Select this record ([name]) to assign it to you',
            deleteRecordConfirmation: {
                confirmationTitle: 'Delete record',
                confirmationMessage: 'Are you sure you want to delete this record?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            }
        },
        hideReorder: false,
        hideDelete: false,
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

    _onSelectKeyboard = (event) => {
        if (event.key === 'Enter') {
            this._select();
        }
    };

    _onSelect = (event) => {
        this._select();
        event && event.currentTarget.blur();
    };

    _select = () => {
        const { disabled, onSelect, index } = this.props;
        if (!disabled && !!onSelect) {
            onSelect(index);
        }
    };

    getListItemTypography = (primaryText, secondaryText, primaryClass, secondaryClass) => (
        <ListItemText
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

    getContributorRowText = (selectedClass) => {
        const { index, contributor, classes, width } = this.props;
        const { suffix } = this.props.locale;
        const contributorOrder = `${numberToWords(index + 1)} ${suffix}`;
        return (
            <Grid container classes={{ container: classes.listItem }}>
                <Grid item xs={10} sm={5} md={5}>
                    {this.getListItemTypography(
                        contributor.nameAsPublished,
                        contributorOrder,
                        `${classes.primary} ${selectedClass}`,
                        `${selectedClass}`
                    )}
                </Grid>
                {
                    !!contributor.aut_title &&
                    <Grid item xs={10} sm={5} md={5}>
                        {this.getListItemTypography(
                            `${contributor.aut_title} ${contributor.aut_display_name}`,
                            `${locale.global.orgTitle} (${contributor.aut_org_username || contributor.aut_student_username})`,
                            `${width === 'xs' ? classes.identifierName : classes.primary} ${selectedClass}`,
                            `${width === 'xs' ? classes.identifierSubtitle : ''} ${selectedClass}`
                        )}
                    </Grid>
                }
                {
                    contributor.affiliation && contributor.affiliation !== 'UQ' &&
                    <Grid item xs={5}>
                        {this.getListItemTypography(
                            `${contributor.orgaff}`,
                            `${ORG_TYPES_LOOKUP[contributor.orgtype] && `Organisation type: ${ORG_TYPES_LOOKUP[contributor.orgtype]}` || ''}`,
                            `${width === 'xs' ? classes.identifierName : classes.primary} ${selectedClass}`,
                            `${width === 'xs' ? classes.identifierSubtitle : ''} ${selectedClass}`
                        )}
                    </Grid>
                }
                {
                    contributor.affiliation && contributor.affiliation === 'UQ' && !contributor.aut_title &&
                    <Grid item xs={5}>
                        {this.getListItemTypography(
                            locale.global.orgTitle,
                            'Organisation type: University',
                            `${width === 'xs' ? classes.identifierName : classes.primary} ${selectedClass}`,
                            `${width === 'xs' ? classes.identifierSubtitle : ''} ${selectedClass}`
                        )}
                    </Grid>
                }
                {
                    contributor.creatorRole &&
                    <Grid item xs={10} sm={5} md={5}>
                        {this.getListItemTypography(
                            contributor.creatorRole,
                            '',
                            `${width === 'xs' ? classes.identifierName : classes.primary} ${selectedClass}`,
                            `${width === 'xs' ? classes.identifierSubtitle : ''} ${selectedClass}`
                        )}
                    </Grid>
                }
            </Grid>
        );
    };

    render() {
        const {
            deleteRecordConfirmation,
            moveUpHint,
            moveDownHint,
            deleteHint,
            selectHint
        } = this.props.locale;
        const {
            contributor,
            canMoveDown,
            canMoveUp,
            disabled,
            classes,
            hideReorder,
            hideDelete
        } = this.props;

        const ariaLabel = (
            selectHint &&
            selectHint.indexOf('[name]') > -1
        )
            ? selectHint.replace('[name]', contributor.nameAsPublished)
            : null
            ;
        const enableSelect = this.props.showContributorAssignment;
        const selectedClass = contributor.selected ? classes.selected : '';
        const highlighted = !!validation.authorAffiliationIncomplete(contributor);

        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._onDelete}
                    locale={deleteRecordConfirmation}
                />
                <ListItem
                    style={{ cursor: 'pointer', width: '98%', margin: '0 1%' }}
                    divider
                    classes={{ root: `${
                        contributor.selected && classes.rowSelected
                    } ${
                        highlighted && classes.highlighted
                    }` }}
                    tabIndex={0}
                    onClick={enableSelect ? this._onSelect : () => { }}
                    onKeyDown={enableSelect ? this._onSelectKeyboard : () => { }}
                    aria-label={ariaLabel}
                >
                    <Hidden xsDown>
                        <ListItemIcon classes={{ root: selectedClass }}>
                            {contributor.selected ? <Person /> : <PersonOutlined />}
                        </ListItemIcon>
                    </Hidden>
                    {this.getContributorRowText(selectedClass)}
                    <ListItemSecondaryAction>
                        {
                            canMoveUp &&
                            <Tooltip title={moveUpHint}
                                disableFocusListener={disabled || hideReorder}
                                disableHoverListener={disabled || hideReorder}
                                disableTouchListener={disabled || hideReorder}
                            >
                                <span>
                                    <IconButton
                                        onClick={this._onMoveUp}
                                        disabled={disabled || hideReorder}
                                        aria-label={moveUpHint}
                                    >
                                        <KeyboardArrowUp classes={{ root: `${selectedClass}` }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        }
                        {
                            canMoveDown &&
                            <Tooltip title={moveDownHint}
                                disableFocusListener={disabled || hideReorder}
                                disableHoverListener={disabled || hideReorder}
                                disableTouchListener={disabled || hideReorder}
                            >
                                <span>
                                    <IconButton
                                        onClick={this._onMoveDown}
                                        disabled={disabled || hideReorder}
                                        aria-label={moveDownHint}
                                    >
                                        <KeyboardArrowDown classes={{ root: `${selectedClass}` }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        }
                        <Tooltip title={deleteHint}
                            disableFocusListener={disabled || hideDelete}
                            disableHoverListener={disabled || hideDelete}
                            disableTouchListener={disabled || hideDelete}
                        >
                            <span>
                                <IconButton
                                    aria-label={deleteHint}
                                    onClick={this._showConfirmation}
                                    disabled={disabled || hideDelete}
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
