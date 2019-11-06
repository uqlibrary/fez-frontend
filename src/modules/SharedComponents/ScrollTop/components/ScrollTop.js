import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
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
});

/* istanbul ignore next */
const scrollWindowToTop = event => {
    event.preventDefault();
    document.getElementById('content-container').scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
};

export const ScrollTop = ({ show, containerId, showAfter, classes }) => {
    /* istanbul ignore next */
    const scrollableContainer = document.getElementById(containerId);
    /* istanbul ignore next */
    if (scrollableContainer) {
        scrollableContainer.onscroll = () => {
            if (scrollableContainer.scrollTop > showAfter) {
                document.getElementById('scrolltopbtn').style.opacity = '0.5';
                document.getElementById('scrolltopbtn').style.right = '32px !important';
            } else {
                document.getElementById('scrolltopbtn').style.opacity = '0';
                document.getElementById('scrolltopbtn').style.right = '-1000px !important';
            }
        };
    }
    if (!!show) {
        return (
            <Fab
                color="secondary"
                aria-label="Scroll to top of page"
                className={classes.scrollTop}
                id="scrolltopbtn"
                title="Scroll to top of page"
                onClick={scrollWindowToTop}
            >
                <ArrowUpwardIcon />
            </Fab>
        );
    } else {
        return <div className={'scrolltop-hidden'} />;
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
