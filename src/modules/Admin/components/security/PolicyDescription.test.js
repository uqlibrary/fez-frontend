import React from 'react';
import { PolicyDescription } from './PolicyDescription';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };
    return rtlRender(<PolicyDescription {...props} />);
}
describe('PolicyDescription helper', () => {
    it('should render properly', () => {
        const { container } = setup({
            selectedPolicyKey: 1,
        });
        expect(container.innerHTML).toEqual('Administrators (1)');
    });

    it('should return empty string when policy key selection is missing', () => {
        const { container } = setup();
        expect(container.innerHTML).toBe('');
    });

    it('should render properly when a custom policy array is provided', () => {
        const { container } = setup({
            selectedPolicyKey: 2,
            policyArray: [
                { id: 1, value: 1, name: 'name 1' },
                { id: 2, value: 2, name: 'name 2' },
                { id: 3, value: 3, name: 'name 3' },
            ],
        });
        expect(container.innerHTML).toEqual('name 2 (2)');
    });
});
