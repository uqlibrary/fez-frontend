// Leaf module: date format constants and server-date formatting. No React/MUI imports, so data
// modules (e.g. locale) can use these without pulling in the AdminDashboard UI graph.
import moment from 'moment';

export const DEFAULT_DATEPICKER_INPUT_FORMAT = 'DD/MM/YYYY';
export const DEFAULT_DATEPICKER_INPUT_FORMAT_WITH_TIME = 'DD/MM/YYYY HH:mm:ss';
export const DEFAULT_DATE_FORMAT = 'Do MMMM YYYY';
export const DEFAULT_DATE_FORMAT_WITH_TIME = 'Do MMMM YYYY hh:mm';
export const DEFAULT_SERVER_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_SERVER_DATE_FORMAT_NO_TIME = 'YYYY-MM-DD';
export const DEFAULT_DATE_FORMAT_WITH_TIME_24H = 'Do MMMM YYYY HH:mm';
export const DEFAULT_DATE_FORMAT_WITH_TIME_24H_SECONDS = 'Do MMMM YYYY HH:mm:ss';

export const getFormattedServerDate = (dateStr, format = DEFAULT_DATE_FORMAT) =>
    (dateStr && moment(dateStr, DEFAULT_SERVER_DATE_FORMAT).format(format)) || '';
