import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Person from '@mui/icons-material/Person';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';

export const AuthButton = ({ isAuthorizedUser, signOutTooltipText, signInTooltipText, onClick }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = event => {
        if (!isAuthorizedUser) {
            onClick?.(event);
            return;
        }
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="auth-button-wrapper">
            <IconButton
                aria-controls={open ? 'auth-menu' : undefined}
                aria-haspopup={isAuthorizedUser ? 'true' : undefined}
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className={isAuthorizedUser ? 'log-out-button' : 'log-in-button'}
                size="large"
            >
                {isAuthorizedUser ? (
                    <Person id="logged-in-icon" sx={{ color: 'white.main' }} />
                ) : (
                    <PersonOutline id="logged-out-icon" sx={{ color: 'white.main' }} />
                )}
                <span className="sr-only">{isAuthorizedUser ? signOutTooltipText : signInTooltipText}</span>
            </IconButton>
            {isAuthorizedUser && (
                <Menu
                    id="auth-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                        list: {
                            className: 'auth-menu',
                            'aria-labelledby': 'auth-button',
                        },
                    }}
                >
                    <MenuItem onClick={onClick} className="auth-menu-item">
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText>
                            {' '}
                            <Tooltip
                                id="auth-button"
                                title={signOutTooltipText}
                                placement="bottom-start"
                                slots={{
                                    transition: Fade,
                                }}
                                slotProps={{
                                    transition: { timeout: 300 },
                                }}
                            >
                                Logout
                            </Tooltip>
                        </ListItemText>
                    </MenuItem>
                </Menu>
            )}
        </div>
    );
};

AuthButton.propTypes = {
    isAuthorizedUser: PropTypes.bool.isRequired,
    signOutTooltipText: PropTypes.string,
    signInTooltipText: PropTypes.string,
    onClick: PropTypes.func,
};

export default AuthButton;
