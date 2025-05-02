import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
    const prev = useRef<T>();

    // sync prev upon value changes
    useEffect(() => {
        if (value === prev.current) return;
        prev.current = value;
    }, [value]);

    return prev.current;
}
