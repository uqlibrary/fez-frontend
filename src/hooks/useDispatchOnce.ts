import { useDispatch } from 'react-redux';
import { useCallback, useRef } from 'react';
import { AnyAction } from 'redux';

export const useDispatchOnce = (hasBeenDispatched: boolean, getDispatchable: () => unknown) => {
    const dispatch = useDispatch();
    const dispatchedRef = useRef(hasBeenDispatched);

    dispatchedRef.current ||= hasBeenDispatched;

    return useCallback(() => {
        if (dispatchedRef.current) {
            return Promise.resolve();
        }

        dispatchedRef.current = true;
        return dispatch(getDispatchable() as AnyAction);
    }, [dispatch, getDispatchable]);
};
