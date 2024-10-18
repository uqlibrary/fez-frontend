import React from 'react';

import { render, within } from 'test-utils';
import SectionTitle from './SectionTitle';

describe('SectionTitle', () => {
    it('should render', () => {
        const { getByTestId } = render(
            <SectionTitle data-testid="test-section">
                <span data-testid="test-child">Test content</span>
            </SectionTitle>,
        );
        const parent = getByTestId('test-section');
        expect(parent).toBeInTheDocument();
        expect(within(parent).getByTestId('test-child')).toHaveTextContent('Test content');
    });
});
