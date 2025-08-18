import React from 'react';
import { rtlRender } from 'test-utils';
import { Section, GroupsWithinCard, GroupsWithoutCard } from './Section';

const setup = (testProps = {}, renderer = rtlRender) => {
    const props = {
        ...testProps,
    };

    return renderer(<Section {...props} />);
};

describe('Section component', () => {
    it('should render default view with card', () => {
        setup({
            disabled: false,
            cards: [{ title: 'Title', groups: [[]] }],
        });
        expect(document.querySelector('.AdminCard')).toHaveTextContent('Title');
    });
    it('should render default view without card', () => {
        setup({
            disabled: false,
            cards: [{ groups: [[]] }],
        });
        expect(document.querySelector('.AdminCard')).not.toBeInTheDocument();
    });
});

describe('GroupsWithinCard component', () => {
    it('should render default view', () => {
        const props = {
            title: 'Title',
            groups: [['test']],
        };
        rtlRender(<GroupsWithinCard {...props} />);

        expect(document.querySelector('.AdminCard')).toHaveTextContent('Title');
    });
});

describe('GroupsWithoutCard component', () => {
    it('should render default view', () => {
        const props = {
            groups: [['test']],
        };

        rtlRender(<GroupsWithoutCard {...props} />);
        expect(document.querySelector('.AdminCard')).not.toBeInTheDocument();
    });
});
