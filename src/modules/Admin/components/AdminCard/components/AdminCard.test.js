import React from 'react';
import { AdminCard, Cards } from './AdminCard';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = {
        title: 'card title',
        classes: {
            card: 'testClass',
        },
        ...testProps,
    };
    return rtlRender(<Cards {...props} />);
}

describe('Cards component', () => {
    it('renders with title and no help icon', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('renders with title and help button', () => {
        const { container } = setup({
            help: {
                title: 'help',
                text: 'help text',
                buttonLabel: 'OK',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders with custom colours and full height', () => {
        const { container } = setup({
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
        expect(container).toMatchSnapshot();
    });

    it('renders with square top and accent header', () => {
        const { container } = setup({
            squareTop: true,
            accentHeader: true,
            classes: {
                cardHeaderAccent: '#333',
            },
        });

        expect(container).toMatchSnapshot();
    });
});

describe('AdminCard component', () => {
    it('should render StyledCard with same props', () => {
        const { container } = rtlRender(<AdminCard />);
        expect(container).toMatchSnapshot();
    });
});
