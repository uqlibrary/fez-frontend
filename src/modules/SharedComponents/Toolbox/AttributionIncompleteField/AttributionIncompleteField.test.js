import React from 'react';
import AttributionIncompleteField from './AttributionIncompleteField';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = {
        input: {
            onChange: jest.fn(),
            value: true,
        },
        ...testProps,
    };

    return rtlRender(<AttributionIncompleteField {...props} />);
}

describe('Component AttributionIncompleteField', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
