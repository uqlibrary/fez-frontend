import React from 'react';
import PropTypes from 'prop-types';

const LocaleLink = ({ to, children, onClick, ...props }) => {
    const handleClick = event => {
        if (onClick) {
            onClick(event);
        }

        if (event.defaultPrevented) {
            return;
        }

        if (event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
            return;
        }

        event.preventDefault();

        if (typeof window !== 'undefined' && typeof window.history?.pushState === 'function') {
            window.history.pushState({}, '', to);
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    return (
        <a href={to} onClick={handleClick} {...props}>
            {children}
        </a>
    );
};

LocaleLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
};

export default LocaleLink;
