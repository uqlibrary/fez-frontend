import React, { useEffect, useRef, useState } from 'react';
import BaseListItemText from '@mui/material/ListItemText';

const ListItemText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const [overflowing, setOverflowing] = useState(false);

    useEffect(() => {
        if (typeof children !== 'string') return;

        const el = textRef.current;
        /* istanbul ignore else */
        if (el) setOverflowing(el.scrollWidth > el.clientWidth);
    }, [children]);

    return (
        <BaseListItemText
            title={overflowing && typeof children === 'string' ? children : undefined}
            slotProps={{ primary: { noWrap: true, ref: textRef } }}
        >
            {children}
        </BaseListItemText>
    );
};

export default React.memo(ListItemText);
