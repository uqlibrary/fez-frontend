import React from 'react';
import Page from './StandardPage';
import { render, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = { ...testProps, classes: {} };
    return render(
        <WithReduxStore>
            <Page {...props} />
        </WithReduxStore>,
    );
}

describe('Snapshot tests for StandardPage component', () => {
    it('renders StandardPage with title', () => {
        const { container } = setup({ title: 'standard page title' });
        expect(container).toMatchSnapshot();
    });

    it('renders StandardPage without a title', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders StandardPage with help', () => {
        const { container } = setup({
            title: 'Test',
            children: 'Test',
            help: { title: 'Test', text: 'Test', buttonLabel: 'Test' },
        });
        expect(container).toMatchSnapshot();
    });
});
