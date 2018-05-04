import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const propTypes = {
    title: PropTypes.string,
    text: PropTypes.any.isRequired,
    buttonLabel: PropTypes.string,
    tooltip: PropTypes.string,
    tooltipIconColor: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object
};

const defaultProps = {
    style: {},
    tooltip: 'Click for more information',
    tooltipIconColor: '#CCCCCC'
};

const HelpIcon = ({title, text, buttonLabel, tooltip, tooltipIconColor, onClick, style}) => {
    const setDrawerContent = () => {
        onClick(title, text, buttonLabel);
    };

    return (
        <IconButton tooltip={tooltip} tooltipPosition="bottom-left" onClick={setDrawerContent} style={style}>
            <FontIcon className="material-icons helpIcon" color={tooltipIconColor}>help_outline</FontIcon>
        </IconButton>
    );
};

HelpIcon.propTypes = propTypes;
HelpIcon.defaultProps = defaultProps;

export default HelpIcon;
