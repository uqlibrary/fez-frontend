import React from 'react';
import ContributorsEditorField from './ContributorsEditorField';
import { render, WithRouter, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
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
        const { container } = setup({ input: { onChange: jest.fn() } });
        expect(container).toMatchSnapshot();
    });
});
