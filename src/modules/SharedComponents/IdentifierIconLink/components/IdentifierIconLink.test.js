import React from 'react';
import { render } from 'test-utils';

import IdentifierIconLink from './IdentifierIconLink';

function setup(props = {}) {
    return render(<IdentifierIconLink {...props} />);
}

describe('IdentifierIconLink test', () => {
    it('should render DOI link correctly', () => {
        const { getByTestId } = setup({
            id: '10.1234/test',
            type: 'doi',
        });

        const link = getByTestId('identifier-icon-link-10_1234_test');

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://doi.org/10.1234/test');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('aria-label', 'Open DOI 10.1234/test in a new tab');
        expect(link).toHaveTextContent('10.1234/test');

        const icon = link.querySelector('.fez-icon.doi.large');
        expect(icon).toBeInTheDocument();
    });

    it('should render ORCID link correctly', () => {
        const { getByTestId } = setup({
            id: '0000-0002-1825-0097',
            type: 'orcid',
            iconSize: 'medium',
        });

        const link = getByTestId('identifier-icon-link-0000_0002_1825_0097');

        expect(link).toHaveAttribute('href', 'https://orcid.org/0000-0002-1825-0097');

        const icon = link.querySelector('.fez-icon.orcid.medium');
        expect(icon).toBeInTheDocument();
    });

    it('should render ROR link correctly', () => {
        const { getByTestId } = setup({
            id: '00rqy9422',
            type: 'ror',
            iconSize: 'small',
        });

        const link = getByTestId('identifier-icon-link-00_rqy_9422');

        expect(link).toHaveAttribute('href', 'https://ror.org/00rqy9422');

        const icon = link.querySelector('.fez-icon.ror.small');
        expect(icon).toBeInTheDocument();
    });

    it('should not render text when iconOnly is true', () => {
        const { getByTestId } = setup({
            id: '10.1234/test',
            type: 'doi',
            iconOnly: true,
        });

        const link = getByTestId('identifier-icon-link-10_1234_test');

        expect(link).toBeInTheDocument();
        expect(link).not.toHaveTextContent('10.1234/test');
    });

    it('should return null when id is empty', () => {
        const { container } = setup({
            id: '',
        });

        expect(container.firstChild).toBeNull();
    });

    it('should trim id before rendering', () => {
        const { getByTestId } = setup({
            id: '10.1234/test',
            type: 'doi',
        });

        const link = getByTestId('identifier-icon-link-10_1234_test');

        expect(link).toHaveAttribute('href', 'https://doi.org/10.1234/test');
        expect(link).toHaveTextContent('10.1234/test');
    });

    it('should ignore unsupported type', () => {
        const { queryByTestId } = setup({
            id: '10.1234/test',
            type: 'unknown',
        });

        expect(queryByTestId('identifier-icon-link-10_1234_test')).not.toBeInTheDocument();
    });
});
