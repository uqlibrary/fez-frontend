import React from 'react';
import { rtlRender, fireEvent, waitFor } from 'test-utils';

import TabbedCard from './TabbedCard';

function setup(testProps) {
    const props = {
        cardId: 'test-card0',
        contentRenderer: jest.fn(content => (Array.isArray(content) ? content.map(item => item.content) : content)),
        ...testProps,
    };
    return rtlRender(<TabbedCard {...props} />);
}

describe('TabbedCard Component', () => {
    it('renders default state', () => {
        const { asFragment } = setup();
        expect(asFragment()).toMatchInlineSnapshot('<DocumentFragment />');
    });

    it('renders without common area', () => {
        const { getByTestId } = setup({
            tabs: [{ title: 'Test tab title', content: 'Test tab content' }],
        });
        expect(getByTestId('test-card0-tab0-heading')).toBeInTheDocument();
        expect(getByTestId('test-card0-tab0-heading')).toHaveTextContent('Test tab');
        expect(getByTestId('test-card0-testtabtitle-section-content')).toBeInTheDocument();
        expect(getByTestId('test-card0-testtabtitle-section-content')).toHaveTextContent('Test tab content');
    });

    it('renders tabs as expected', async () => {
        const { getByTestId } = setup({
            common: [{ title: 'Common entry title', content: 'Common entry data' }],
            tabs: [
                { title: 'Test tab 1 title', content: 'Test tab 1 content' },
                { title: 'Test tab 2 title', content: 'Test tab 2 content' },
            ],
        });
        expect(getByTestId('test-card0-tab0-heading')).toBeInTheDocument();
        fireEvent.click(getByTestId('test-card0-tab1-heading'));
        await waitFor(() => getByTestId('test-card0-testtab2title-section'));
        expect(getByTestId('test-card0-testtab2title-section')).toHaveTextContent('Test tab 2 content');
    });
});
