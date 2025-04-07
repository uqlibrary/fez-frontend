import React from 'react';
import OverrideSecurity, { overrideSecurityValueNormaliser } from './OverrideSecurity';
import { rtlRender, userEvent } from 'test-utils';

const setup = (testProps, renderer = rtlRender) => {
    const props = {
        label: 'test',
        overrideSecurityId: 'test',
        input: {
            onChange: jest.fn(),
        },
        ...testProps,
    };
    return renderer(<OverrideSecurity {...props} />);
};

describe('OverrideSecurity component', () => {
    it('should render properly', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
    it('should send correct value in onChange', async () => {
        const testFn = jest.fn();
        const { getByTestId, rerender } = setup({ input: { onChange: testFn } });
        await userEvent.click(getByTestId('test-input'));
        expect(testFn).toHaveBeenCalledWith(0); // checked

        // rerender to checked state
        setup({ input: { onChange: testFn, value: true } }, rerender);
        await userEvent.click(getByTestId('test-input'));
        expect(testFn).toHaveBeenLastCalledWith(1); // unchecked
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
