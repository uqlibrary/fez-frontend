import { useEffect, useRef } from 'react';

/** *
 * A custom hook to run an effect callback once only on mount (optional) and once again if/when the
 * deps change for the first time. i.e. from undefined => defined
 * @param {function} callback The callback function to execute
 * @param {Array} deps The dependencies to watch for changes
 * @param {boolean} callOnInitialMount Whether to call the callback on initial mount
 * @returns {void}
 */
export const useOnSelectiveMountEffect = (callback, deps, callOnInitialMount = true) => {
    const isMounting = useRef(false);
    const hasRanEffect = useRef(false);

    useEffect(() => {
        isMounting.current = true;
        callOnInitialMount && callback?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isMounting.current && !hasRanEffect.current) {
            hasRanEffect.current = true;
            callback?.();
        } else {
            isMounting.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
