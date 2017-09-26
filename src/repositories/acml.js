import {get} from './generic';
import * as routes from './routes';

/**
 * Fetches the access control markup language templates
 * eg. Open Access, Fully Embargoed, etc
 * @returns {Promise}
 */
export function getAcmlQuickTemplates() {
    return get(routes.GET_ACML_QUICK_TEMPLATES_API);
}
