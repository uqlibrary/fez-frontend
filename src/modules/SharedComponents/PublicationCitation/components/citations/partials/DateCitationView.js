import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { PLACEHOLDER_ISO8601_ZULU_DATE } from 'config/general';

export const DateCitationView = ({ date, prefix, suffix, format, className, isLocalised, forceSpecifiedFormat }) => {
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
};

DateCitationView.propTypes = {
    date: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    format: PropTypes.string,
    className: PropTypes.string,
    isLocalised: PropTypes.bool,
    forceSpecifiedFormat: PropTypes.bool,
};

DateCitationView.defaultProps = {
    format: 'YYYY',
    prefix: '(',
    suffix: ').',
    className: 'citationDate',
    isLocalised: false,
    forceSpecifiedFormat: false,
};

export default React.memo(DateCitationView);
