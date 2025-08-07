import { renderHook } from 'test-utils';
import { useOnSelectiveMountEffect } from './useOnSelectiveMountEffect';

const setup = props =>
    renderHook(({ callback, deps, onMount } = props) => useOnSelectiveMountEffect(callback, deps, onMount));

describe('useOnSelectiveMountEffect hook', () => {
    it('should call the callback on initial mount when callOnInitialMount is true', () => {
        const callback = jest.fn();
        setup({ callback, deps: [], onMount: true });
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call the callback on initial mount when callOnInitialMount is false', () => {
        const callback = jest.fn();
        setup({ callback, deps: [], onMount: false });
        expect(callback).not.toHaveBeenCalled();
    });

    it('should call the callback when dependencies change for the first time', () => {
        const callback = jest.fn();
        const { rerender } = setup({ callback, deps: [1], onMount: false });
        expect(callback).not.toHaveBeenCalled();
        rerender({ callback, deps: [2], onMount: false });
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call the callback again if dependencies change after the first time', () => {
        const callback = jest.fn();
        const { rerender } = setup({ callback, deps: [1], onMount: false });

        rerender({ callback, deps: [2], onMount: false });
        expect(callback).toHaveBeenCalledTimes(1);

        rerender({ callback, deps: [3], onMount: false });
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle no dependencies gracefully', () => {
        const callback = jest.fn();
        setup({ callback, deps: undefined, onMount: true });
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
