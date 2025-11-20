import React from 'react';
import { SelectedSearchTermItem, SelectedSearchTermItemProps } from './SelectedSearchTermItem';
import Typography from '@mui/material/Typography';

interface SelectedSearchTermTypedItemProps extends SelectedSearchTermItemProps {
    type: string;
}

export const SelectedSearchTermTypedItem: React.FC<SelectedSearchTermTypedItemProps> = ({
    type,
    children,
    ...props
}) => (
    <SelectedSearchTermItem {...props}>
        <Typography variant="body2" component="span" color="secondary">
            {`${type}: `}
        </Typography>
        {children}
    </SelectedSearchTermItem>
);
