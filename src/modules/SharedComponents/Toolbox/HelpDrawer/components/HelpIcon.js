import React, {Component} from 'react';
import PropTypes from 'prop-types';

// MUI 1
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from '@material-ui/core/styles';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

const styles = theme => ({
    helpIcon: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        '&:hover': {
            opacity: 0.87
        }
    }
});

export class HelpIcon extends Component {
    static propTypes = {
        title: PropTypes.string,
        text: PropTypes.any.isRequired,
        buttonLabel: PropTypes.string,
        icon: PropTypes.any,
        tooltip: PropTypes.string,
        tooltipPlacement: PropTypes.string,
        onClick: PropTypes.func,
        classes: PropTypes.object
    };

    static defaultProps = {
        tooltip: 'Click for more information',
        tooltipPlacement: 'bottom-end'
    };

    render() {
        const {classes, title, text, buttonLabel, tooltip, onClick, tooltipPlacement, icon} = this.props;
        const setDrawerContent = () => {
            onClick(title, text, buttonLabel);
        };
        return (
            <Tooltip title={tooltip}
                placement={tooltipPlacement}
                TransitionComponent={Fade}>
                <IconButton onClick={setDrawerContent}>
                    {icon || <HelpOutline className={classes.helpIcon}/>}
                </IconButton>
            </Tooltip>
        );
    }
}

export default withStyles(styles, {withTheme: true})(HelpIcon);
