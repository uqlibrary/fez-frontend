import {transformAuthorIdentifier} from './authorIdentifierTransformer';
import {AUTHOR_IDENTIFIER_ORCID} from 'config/general';
import {authorOrcidDetails} from 'mock/data';

describe('authorIdentifierTransformer', () => {
    it('should transform author data for orcid with grants facet', () => {
        const data = transformAuthorIdentifier(AUTHOR_IDENTIFIER_ORCID, 'uqtest1', '0000-1111-2222-3333', authorOrcidDetails);
        expect(data.aut_id).toEqual('uqtest1');
        expect(data.aut_orcid_id).toEqual('0000-1111-2222-3333');
        expect(data.fez_author_identifier_user_grants.aig_name).toEqual(authorOrcidDetails.scope);
        expect(data.fez_author_identifier_user_grants.aig_details).toEqual(authorOrcidDetails.access_token);
        expect(data.fez_author_identifier_user_grants.aig_details_dump).toEqual(JSON.stringify(authorOrcidDetails));
    });

    it('should transform author data for orcid without grants facet', () => {
        const data = transformAuthorIdentifier(AUTHOR_IDENTIFIER_ORCID, 'uqtest1', '0000-1111-2222-3333');
        expect(data.aut_id).toEqual('uqtest1');
        expect(data.aut_orcid_id).toEqual('0000-1111-2222-3333');
        expect(data.fez_author_identifier_user_grants).toBeUndefined();
    });
});
