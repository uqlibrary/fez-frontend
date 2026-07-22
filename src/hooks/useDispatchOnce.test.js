import { act, renderHook } from '@testing-library/react';
import { useDispatchOnce } from './useDispatchOnce';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));

describe('useDispatchOnce hook', () => {
    let dispatchMock;
    let getDispatchable;

    beforeEach(() => {
        dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        getDispatchable = jest.fn(() => ({ type: 'TEST_ACTION' }));
        jest.clearAllMocks();
    });

    it('should not dispatch when initially marked as dispatched', () => {
        const { result } = renderHook(() => useDispatchOnce(true, getDispatchable));

        act(() => {
            result.current();
        });
        expect(getDispatchable).not.toHaveBeenCalled();
        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('should dispatch only once', () => {
        const dispatchResult = Promise.resolve({ success: true });
        dispatchMock.mockReturnValue(dispatchResult);

        const { result } = renderHook(() => useDispatchOnce(false, getDispatchable));

        let returned;

        act(() => {
            returned = result.current();
            result.current();
            result.current();
        });

        expect(getDispatchable).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({ type: 'TEST_ACTION' });
        expect(returned).toBe(dispatchResult);
    });

    it('should honour a rerender with hasBeenDispatched=true', () => {
        const { result, rerender } = renderHook(
            ({ hasBeenDispatched }) => useDispatchOnce(hasBeenDispatched, getDispatchable),
            { initialProps: { hasBeenDispatched: false } },
        );

        rerender({ hasBeenDispatched: true });
        act(() => {
            result.current();
        });

        expect(getDispatchable).not.toHaveBeenCalled();
        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('should not dispatch again after rerendering with hasBeenDispatched=true', () => {
        const { result, rerender } = renderHook(
            ({ hasBeenDispatched }) => useDispatchOnce(hasBeenDispatched, getDispatchable),
            { initialProps: { hasBeenDispatched: false } },
        );

        act(() => {
            result.current();
        });
        expect(dispatchMock).toHaveBeenCalledTimes(1);

        rerender({ hasBeenDispatched: true });
        act(() => {
            result.current();
        });

        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

    it('should dispatch if rerendered with hasBeenDispatched=false', () => {
        const { result, rerender } = renderHook(
            ({ hasBeenDispatched }) => useDispatchOnce(hasBeenDispatched, getDispatchable),
            { initialProps: { hasBeenDispatched: false } },
        );

        rerender({ hasBeenDispatched: false });
        act(() => {
            result.current();
        });

        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
});
