import React from 'react';
import AdminCard from './AdminCard';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = {
        title: 'card title',
        classes: {
            card: 'testClass',
        },
        ...testProps,
    };
    return rtlRender(<AdminCard {...props} />);
}

describe('Cards component', () => {
    it('renders with title and no help icon', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});

describe('AdminCard component', () => {
    it('should render StyledCard with same props', () => {
        const { container } = rtlRender(<AdminCard />);
        expect(container).toMatchSnapshot();
    });
});
