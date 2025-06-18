import { usePrevious } from './usePrevious';
import { renderHook } from '@testing-library/react';

describe('usePrevious hook', () => {
    it('returns undefined on first render', () => {
        const { result } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: 'a' },
        });
        expect(result.current).toBeUndefined();
    });

    it('returns the previous value after an update', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 0 } });
        expect(result.current).toBeUndefined();

        // update value to 1
        rerender({ value: 1 });
        expect(result.current).toBe(0);
    });

    it('tracks multiple updates in sequence', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 10 } });
        expect(result.current).toBeUndefined();

        // 1st update
        rerender({ value: 20 });
        expect(result.current).toBe(10);
        // 2nd update
        rerender({ value: 30 });
        expect(result.current).toBe(20);
        // 3rd update
        rerender({ value: 40 });
        expect(result.current).toBe(30);
    });

    it('does not update previous when the same value is passed', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 'x' } });
        expect(result.current).toBeUndefined();

        // update value to y
        rerender({ value: 'y' });
        expect(result.current).toBe('x');

        // rerender with same value should not change
        rerender({ value: 'y' });
        expect(result.current).toBe('y');
    });
});
