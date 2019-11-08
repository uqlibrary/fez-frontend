import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

export const styles = () => ({
    scrollTop: {
        opacity: 0,
        position: 'absolute',
        right: 32,
        bottom: 16,
        '-webkit-transition': 'opacity 0.5s',
        transition: 'opacity 0.3s',
        '&hover:': {
            '-webkit-transition': 'opacity 0.5s',
            transition: 'opacity 0.3s',
            opacity: 0.9,
        },
    },
    showButton: {
        opacity: 0.9,
    },
    hideButton: {
        opacity: 0,
    },
});

/* istanbul ignore next */
const scrollWindowToTop = container => {
    document.getElementById(container).scrollTop = 0;
};

export const ScrollTop = ({ show, containerId, showAfter, classes }) => {
    /* istanbul ignore next */
    const [showButton, setButtonVisibility] = useState(false);
    /* istanbul ignore next */
    useEffect(() => {
        document.getElementById(containerId) &&
            document.getElementById(containerId).addEventListener('scroll', e => {
                e.preventDefault();
                setButtonVisibility(!!(show && document.getElementById(containerId).scrollTop > showAfter));
            });
    });

    if (!!show) {
        return (
            <Hidden smDown>
                <Fab
                    color="secondary"
                    aria-label="Scroll to top of this page"
                    className={` ${classes.scrollTop} ${showButton ? classes.showButton : classes.hideButton} `}
                    id="scrolltopbtn"
                    title="Scroll to top of this page"
                >
                    <ArrowUpwardIcon onClick={() => scrollWindowToTop(containerId)} />
                </Fab>
            </Hidden>
        );
    } else {
        return null;
    }
};

ScrollTop.propTypes = {
    show: PropTypes.bool,
    showAfter: PropTypes.number,
    containerId: PropTypes.string,
};

ScrollTop.defaultProps = {
    show: false,
    showAfter: 100,
    containerId: 'content-container',
};

export default withStyles(styles, { withTheme: false })(ScrollTop);
