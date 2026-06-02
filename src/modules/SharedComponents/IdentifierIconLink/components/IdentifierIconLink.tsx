import React from 'react';
import { snakeCase } from 'lodash';
import { getDoiURL, getOrcidURL, getRorURL } from 'helpers/general';

export type types = 'doi' | 'ror' | 'orcid';
export type sizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';

const getHref = (type: types, id: string) => {
    switch (type) {
        case 'doi':
            return getDoiURL(id);
        case 'ror':
            return getRorURL(id);
        case 'orcid':
            return getOrcidURL(id);
        default:
            return '';
    }
};

const IdentifierIconLink: React.FC<{
    id: string | undefined | null;
    type: types;
    iconSize: sizes;
    iconOnly?: boolean;
}> = ({ type, id, iconSize = 'large', iconOnly = false }) => {
    const trimmedId = id?.trim?.();
    if (!trimmedId) return null;

    const href = getHref(type, trimmedId);
    if (!href) return null;

    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            href={href}
            title={`Open in a new tab`}
            aria-label={`Open ${type.toUpperCase()} ${trimmedId} in a new tab`}
            data-testid={`identifier-icon-link-${snakeCase(trimmedId)}`}
        >
            {!iconOnly && trimmedId}
            <span
                className={`fez-icon ${type.toLowerCase()} ${iconSize}`}
                style={{ marginLeft: '0.3em', verticalAlign: 'top' }}
            />
        </a>
    );
};

export default React.memo(IdentifierIconLink);
