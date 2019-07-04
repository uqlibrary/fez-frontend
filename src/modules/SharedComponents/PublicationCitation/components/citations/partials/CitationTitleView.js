import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

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

    render()  {
        const { value, className, prefix, suffix } = this.props;
        if (!value) {
            return (<span className={`${className || ''} empty`} />);
        }
        return (
            <span className={className || ''}>
                {prefix}{ReactHtmlParser(value)}{suffix === value.slice(-1) ? '' : suffix}
            </span>
        );
    }
}
