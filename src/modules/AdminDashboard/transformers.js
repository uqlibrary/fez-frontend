import { filterObjectProps } from './utils';

export const transformSystemAlertRequest = (action, row) => {
    const keys =
        action === 'resolve' ? ['sat_id', 'sat_resolved_date', 'sat_resolved_by'] : ['sat_id', 'sat_assigned_to'];

    const request = filterObjectProps(row, keys);

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
