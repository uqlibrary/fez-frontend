import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import { stringToColour, abbreviateNumber } from '../utils';

export const MENUACTIONS = {
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    UP: 'MOVEUP',
    TOP: 'MOVETOP',
    DOWN: 'MOVEDOWN',
    BOTTOM: 'MOVEBOTTOM',
};

const QuickLink = ({ link, index, locale, itemCount, onMenuItemClick, ...rest }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const menuOptions = [
        {
            label: locale.menu.editLabel,
            action: MENUACTIONS.EDIT,
            disabled: false,
        },
        {
            label: locale.menu.deleteLabel,
            action: MENUACTIONS.DELETE,
            disabled: false,
        },
        {
            label: locale.menu.moveUpLabel,
            action: MENUACTIONS.UP,
            disabled: index === 0,
        },
        {
            label: locale.menu.moveTopLabel,
            action: MENUACTIONS.TOP,
            disabled: index === 0,
        },
        {
            label: locale.menu.moveDownLabel,
            action: MENUACTIONS.DOWN,
            disabled: index + 1 === itemCount,
        },
        {
            label: locale.menu.moveBottomLabel,
            action: MENUACTIONS.BOTTOM,
            disabled: index + 1 === itemCount,
        },
    ];

    const handleOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    /* istanbul ignore next */
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card {...rest}>
            <CardHeader
                avatar={
                    <Box
                        sx={{
                            bgcolor: stringToColour(link.title),
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            padding: 1,
                            borderRadius: 2,
                            color: 'white !important',
                            textShadow: '0px 0px 2px rgba(0,0,0,0.87)',
                        }}
                        aria-label="count"
                    >
                        {abbreviateNumber(link.amount, 1)}
                    </Box>
                }
                title={
                    <ExternalLink
                        id={`quick-link-${index}`}
                        data-testid={`quick-link-${index}`}
                        href={link.target}
                        inline
                        openInNewIcon={false}
                    >
                        {link.title}
                    </ExternalLink>
                }
                action={
                    <React.Fragment>
                        <IconButton aria-label="settings" onClick={handleOpen}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id={`admin-actions-menu-${index}`}
                            data-testid={`admin-actions-menu-${index}`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            {menuOptions.map((option, mIndex) => (
                                <MenuItem
                                    key={mIndex}
                                    onClick={() => {
                                        onMenuItemClick(option.action);
                                        handleClose();
                                    }}
                                    disabled={option.disabled}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </React.Fragment>
                }
                sx={{ padding: 1 }}
            />
        </Card>
    );
};

QuickLink.propTypes = {
    link: PropTypes.shape({
        title: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),
    index: PropTypes.number.isRequired,
    locale: PropTypes.object.isRequired,
    itemCount: PropTypes.number.isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
};

export default React.memo(QuickLink);
