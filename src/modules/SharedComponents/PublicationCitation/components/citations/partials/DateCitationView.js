import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
// Using moment.js to format the date - https://momentjs.com/
const moment = require('moment');

export default class DateCitationView extends PureComponent {
    static propTypes = {
        date: PropTypes.string,
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        format: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        format: 'YYYY',
        prefix: '(',
        suffix: ').',
        className: 'citationDate'
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {date, prefix, suffix, format, className} = this.props;
        // If there is no date, or it is invalid
        if (!date || !moment(date).isValid()) return (<span className="citationDate empty"/>);
        return (<span className={className}>{prefix}{moment.utc(date).local().format(format)}{suffix}</span>);
    }
}
