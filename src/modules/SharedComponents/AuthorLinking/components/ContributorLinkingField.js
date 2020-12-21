import React from 'react';
import AuthorLinking from './AuthorLinking';

export default function ContributorLinkingField(fieldProps) {
    return (
        <AuthorLinking
            onChange={fieldProps.input.onChange}
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
