import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ScrollToPos({ selector = window, x = 0, y = 0 }) {
    const { pathname } = useLocation();

    useEffect(() => {
        typeof selector === 'string' ? document.querySelector(selector)?.scrollTo(x, y) : selector?.scrollTo(x, y);
    }, [pathname, selector, x, y]);

    return null;
}

ScrollToPos.propTypes = {
    selector: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    x: PropTypes.number,
    y: PropTypes.number,
};
