import moment from 'moment';

import { SYSTEM_ALERT_ACTION, REPORT_TYPE } from './config';
import { filterObjectProps } from './utils';

export const transformSystemAlertRequest = ({ user, action, row }) => {
    const keys =
        action === SYSTEM_ALERT_ACTION.RESOLVE
            ? ['sat_id', 'sat_resolved_date', 'sat_resolved_by']
            : ['sat_id', 'sat_assigned_to', 'sat_assigned_date'];

    const request = filterObjectProps(row, keys);
    if (action === SYSTEM_ALERT_ACTION.ASSIGN) {
        if (request.sat_assigned_to === 0) request.sat_assigned_to = null;
        request.sat_assigned_date = moment().format('YYYY-MM-DD HH:mm');
    }
    if (action === SYSTEM_ALERT_ACTION.RESOLVE) {
        request.sat_resolved_by = user.id;
        request.sat_resolved_date = moment().format('YYYY-MM-DD HH:mm');
    }

    return request;
};

export const transformQuickLinkUpdateRequest = data => {
    const keys = ['qlk_id', 'qlk_title', 'qlk_link'];
    const request = filterObjectProps(data, keys);
    return request;
};

export const transformQuickLinkReorderRequest = data => {
    const keys = ['qlk_id', 'qlk_order'];
    const request = data.map(row => filterObjectProps(row, keys));
    return request;
};

export const transformReportRequest = data => {
    const reportId = REPORT_TYPE?.[data.displayReport.value] ?? 0;
    if (reportId === 0) return data;

    const request = {
        report_type: reportId,
        ...(!!data.fromDate ? { date_from: moment(data.fromDate).format('YYYY-MM-DD') } : {}),
        ...(!!data.toDate ? { date_to: moment(data.toDate).format('YYYY-MM-DD') } : {}),
        ...(data.displayReport.value === 'systemalertlog' && !!data.systemAlertId
            ? { record_id: data.systemAlertId }
            : {}),
    };
    return request;
};
