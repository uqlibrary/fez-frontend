import React from 'react';
import RelatedServiceListEditorField from './RelatedServiceListEditorField';
import { render, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <RelatedServiceListEditorField {...props} />
        </WithReduxStore>,
    );
}

describe('RelatedServiceListEditorField', () => {
    it('should render default component', () => {
        const { container } = setup({ input: { onChange: jest.fn() } });
        expect(container).toMatchSnapshot();
    });
});
