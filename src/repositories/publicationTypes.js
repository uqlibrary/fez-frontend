import {get} from './generic';

export const GET_PUBLICATION_TYPES_API = 'records/types';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function getPublicationTypesList() {
    return get(`${GET_PUBLICATION_TYPES_API}`);
}

// TODO: load publication sub types will go here too.... vocab with id
