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
        // If there is no date, it is invalid, or is a placeholder
        if (!date || !moment(date).isValid() || moment(date).isSame(moment('1000-01-01T00:00:00Z'))) {
            return <span className="citationDate empty" />;
        }
        const momentDate = moment(date);
        const showYearOnly = momentDate.month() === 0 && momentDate.date() === 1;
        return (
            <span className={className}>
                {prefix}
                {isLocalised
                    ? moment
                          .utc(date)
                          .local()
                          .format(showYearOnly ? 'YYYY' : format)
                    : moment.utc(date).format(showYearOnly ? 'YYYY' : format)}
                {suffix}
            </span>
        );
    }
}
