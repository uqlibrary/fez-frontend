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

    it('should render sx props object', () => {
        const { getByTestId } = render(
            <SectionTitle data-testid="test-section" sx={{ bgcolor: 'red' }}>
                <span data-testid="test-child">Test content</span>
            </SectionTitle>,
        );
        const parent = getByTestId('test-section');
        expect(parent).toBeInTheDocument();
        expect(parent).toHaveStyle('background-color: red');
        expect(parent).toHaveStyle('font-weight: 400');
    });

    it('should render sx props object overriding default font weight', () => {
        const { getByTestId } = render(
            <SectionTitle data-testid="test-section" sx={{ fontWeight: 700 }}>
                <span data-testid="test-child">Test content</span>
            </SectionTitle>,
        );
        const parent = getByTestId('test-section');
        expect(parent).toBeInTheDocument();
        expect(parent).toHaveStyle('font-weight: 700');
    });
});
