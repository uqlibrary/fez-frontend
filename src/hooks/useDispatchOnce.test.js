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

    it('does not dispatch if hasBeenDispatched is true initially', () => {
        const { result } = renderHook(
            ({ hasBeenDispatched, getDispatchable }) => useDispatchOnce(hasBeenDispatched, getDispatchable),
            { initialProps: { hasBeenDispatched: true, getDispatchable } },
        );

        act(() => {
            result.current();
        });
        expect(getDispatchable).not.toHaveBeenCalled();
        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('dispatches exactly once when called multiple times if initially not dispatched', () => {
        const { result } = renderHook(
            ({ hasBeenDispatched, getDispatchable }) => useDispatchOnce(hasBeenDispatched, getDispatchable),
            { initialProps: { hasBeenDispatched: false, getDispatchable } },
        );

        act(() => {
            result.current();
            result.current();
            result.current();
        });

        // getDispatchable should be called once to produce the action
        expect(getDispatchable).toHaveBeenCalledTimes(1);
        // dispatch should be called once with that action
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({ type: 'TEST_ACTION' });
    });

    it('respects prop change to true and does not dispatch afterwards', () => {
        const { result, rerender } = renderHook(
            ({ hasBeenDispatched, getDispatchable }) => useDispatchOnce(hasBeenDispatched, getDispatchable),
            { initialProps: { hasBeenDispatched: false, getDispatchable } },
        );

        // simulate external flag flip
        rerender({ hasBeenDispatched: true, getDispatchable });
        act(() => {
            result.current();
        });

        expect(getDispatchable).not.toHaveBeenCalled();
        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('does not dispatch again after an initial dispatch and then prop change', () => {
        const { result, rerender } = renderHook(
            ({ hasBeenDispatched, getDispatchable }) => useDispatchOnce(hasBeenDispatched, getDispatchable),
            { initialProps: { hasBeenDispatched: false, getDispatchable } },
        );

        // first call triggers dispatch
        act(() => result.current());
        expect(dispatchMock).toHaveBeenCalledTimes(1);

        // now simulate prop indicating dispatch has happened elsewhere
        rerender({ hasBeenDispatched: true, getDispatchable });
        // subsequent calls should not dispatch again
        act(() => result.current());
        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
});
