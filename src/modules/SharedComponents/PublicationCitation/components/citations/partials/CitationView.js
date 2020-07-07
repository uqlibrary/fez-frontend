import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class CitationView extends PureComponent {
    static propTypes = {
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        className: PropTypes.string,
        value: PropTypes.string,
        citationId: PropTypes.string,
    };

    static defaultProps = {
        prefix: ' ',
        suffix: '.',
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { value, className, prefix, suffix, citationId } = this.props;
        if (!value) {
            return <span className={`${className || ''} empty`} data-testid={citationId} />;
        }
        return (
            <span className={className || ''} data-testid={citationId}>
                {prefix}
                {value}
                {suffix === value.slice(-1) ? '' : suffix}
            </span>
        );
    }
}
