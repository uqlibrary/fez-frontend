import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tooltip from '@mui/material/Tooltip';
import Person from '@mui/icons-material/Person';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Fade from '@mui/material/Fade';

export const AuthButton = ({ isAuthorizedUser, signOutTooltipText, signInTooltipText, onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <div className="auth-button-wrapper">
            <Tooltip
                id="auth-button"
                title={isAuthorizedUser ? signOutTooltipText : signInTooltipText}
                placement="bottom-start"
                slots={{
                    transition: Fade,
                }}
                slotProps={{
                    transition: { timeout: 300 },
                }}
            >
                <IconButton
                    onClick={onClick}
                    className={isAuthorizedUser ? 'log-out-button' : 'log-in-button'}
                    size="large"
                    sx={{ gap: 1, color: 'white.main' }}
                >
                    {isAuthorizedUser ? (
                        <>
                            <Person
                                id="logged-in-icon"
                                sx={{ color: 'white.main', display: isMobile ? 'none' : 'block' }}
                            />
                            <Typography component="span">Log out</Typography>
                        </>
                    ) : (
                        <>
                            <PersonOutline
                                id="logged-out-icon"
                                sx={{ color: 'white.main', display: isMobile ? 'none' : 'block' }}
                            />
                            <Typography component="span">Log in</Typography>
                        </>
                    )}
                </IconButton>
            </Tooltip>
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
