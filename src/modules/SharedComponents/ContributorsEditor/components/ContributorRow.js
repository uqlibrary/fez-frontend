import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import locale from 'locale/global';
import Grid from '@mui/material/Grid';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Person from '@mui/icons-material/Person';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import Lock from '@mui/icons-material/Lock';
import { ContributorRowText } from './ContributorRowText';
import { useConfirmationState, useWidth } from 'hooks';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

const classes = {
    listItem: {
        borderLeft: '5px solid transparent',
        cursor: 'pointer',
        width: '100%',
        margin: '0',
    },
    disabledListItem: {
        '&, &:focus': {
            outline: 'none !important',
        },
    },
    highlighted: {
        borderLeft: '5px solid red',
    },
    rowSelected: theme => ({
        backgroundColor: `${theme.palette.accent.main} !important`,
        '& svg': {
            color: 'white !important',
        },
    }),
    contributorLinked: {
        color: 'primary.main',
        backgroundColor: 'secondary.light',
        '& p': {
            fontWeight: 500,
        },
        '& svg': {
            color: 'primary.main',
        },
    },
    selected: {
        color: 'white !important',
        fontWeight: 'fontWeightMedium',
    },

    // styles below used in ContributorRowText
    primary: {
        fontSize: 'body2.fontSize',
    },
    identifierName: {
        fontSize: 'caption.fontSize',
        marginTop: 1,
    },
    identifierSubtitle: {
        fontSize: 'caption.fontSize',
    },
};

const StyledActionsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    [theme.breakpoints.up('md')]: {
        marginLeft: 'auto',
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        borderTopColor: '#ddd',
        borderTopStyle: 'dashed',
        borderTopWidth: '1px',
        marginTop: '10px',
        marginBottom: '-8px',
    },
}));

