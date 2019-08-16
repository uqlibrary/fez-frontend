import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class DateCitationView extends PureComponent {
    static propTypes = {
        date: PropTypes.string,
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        format: PropTypes.string,
        className: PropTypes.string,
        isLocalised: PropTypes.bool,
    };

    static defaultProps = {
        format: 'YYYY',
        prefix: '(',
        suffix: ').',
        className: 'citationDate',
        isLocalised: false,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { date, prefix, suffix, format, className, isLocalised } = this.props;
        // If there is no date, or it is invalid
        if (!date || !moment(date).isValid()) return <span className="citationDate empty" />;
        return (
            <span className={className}>
                {prefix}
                {isLocalised
                    ? moment
                        .utc(date)
                        .local()
                        .format(format)
                    : moment.utc(date).format(format)}
                {suffix}
            </span>
        );
    }
}
