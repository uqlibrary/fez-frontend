/* eslint-disable no-unused-vars */
import moment from 'moment';

import { DEFAULT_SERVER_DATE_FORMAT_NO_TIME, SYSTEM_ALERT_ACTION, REPORT_TYPE } from './config';
import { filterObjectProps, getPlatformUrl, trimTrailingSlash } from './utils';

import { IS_PRODUCTION, PRODUCTION_URL, STAGING_URL } from 'config/general';

export const transformSystemAlertRequest = ({ user, action, row }) => {
    const keys =
        action === SYSTEM_ALERT_ACTION.RESOLVE
            ? ['sat_id', 'sat_resolved_date', 'sat_resolved_by']
            : ['sat_id', 'sat_assigned_to', 'sat_assigned_date'];

    const request = filterObjectProps(row, keys);
    if (action === SYSTEM_ALERT_ACTION.ASSIGN) {
        /* istanbul ignore else */
        if (request.sat_assigned_to === 0) request.sat_assigned_to = null;
        request.sat_assigned_date = moment().format('YYYY-MM-DD HH:mm');
    }
    if (action === SYSTEM_ALERT_ACTION.RESOLVE) {
        request.sat_resolved_by = user.id;
        request.sat_resolved_date = moment().format('YYYY-MM-DD HH:mm');
    }

    return request;
};

export const transformUrlToPlatform = url => {
    const platform = getPlatformUrl();
    const altPlatform = IS_PRODUCTION ? trimTrailingSlash(STAGING_URL) : trimTrailingSlash(PRODUCTION_URL);
    return url.startsWith(altPlatform) ? url.replace(altPlatform, platform) : url;
};

export const transformQuickLinkUpdateRequest = data => {
    const keys = ['qlk_id', 'qlk_title', 'qlk_link'];
    const request = filterObjectProps(data, keys);
    request.qlk_link = transformUrlToPlatform(request.qlk_link);
    return request;
};

export const transformQuickLinkReorderRequest = data => {
    const keys = ['qlk_id', 'qlk_order'];
    const request = data.map(row => filterObjectProps(row, keys));
    return request;
};

export const transformExportReportRequest = data => {
    const allowedFilters = ['date_from', 'date_to'];
    const filters = filterObjectProps(data.filters, allowedFilters);

    const request = {
        report_type: data.report.sel_id,
        ...Object.keys(filters).reduce(
            (current, filter) => ({ ...current, ...(!!filters[filter] ? { [filter]: filters[filter] } : {}) }),
            {},
        ),
    };
    return request;
};

export const transformDisplayReportRequest = data => {
    const reportId = REPORT_TYPE?.[data.report?.value] ?? 0;
    if (reportId === 0) return data;

    const request = {
        report_type: reportId,
        ...(!!data.filters?.date_from && data.filters?.record_id === ''
            ? {
                  date_from: moment(data.filters.date_from)
                      .startOf('day')
                      .format(DEFAULT_SERVER_DATE_FORMAT_NO_TIME),
              }
            : {}),
        ...(!!data.filters?.date_to && data.filters?.record_id === ''
            ? {
                  date_to: moment(data.filters.date_to)
                      .endOf('day')
                      .format(DEFAULT_SERVER_DATE_FORMAT_NO_TIME),
              }
            : {}),
        ...(data.report.value === 'systemalertlog' && !!data.filters?.record_id
            ? { record_id: data.filters.record_id }
            : {}),
    };

    return request;
};

export const transformDisplayReportExportData = (columns, data) => {
    const newData = data.map(row => {
        const newRow = {};
        columns.forEach(header => {
            newRow[header.field] = row[header.field];
        });
        return newRow;
    });
    return newData;
};