export const ContributorRow = ({
    canEdit,
    canMoveDown,
    canMoveUp,
    contributor,
    contributorRowId,
    disabled,
    hideDelete,
    hideReorder,
    index,
    locale: {
        deleteRecordConfirmation,
        moveUpHint,
        moveDownHint,
        deleteHint,
        editHint,
        selectHint,
        lockedTooltip,
        suffix,
    },
    onSelect,
    onDelete,
    onEdit,
    onMoveDown,
    onMoveUp,
    required,
    enableSelect,
    showRoleInput,
}) => {
    const theme = useTheme();
    const width = useWidth();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const _onDelete = React.useCallback(
        () => {
            /* istanbul ignore else */
            if (!disabled && onDelete) {
                onDelete(contributor, index);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [contributor, index],
    );

    const _onMoveUp = React.useCallback(
        e => {
            e.preventDefault();
            e.stopPropagation();

            /* istanbul ignore else */
            if (!disabled && onMoveUp) {
                onMoveUp(contributor, index);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [contributor, index],
    );

    const _onMoveDown = React.useCallback(
        e => {
            /* istanbul ignore else */
            e.preventDefault();
            e.stopPropagation();
            if (!disabled && onMoveDown) {
                onMoveDown(contributor, index);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [contributor, index],
    );

    const _select = React.useCallback(() => {
        if (!disabled && !!onSelect && enableSelect) {
            onSelect(index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    const _onSelectKeyboard = event => {
        if (event.key === 'Enter') {
            _select();
        }
    };

    const _onSelect = React.useCallback(
        event => {
            _select();
            event && event.currentTarget.blur();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [index],
    );

    const _handleEdit = React.useCallback(
        e => {
            e.preventDefault();
            e.stopPropagation();
            canEdit && !!onEdit && onEdit(index);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [index],
    );

    const getRowIcon = () => {
        if (parseInt(contributor.uqIdentifier, 10)) {
            return <HowToRegIcon />;
        } else if (contributor.selected) {
            return <Person />;
        } else if ((disabled || contributor.disabled) && !enableSelect) {
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
    };

    const selectedClass = contributor.selected ? classes.selected : {};

    const ariaLabel =
        (!disabled &&
            `${selectHint.replace('[name]', contributor.nameAsPublished)} ${(required && locale.requiredLabel) ||
                ''}`.trim()) ||
        '';

    const listClasses = {
        ...classes.listItem,
        ...(required && classes.highlighted),
        ...(contributor.disabled && classes.disabledListItem),
        ...(canEdit && parseInt(contributor.uqIdentifier, 10) && classes.contributorLinked),
        ...(contributor.selected && classes.rowSelected(theme)),
    };
    return (
        <Fragment>
            <ConfirmationBox
                onAction={_onDelete}
                onClose={hideConfirmation}
                isOpen={isOpen}
                locale={deleteRecordConfirmation}
                confirmationBoxId={`${contributorRowId}-${index}-delete`}
            />
            <ListItem
                divider
                sx={{ ...listClasses }}
                onClick={_onSelect}
                tabIndex={contributor.disabled || disabled ? -1 : 0}
                onKeyDown={!contributor.disabled ? _onSelectKeyboard : () => {}}
                aria-label={ariaLabel}
                id={`${contributorRowId}-${index}`}
                data-testid={`${contributorRowId}-${index}`}
            >
                <Grid container p={0} id="contributor-row">
                    <ListItemIcon sx={{ display: { xs: 'none', sm: 'block' }, ...selectedClass }}>
                        {getRowIcon()}
                    </ListItemIcon>
                    <ContributorRowText
                        index={index}
                        canEdit={canEdit}
                        contributor={contributor}
                        classes={classes}
                        width={width}
                        showRoleInput={showRoleInput}
                        selectedClass={selectedClass}
                        suffix={suffix}
                        contributorRowId={`${contributorRowId}-${index}`}
                    />

                    <StyledActionsContainer
                        id={`${contributorRowId}-${index}-actions`}
                        data-testid={`${contributorRowId}-${index}-actions`}
                    >
                        {canMoveUp && (
                            <Tooltip
                                title={moveUpHint}
                                disableFocusListener={disabled || hideReorder}
                                disableHoverListener={disabled || hideReorder}
                                disableTouchListener={disabled || hideReorder}
                            >
                                <IconButton
                                    id={`${contributorRowId}-move-up-${index}`}
                                    data-analyticsid={`${contributorRowId}-${index}-move-up`}
                                    data-testid={`${contributorRowId}-${index}-move-up`}
                                    onClick={_onMoveUp}
                                    disabled={disabled || hideReorder}
                                    aria-label={moveUpHint}
                                    size="large"
                                >
                                    <KeyboardArrowUp sx={{ ...selectedClass }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canMoveDown && (
                            <Tooltip
                                title={moveDownHint}
                                disableFocusListener={disabled || hideReorder}
                                disableHoverListener={disabled || hideReorder}
                                disableTouchListener={disabled || hideReorder}
                            >
                                <IconButton
                                    id={`${contributorRowId}-move-down-${index}`}
                                    data-analyticsid={`${contributorRowId}-${index}-move-down`}
                                    data-testid={`${contributorRowId}-${index}-move-down`}
                                    onClick={_onMoveDown}
                                    disabled={disabled || hideReorder}
                                    aria-label={moveDownHint}
                                    size="large"
                                >
                                    <KeyboardArrowDown sx={{ ...selectedClass }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canEdit && (
                            <Tooltip
                                title={editHint}
                                disableFocusListener={disabled || !!contributor.disabled}
                                disableHoverListener={disabled || !!contributor.disabled}
                                disableTouchListener={disabled || !!contributor.disabled}
                            >
                                <IconButton
                                    aria-label={editHint}
                                    onClick={_handleEdit}
                                    disabled={disabled || !!contributor.disabled}
                                    id={`${contributorRowId}-edit-${index}`}
                                    data-analyticsid={`${contributorRowId}-${index}-edit`}
                                    data-testid={`${contributorRowId}-${index}-edit`}
                                    size="large"
                                >
                                    <Edit sx={{ ...selectedClass }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip
                            title={deleteHint}
                            disableFocusListener={disabled || hideDelete}
                            disableHoverListener={disabled || hideDelete}
                            disableTouchListener={disabled || hideDelete}
                        >
                            <IconButton
                                aria-label={deleteHint}
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    showConfirmation();
                                }}
                                disabled={disabled || hideDelete}
                                id={`${contributorRowId}-delete-${index}`}
                                data-analyticsid={`${contributorRowId}-${index}-delete`}
                                data-testid={`${contributorRowId}-${index}-delete`}
                                size="large"
                            >
                                <Delete sx={{ ...selectedClass }} />
                            </IconButton>
                        </Tooltip>
                    </StyledActionsContainer>
                </Grid>
            </ListItem>
        </Fragment>
    );
};

ContributorRow.propTypes = {
    canEdit: PropTypes.bool,
    canMoveDown: PropTypes.bool,
    canMoveUp: PropTypes.bool,
    contributor: PropTypes.object.isRequired,
    contributorRowId: PropTypes.string.isRequired,
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
    required: PropTypes.bool,
    enableSelect: PropTypes.bool,
    showRoleInput: PropTypes.bool,
};

ContributorRow.defaultProps = {
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
    },
    hideReorder: false,
    hideDelete: false,
    required: false,
    enableSelect: false,
};
/* istanbul ignore next */
export default React.memo(ContributorRow, (pp, np) => {
    return (
        pp.disabled === np.disabled &&
        pp.index === np.index &&
        !np.contributor.selected &&
        !pp.contributor.selected &&
        pp.contributor.nameAsPublished === np.contributor.nameAsPublished &&
        pp.canMoveUp === np.canMoveUp &&
        pp.canMoveDown === np.canMoveDown
    );
});
