import {get} from './generic';

export const GET_PUBLICATION_TYPES_API = 'records/types';
export const GET_PUBLICATION_SUBTYPES_API = 'vocabularies';

/**
 * Fetches the publication Types
 * @returns {Promise}
 */
export function getPublicationTypesList() {
    return get(`${GET_PUBLICATION_TYPES_API}`);
}

// TODO: load publication sub types will go here too.... vocab with id
export function getPublicationSubtypesList(id) {
    return get(`${GET_PUBLICATION_SUBTYPES_API}/${id}`);
}
