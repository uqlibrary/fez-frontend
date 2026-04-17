import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
    const prev = useRef<T>(undefined);

    // sync prev upon value changes
    useEffect(() => {
        // fix to make it work with strict mode on dev env
        if (value === prev.current) /* istanbul ignore next */ return;
        prev.current = value;
    }, [value]);

    return prev.current;
}
