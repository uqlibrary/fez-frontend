import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { debounce } from 'throttle-debounce';

export const navigateToUrl = (uri, target, navigatedFrom, options) => {
    const fullUri = uri;
    window.open(fullUri, target, options);
};

export const AdminActions = ({ adminActions = [], vocab }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const cvoId = vocab;

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    /* istanbul ignore next */
    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuOptions = adminActions.map(action => {
        const linkTarget = action.inApp ? '_self' : '_blank';
        const options = action.options || null;
        const url = action.url?.(cvoId) ?? '';
        const clickHandler =
            action.onClick ??
            ((forceNewTab = false) =>
                debounce(
                    300,
                    event => {
                        navigateToUrl(url, event.ctrlKey || forceNewTab ? '_blank' : linkTarget, options);
                    },
                    { atBegin: true },
                ));
        const label = action.label;
        return {
            label,
            clickHandler,
        };
    });

    return (
        <React.Fragment>
            <IconButton
                id={`admin-actions-button-${cvoId}`}
                data-analyticsid={`admin-actions-button-${cvoId}`}
                data-testid={`admin-actions-button-${cvoId}`}
                aria-label="More"
                aria-haspopup="true"
                onClick={handleClick}
                size="large"
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                id={`admin-actions-menu-${cvoId}`}
                data-testid={`admin-actions-menu-${cvoId}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {menuOptions.map((option, index) => (
                    <MenuItem
                        key={index}
                        onClick={option.clickHandler}
                        onContextMenu={() => option.clickHandler(true)}
                        onAuxClick={() => option.clickHandler(true)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    );
};

AdminActions.propTypes = {
    adminActions: PropTypes.array,
    vocab: PropTypes.number.isRequired,
};

export default React.memo(AdminActions);
