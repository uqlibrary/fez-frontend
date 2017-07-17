import {get} from './generic';

export const GET_ACML_QUICK_TEMPLATES_API = 'acml/quick-templates';

/**
 * Fetches the access control markup language templates
 * eg. Open Access, Fully Embargoed, etc
 * @returns {Promise}
 */
export function getAcmlQuickTemplates() {
    return get(GET_ACML_QUICK_TEMPLATES_API);
}
