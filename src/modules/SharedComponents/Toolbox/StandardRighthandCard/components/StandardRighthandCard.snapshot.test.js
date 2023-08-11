import React from 'react';
import { StandardRighthandCard } from './StandardRighthandCard';
import { render, WithReduxStore } from 'test-utils';

function setup(testProps) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <StandardRighthandCard {...props} />
        </WithReduxStore>,
    );
}

describe('Snapshot tests for StandardRighthandCard component', () => {
    it('renders with title and no help icon', () => {
        const { container } = setup({ title: 'card title' });
        expect(container).toMatchSnapshot();
    });

    it('renders with title and help button', () => {
        const { container } = setup({
            title: 'Title',
            help: {
                title: 'Help text',
                text: 'Some help text',
                buttonLabel: 'OK',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('renders with title and help button and some content', () => {
        const { container } = setup({
            title: 'Title',
            help: {
                title: 'Help text',
                text: 'Some help text',
                buttonLabel: 'OK',
            },
            children: 'Some content',
        });
        expect(container).toMatchSnapshot();
    });

    it('renders with title, help button, testid and some content', () => {
        const { container } = setup({
            title: 'Title',
            testId: 'testid',
            help: {
                title: 'Help text',
                text: 'Some help text',
                buttonLabel: 'OK',
            },
            children: 'Some content',
        });
        expect(container).toMatchSnapshot();
    });
});
