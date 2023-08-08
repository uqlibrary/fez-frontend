import React from 'react';
import ContributorsEditorField from './ContributorsEditorField';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<ContributorsEditorField {...props} />);
}

describe('ContributorsEditorField', () => {
    it('should render default component', () => {
        const { container } = setup({ input: { onChange: jest.fn() } });
        expect(container).toMatchSnapshot();
    });
});
