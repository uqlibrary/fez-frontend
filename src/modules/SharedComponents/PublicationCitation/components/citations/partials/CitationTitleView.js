import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { parseHtmlToJSX } from 'helpers/general';

export default class CitationTitleView extends PureComponent {
    static propTypes = {
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        className: PropTypes.string,
        value: PropTypes.string,
    };

    static defaultProps = {
        prefix: ' ',
        suffix: '.',
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { value, className, prefix, suffix } = this.props;
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
    }
}
