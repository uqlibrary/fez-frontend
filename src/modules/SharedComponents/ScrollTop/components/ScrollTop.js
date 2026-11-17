import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

/* istanbul ignore next */
const scrollWindowToTop = event => {
    event.preventDefault();
    const container = document.getElementById('content-container');
    container.scrollTop = 0;
    // The button hides at the top of the page, so move focus to the start of the content with it
    container.focus();
};

export const ScrollTop = ({ show = false, showAfter = 100 }) => {
    /* istanbul ignore next */
    const scrollableContainer = document.getElementById('content-container');
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
                console.log('not found scroll');
                return;
            }
            // visibility (not just opacity) keeps the hidden button out of the tab order and screen readers
            if (scrollableContainer.scrollTop > showAfter) {
                scrollTopButton.style.visibility = 'visible';
                scrollTopButton.style.opacity = '0.5';
                scrollTopButton.style.right = '32px !important';
            } else {
                scrollTopButton.style.visibility = 'hidden';
                scrollTopButton.style.opacity = '0';
                scrollTopButton.style.right = '-1000px !important';
            }
        };
    }
    if (!!show) {
        return (
            <Fab
                color="secondary"
                aria-label="Scroll to top of page"
                id="scrolltopbtn"
                title="Scroll to top of page"
                onClick={scrollWindowToTop}
                sx={{
                    display: { xs: 'none', md: 'inline-flex' },
                    opacity: 0,
                    visibility: 'hidden',
                    position: 'absolute',
                    right: '32px',
                    bottom: '16px',
                    WebkitTransition: 'opacity 0.5s',
                    transition: 'opacity 0.3s',
                    '&hover:': {
                        WebkitTransition: 'opacity 0.5s',
                        transition: 'opacity 0.3s',
                        opacity: 0.9,
                    },
                }}
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
};

export default ScrollTop;
