import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OpenInNew from '@mui/icons-material/OpenInNew';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import { MENUACTIONS } from '../config';
import { stringToColour, abbreviateNumber, getPlatformUrl } from '../utils';

const QuickLink = ({ link, index, locale, itemCount, onMenuItemClick, ...rest }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const platform = getPlatformUrl();

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

    const avatar = React.useMemo(() => {
        if (link.qlk_link.includes(platform)) {
            if (link.qlk_amount !== null) {
                return abbreviateNumber(link.qlk_amount, 1);
            } else return <ScheduleIcon fontSize="small" />;
        } else return <OpenInNew fontSize="small" />;
    }, [link.qlk_link, link.qlk_amount, platform]);

    return (
        <Card role="listitem" {...rest}>
            <CardHeader
                avatar={
                    <Box
                        sx={{
                            bgcolor: stringToColour(link.qlk_title),
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            padding: 1,
                            borderRadius: 2,
                            color: 'white !important',
                            textShadow: '0px 0px 2px rgba(0,0,0,0.87)',
                            ...(!link.qlk_link.includes(platform) ? { lineHeight: '0.5rem' } : {}),
                        }}
                    >
                        {avatar}
                    </Box>
                }
                title={
                    <ExternalLink
                        id={`quick-link-${index}`}
                        data-testid={`quick-link-${index}`}
                        href={link.qlk_link}
                        inline
                        openInNewIcon={false}
                    >
                        {link.qlk_title}
                    </ExternalLink>
                }
                action={
                    <React.Fragment>
                        <IconButton
                            aria-label="settings"
                            onClick={handleOpen}
                            data-testid={`admin-actions-button-${index}`}
                        >
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
                                    data-testid={`admin-actions-menu-option-${mIndex}`}
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
        qlk_title: PropTypes.string.isRequired,
        qlk_link: PropTypes.string.isRequired,
        qlk_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    index: PropTypes.number.isRequired,
    locale: PropTypes.object.isRequired,
    itemCount: PropTypes.number.isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
};

export default React.memo(QuickLink);
