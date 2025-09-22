import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { show } from '../actions';

// MUI 1
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { sanitiseId } from 'helpers/general';

export const HelpIcon = forwardRef(
    (
        {
            title,
            text,
            buttonLabel,
            iconSize,
            style,
            tooltip = 'Click for more information',
            IconComponent = HelpOutlineIcon,
            testId,
            disabled,
        },
        ref,
    ) => {
        const dispatch = useDispatch();
        const openDrawer = () => dispatch(show(title, text, buttonLabel));
        useImperativeHandle(ref, () => ({
            openDrawer,
        }));

        const id = sanitiseId(`help-icon${!!testId ? `-${testId}` : ''}`);
        return (
            <Tooltip title={tooltip} placement="bottom-end" TransitionComponent={Fade}>
                <IconButton
                    id={id}
                    ref={ref}
                    aria-label={tooltip}
                    data-analyticsid={id}
                    data-testid={id}
                    size={iconSize}
                    style={style}
                    {...(!disabled && {
                        onClick: openDrawer,
                    })}
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
    },
);

HelpIcon.propTypes = {
    buttonLabel: PropTypes.string,
    IconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.object]),
    iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    text: PropTypes.any.isRequired,
    testId: PropTypes.string,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
};

export default React.memo(HelpIcon);
