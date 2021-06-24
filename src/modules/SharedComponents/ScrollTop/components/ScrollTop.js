import React from 'react';
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
});

/* istanbul ignore next */
const scrollWindowToTop = event => {
    event.preventDefault();
    document.getElementById('content-containers').scrollTop = 0;
};

export const ScrollTop = ({ show, showAfter, classes }) => {
    /* istanbul ignore next */
    const scrollableContainer = document.getElementById('content-containers');
    /* istanbul ignore next */
    if (
        !!show &&
        !!scrollableContainer &&
        !!document &&
        !!document.getElementById('scrolltopbtn') &&
        !!document.getElementById('scrolltopbtn').style
    ) {
        scrollableContainer.onscroll = () => {
            const scrollTopButton = document.getElementById('scrolltopbtn');
            if (!scrollTopButton) {
                return;
            }
            if (scrollableContainer.scrollTop > showAfter) {
                scrollTopButton.style.opacity = '0.5';
                scrollTopButton.style.right = '32px !important';
            } else {
                scrollTopButton.style.opacity = '0';
                scrollTopButton.style.right = '-1000px !important';
            }
        };
    }
    if (!!show) {
        return (
            <Hidden smDown>
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
            </Hidden>
        );
    } else {
        return <div className={'scrolltop-hidden'} />;
    }
};

ScrollTop.propTypes = {
    show: PropTypes.bool,
    showAfter: PropTypes.number,
};

ScrollTop.defaultProps = {
    show: false,
    showAfter: 100,
};

export default withStyles(styles, { withTheme: false })(ScrollTop);
