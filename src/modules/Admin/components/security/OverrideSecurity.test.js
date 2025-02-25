import React from 'react';
import OverrideSecurity, { overrideSecurityValueNormaliser } from './OverrideSecurity';
import { rtlRender } from 'test-utils';

const setup = testProps => {
    const props = {
        label: 'test',
        overrideSecurityId: 'test',
        input: {
            onChange: jest.fn(),
        },
        ...testProps,
    };
    return rtlRender(<OverrideSecurity {...props} />);
};

describe('OverrideSecurity component', () => {
    it('should render properly', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});

describe('overrideSecurityValueNormaliser', () => {
    it('should return 1 or 0', () => {
        expect(overrideSecurityValueNormaliser(true)).toBe(0);
        expect(overrideSecurityValueNormaliser(0)).toBe(0);
        expect(overrideSecurityValueNormaliser(false)).toBe(1);
        expect(overrideSecurityValueNormaliser(1)).toBe(1);
        expect(overrideSecurityValueNormaliser('')).toBe(1);
    });
});
