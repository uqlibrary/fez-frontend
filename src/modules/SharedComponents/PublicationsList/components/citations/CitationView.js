import React from 'react';
import PropTypes from 'prop-types';

export default class CitationView extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        citationClass: PropTypes.string.isRequired,
        children: PropTypes.any
    };

    static defaultProps = {
        prefix: ' ',
        suffix: '.',
        citationClass: ''
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {prefix, children, suffix, citationClass} = this.props;
        return (
            <span className={citationClass}>
                {prefix}{children}{suffix}
            </span>
        );
    }
}
