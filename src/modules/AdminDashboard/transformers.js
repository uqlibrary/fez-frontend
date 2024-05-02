import { filterObjectProps } from './utils';

export const transformSystemAlertRequest = (action, row) => {
    const keys = action === 'resolve' ? ['id', 'resolved_date', 'resolved_id'] : ['id', 'assigned_to'];

    const request = filterObjectProps(row, keys);

    return request;
};
