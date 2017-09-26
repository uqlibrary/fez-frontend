import {get} from './generic';
import * as routes from './routes';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function getPublicationTypesList() {
    return get(`${routes.GET_PUBLICATION_TYPES_API}`);
}

/**
 * Fetch publication subtypes by given vocab ID
 *
 * @param id
 * @returns {Promise}
 */
export function getPublicationSubtypesList(id) {
    return get(routes.VOCABULARIES_API .replace('[id]', id));
}
