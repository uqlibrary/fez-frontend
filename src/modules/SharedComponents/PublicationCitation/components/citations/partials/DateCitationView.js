import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { PLACEHOLDER_ISO8601_ZULU_DATE } from 'config/general';

export default class DateCitationView extends PureComponent {
    static propTypes = {
        date: PropTypes.string,
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        format: PropTypes.string,
        className: PropTypes.string,
        isLocalised: PropTypes.bool,
        forceSpecifiedFormat: PropTypes.bool,
    };

    static defaultProps = {
        format: 'YYYY',
        prefix: '(',
        suffix: ').',
        className: 'citationDate',
        isLocalised: false,
        forceSpecifiedFormat: false,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { date, prefix, suffix, format, className, isLocalised, forceSpecifiedFormat } = this.props;
        // If there is no date, it is invalid, or is a placeholder
        if (!date || !moment(date).isValid() || moment(date).isSame(moment(PLACEHOLDER_ISO8601_ZULU_DATE))) {
            return <span className="citationDate empty" />;
        }
        const momentDate = moment(date);
        const showYearOnly = !forceSpecifiedFormat && momentDate.month() === 0 && momentDate.date() === 1;
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
