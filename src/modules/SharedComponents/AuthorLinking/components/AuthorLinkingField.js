import React from 'react';
import AuthorLinking from './AuthorLinking';

export default function AuthorLinkingField(fieldProps) {
    return (
        <AuthorLinking
            onChange={fieldProps.input.onChange}
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
