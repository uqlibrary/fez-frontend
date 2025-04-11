import React from 'react';
import AuthorLinking from './AuthorLinking';

export function ContributorLinkingField(fieldProps) {
    return (
        <AuthorLinking
            searchKey={{
                value: 'rek_contributor_id',
                order: 'rek_contributor_id_order',
                type: 'contributor',
            }}
            authorLinkingId="rek-contributor-id"
            {...fieldProps}
        />
    );
}

export default React.memo(ContributorLinkingField);
