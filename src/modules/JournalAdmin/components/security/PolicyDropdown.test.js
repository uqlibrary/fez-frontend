import React from 'react';
import { PolicyDropdown } from './PolicyDropdown';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        fieldName: 'test',
        policyDropdownId: 'test-policy',
        ...testProps,
    };
    return rtlRender(<PolicyDropdown {...props} />);
}

describe('PolicyDropdown component', () => {
    it('should render properly', () => {
        const { container } = setup({
            displayPrompt: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should hide policies that the user cant select', () => {
        const { container } = setup({
            inheritedSecurity: 2,
        });
        expect(container).toMatchSnapshot();
    });
});
