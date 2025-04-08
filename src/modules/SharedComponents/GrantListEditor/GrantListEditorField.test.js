import React from 'react';
import GrantListEditorField from './GrantListEditorField';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<GrantListEditorField {...props} />);
}

describe('GrantListEditorField', () => {
    it('should render default component', () => {
        const { container } = setup({ onChange: jest.fn() });
        expect(container).toMatchSnapshot();
    });
});
