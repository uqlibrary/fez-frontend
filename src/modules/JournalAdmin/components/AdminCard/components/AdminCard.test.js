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
        setup({});
        expect(document.querySelector('.AdminCard')).toHaveTextContent('card title');
    });
});
describe('AdminCard component', () => {
    it('renders with title and no help icon', () => {
        rtlRender(<AdminCard title="another title" />);
        expect(document.querySelector('.AdminCard')).toHaveTextContent('another title');
    });
});
