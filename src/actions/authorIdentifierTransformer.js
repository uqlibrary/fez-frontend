import {AUTHOR_IDENTIFIER_ORCID, authorIdentifierKeys} from 'config/general';

export const transformAuthorIdentifier = (type, userId, identifierId, data = null) => {
    const patchData = {
        aut_id: userId,
        [authorIdentifierKeys[type]]: identifierId
    };

    if (type === AUTHOR_IDENTIFIER_ORCID && data) {
        patchData.fez_author_identifier_user_grants = {
            aig_name: data.scope,
            aig_expires: data.expires_in,
            aig_details: data.access_token,
            aig_details_dump: JSON.stringify(data),
        };
    }

    return patchData;
};
