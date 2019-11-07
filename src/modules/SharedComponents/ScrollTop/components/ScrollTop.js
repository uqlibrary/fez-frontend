import React, { useEffect } from 'react';
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
// const scrollWindowToTop = (element, container) => {
//     console.log(element.event, container);
//     element.event.preventDefault();
//     document.getElementById(container).scrollTop = 0;
// };

export const ScrollTop = ({ show, containerId, showAfter, classes }) => {
    /* istanbul ignore next */
    useEffect(() => {
        document.getElementById('scrolltopbtn') &&
            document.getElementById('scrolltopbtn').addEventListener('click', e => {
                e.preventDefault();
                document.getElementById(containerId).scrollTop = 0;
            });
    });
    const scrollableContainer = document.getElementById(containerId);
    const scrollButton = document.getElementById('scrolltopbtn');
    /* istanbul ignore next */
    if (!!show && !!scrollableContainer && !!scrollButton) {
        scrollableContainer.onscroll = () => {
            if (scrollableContainer.scrollTop > showAfter) {
                scrollButton.style.opacity = '0.5';
                scrollButton.style.right = '32px !important';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.right = '-1000px !important';
            }
        };
    }
    if (!!show) {
        return (
            <Hidden smDown>
                <Fab
                    color="secondary"
                    aria-label="Scroll to top of this page"
                    className={classes.scrollTop}
                    id="scrolltopbtn"
                    title="Scroll to top of this page"
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
    containerId: PropTypes.string,
};

ScrollTop.defaultProps = {
    show: false,
    showAfter: 100,
    containerId: 'content-container',
};

export default withStyles(styles, { withTheme: false })(ScrollTop);
