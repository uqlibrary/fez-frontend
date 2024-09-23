import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { show } from '../actions';

// MUI 1
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { sanitiseId } from 'helpers/general';

export const HelpIcon = ({
    title,
    text,
    buttonLabel,
    iconSize,
    style,
    tooltip = 'Click for more information',
    IconComponent = HelpOutlineIcon,
    testId,
}) => {
    const dispatch = useDispatch();
    const setDrawerContent = () => {
        dispatch(show(title, text, buttonLabel));
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
                <IconComponent
                    sx={{
                        color: 'secondary.main',
                        opacity: 0.66,
                        '&:hover': {
                            opacity: 0.87,
                        },
                    }}
                    fontSize={iconSize}
                    titleAccess={tooltip}
                />
            </IconButton>
        </Tooltip>
    );
};

HelpIcon.propTypes = {
    buttonLabel: PropTypes.string,
    IconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.object]),
    iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    text: PropTypes.any.isRequired,
    testId: PropTypes.string,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    style: PropTypes.object,
};

export default React.memo(HelpIcon);
