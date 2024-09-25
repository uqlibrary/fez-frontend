import React from 'react';
import PropTypes from 'prop-types';

import { parseHtmlToJSX } from 'helpers/general';

export const CitationTitleView = ({ prefix = ' ', suffix = '.', className, value }) => {
    if (!value) {
        return <span className={`${className || ''} empty`} />;
    }
    return (
        <span className={className || ''}>
            {prefix}
            {parseHtmlToJSX(value)}
            {suffix === value.slice(-1) ? '' : suffix}
        </span>
    );
};
CitationTitleView.propTypes = {
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
};

export default React.memo(CitationTitleView);
