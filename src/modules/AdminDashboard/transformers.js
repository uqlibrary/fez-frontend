import { filterObjectProps } from './utils';

export const transformSystemAlertRequest = (action, row) => {
    const keys = action === 'resolve' ? ['id', 'resolved_date', 'resolved_id'] : ['id', 'assigned_to'];

    const request = filterObjectProps(row, keys);

    return request;
};

export const transformQuickLinkReorderRequest = data => {
    const keys = ['id', 'order'];
    const request = data.map(row => filterObjectProps(row, keys));
    return request;
};
