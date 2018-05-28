import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const propTypes = {
    title: PropTypes.string,
    text: PropTypes.any.isRequired,
    buttonLabel: PropTypes.string,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
};

const defaultProps = {
    tooltip: 'Click for more information'
};

const HelpIcon = ({title, text, buttonLabel, tooltip, onClick}) => {
    const setDrawerContent = () => {
        onClick(title, text, buttonLabel);
    };

    return (
        <IconButton tooltip={tooltip} tooltipPosition="bottom-left" onClick={setDrawerContent}>
            <FontIcon className="material-icons helpIcon">help_outline</FontIcon>
        </IconButton>
    );
};

HelpIcon.propTypes = propTypes;
HelpIcon.defaultProps = defaultProps;

export default HelpIcon;
