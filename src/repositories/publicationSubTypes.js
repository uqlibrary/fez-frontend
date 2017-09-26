import {get} from './generic';
import * as routes from './routes';

/**
 * Fetches the publication sub types
 * @returns {Promise}
 */
export function loadPublicationSubTypeData(id) {
    return get(`${routes.GET_VOCABULARIES_API}/${id}`);
}
