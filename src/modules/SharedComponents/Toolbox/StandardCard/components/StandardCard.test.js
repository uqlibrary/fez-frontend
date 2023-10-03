import React from 'react';
import { render, WithReduxStore } from 'test-utils';

import StandardCard from './StandardCard';

function setup(testProps) {
    const props = {
        title: 'card title',
        classes: {
            card: 'testClass',
        },
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <StandardCard {...props} />
        </WithReduxStore>,
    );
}

describe('StandardCard component', () => {
    it('renders with title and no help icon', () => {
        const { asFragment } = setup({});
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders with no title', () => {
        const { asFragment } = setup({ title: '' });
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders with title and help button', () => {
        const { asFragment } = setup({
            help: {
                title: 'help',
                text: 'help text',
                buttonLabel: 'OK',
            },
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders with custom colours and full height', () => {
        const { asFragment } = setup({
            customBackgroundColor: '#fcc',
            customTitleColor: '#111',
            customTitleBgColor: '#ccc',
            fullHeight: true,
            noPadding: true,
            primaryHeader: true,
            classes: {
                cardHeaderPurple: 'purple',
                cardContentNoPadding: 'no-padding',
                cardHeaderPrimary: '#555',
            },
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders with square top and accent header', () => {
        const { asFragment } = setup({
            squareTop: true,
            accentHeader: true,
            classes: {
                cardHeaderAccent: '#333',
            },
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders with small title and as a subcard', () => {
        const { asFragment } = setup({
            smallTitle: true,
            subCard: true,
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders given ID for standard card', () => {
        const { asFragment } = setup({ standardCardId: 'test-card' });
        expect(asFragment()).toMatchSnapshot();
    });
});
