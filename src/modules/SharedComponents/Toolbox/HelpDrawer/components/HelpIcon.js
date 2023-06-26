import React from 'react';
import PropTypes from 'prop-types';

// MUI 1
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { sanitiseId } from 'helpers/general';

const useStyles = makeStyles(
    theme => ({
        helpIcon: {
            color: theme.palette.secondary.main,
            opacity: 0.66,
            '&:hover': {
                opacity: 0.87,
            },
        },
    }),
    { withTheme: true },
);

export const HelpIcon = ({ title, text, buttonLabel, iconSize, style, tooltip, onClick, IconComponent, testId }) => {
    const classes = useStyles();
    const setDrawerContent = () => {
        onClick(title, text, buttonLabel);
    };
    const id = sanitiseId(`help-icon${!!testId ? `-${testId}` : ''}`);

    return (
        <Tooltip title={tooltip} placement="bottom-end" TransitionComponent={Fade}>
            <IconButton
                onClick={setDrawerContent}
                aria-label={tooltip}
                id={id}
                data-analyticsid={id}
                data-testid={id}
                size={iconSize}
                style={style}
            >
                <IconComponent className={classes.helpIcon} fontSize={iconSize} titleAccess={tooltip} />
            </IconButton>
        </Tooltip>
    );
};

HelpIcon.propTypes = {
    buttonLabel: PropTypes.string,
    IconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.object]),
    iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onClick: PropTypes.func,
    text: PropTypes.any.isRequired,
    testId: PropTypes.string,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    style: PropTypes.object,
};

HelpIcon.defaultProps = {
    tooltip: 'Click for more information',
    IconComponent: HelpOutlineIcon,
};

export default HelpIcon;
