import { ACTION } from '../ControlledVocabularyContext';

export const validRequestProps = [
    'cvo_id',
    'cvo_title',
    'cvo_desc',
    'cvo_external_id',
    'cvo_image_filename',
    'cvo_lat',
    'cvo_long',
    'cvo_order',
    'cvo_policy',
    'cvo_created_at',
    'cvo_updated_at',
    'cvo_hide',
];
export const transformAdminRequest = ({ request, parentId, action }) => {
    const data = structuredClone(request);
    Object.keys(data).forEach(key => {
        !validRequestProps.includes(key) && delete data[key];
    });
    if (!!parentId && action === ACTION.ADD) {
        data.cvr_parent_cvo_id = parentId;
    }
    if (data.hasOwnProperty('cvo_hide')) {
        data.cvo_hide = !!data.cvo_hide ? 1 : 0;
    }
    if (data.hasOwnProperty('cvo_order')) {
        if (typeof data.cvo_order === 'string' && data.cvo_order !== '') {
            data.cvo_order = Number(data.cvo_order); // validation should ensure this is a valid number
        } else if (data.hasOwnProperty('cvo_order') && data.cvo_order === '') {
            data.cvo_order = null;
        }
    }

    return data;
};

/**
 * Find the end index of the pagination
 *
 * @param {integer} start the start record index of the page (the first is 1)
 * @param {integer} perPage the maximum number of records per page
 * @param {integer} total the total records
 * @param {integer} currentPage the current page, the first page is 0
 *
 * @returns {integer} the end index (the first is 1)
 */
export const calculateEnd = (start, perPage, total, currentPage) =>
    start + Math.min(perPage, total - perPage * currentPage);
