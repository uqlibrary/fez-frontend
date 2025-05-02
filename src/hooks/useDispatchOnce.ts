import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import { AnyAction } from 'redux';

export const useDispatchOnce = (hasBeenDispatched: boolean, getDispatchable: () => unknown) => {
    const dispatch = useDispatch();
    const hasBeenDispatchedRef = useRef(hasBeenDispatched);

    // handles keeping hasBeenDispatchedRef in sync
    useEffect(() => {
        if (hasBeenDispatched) {
            hasBeenDispatchedRef.current = true;
        }
    }, [hasBeenDispatched]);

    return useCallback(() => {
        if (hasBeenDispatchedRef.current) return;

        hasBeenDispatchedRef.current = true;
        dispatch(getDispatchable() as AnyAction);
    }, [dispatch, getDispatchable]);
};
