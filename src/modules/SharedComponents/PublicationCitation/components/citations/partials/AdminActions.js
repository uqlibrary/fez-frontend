import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export const navigateToUrl = (url, target, navigatedFrom = '') => () => {
    if (url.indexOf('?') > 0) {
        window.open(`${url}&navigatedFrom=${navigatedFrom}`, target);
    } else {
        window.open(`${url}?navigatedFrom=${navigatedFrom}`, target);
    }
};

export const AdminActions = ({ pid, navigatedFrom, options }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    /* istanbul ignore next */
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <IconButton id="admin-actions-button" aria-label="More" aria-haspopup="true" onClick={handleClick}>
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu id="admin-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                {options.map((option, index) => (
                    <MenuItem
                        key={index}
                        onClick={navigateToUrl(option.url(pid), option.inApp ? '_self' : '_blank', navigatedFrom)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    );
};

AdminActions.propTypes = {
    pid: PropTypes.string,
    navigatedFrom: PropTypes.string,
    options: PropTypes.array.isRequired,
};

export default React.memo(AdminActions);
