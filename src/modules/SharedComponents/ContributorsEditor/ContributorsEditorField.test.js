import React from 'react';
import ContributorsEditorField from './ContributorsEditorField';
import { render, WithRouter, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        contributorEditorId: 'test',
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <ContributorsEditorField {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('ContributorsEditorField', () => {
    it('should render default component', () => {
        const { container } = setup({ onChange: jest.fn() });
        expect(container).toMatchSnapshot();
    });
});
