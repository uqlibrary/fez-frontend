import React from 'react';
import AuthorLinking from './AuthorLinking';

export function AuthorLinkingField(fieldProps) {
    return (
        <AuthorLinking
            searchKey={{
                value: 'rek_author_id',
                order: 'rek_author_id_order',
                type: 'author',
            }}
            authorLinkingId="rek-author-id"
            {...fieldProps}
        />
    );
}
export default React.memo(AuthorLinkingField);
