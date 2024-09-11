import moment from 'moment';

import { SYSTEM_ALERT_ACTION, REPORT_TYPE } from './config';
import { filterObjectProps, getPlatformUrl } from './utils';

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
    if (url.includes(platform)) return url;

    if (IS_PRODUCTION) return url.replace(STAGING_URL, PRODUCTION_URL);
    else return url.replace(PRODUCTION_URL, STAGING_URL);
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
        ...filters,
        ...(!!filters.from_date ? { date_from: `${moment(filters.from_date).format('YYYY-MM-DD')} 00:00:00` } : {}),
        ...(!!filters.date_to ? { date_to: `${moment(filters.date_to).format('YYYY-MM-DD')} 23:59:59` } : {}),
    };
    return request;
};

export const transformDisplayReportRequest = data => {
    const reportId = REPORT_TYPE?.[data.report?.value] ?? 0;
    if (reportId === 0) return data;

    const request = {
        report_type: reportId,
        ...(!!data.filters.from_date && data.filters.systemAlertId === ''
            ? { date_from: moment(data.filters.from_date).format('YYYY-MM-DD') }
            : {}),
        ...(!!data.filters.date_to && data.filters.systemAlertId === ''
            ? { date_to: moment(data.filters.date_to).format('YYYY-MM-DD') }
            : {}),
        ...(data.report.value === 'systemalertlog' && !!data.filters.systemAlertId
            ? { record_id: data.filters.systemAlertId }
            : {}),
    };
    return request;
};
