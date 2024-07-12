import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = ({ children }) => {
    const location = useLocation();
    React.useEffect(() => {
        const element = document.getElementById('content-container');
        if (location?.state?.scrollToTop !== false && element) {
            element.scrollTop = 0;
        }
    }, [location]);

    return children;
};
ScrollToTop.propTypes = {
    children: PropTypes.any,
    location: PropTypes.object,
};

export default ScrollToTop;
