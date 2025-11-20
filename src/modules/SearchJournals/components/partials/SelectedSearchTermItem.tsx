import React from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';

export type SelectedSearchTermItemProps = Omit<ChipProps, 'children'> & React.PropsWithChildren;

export const SelectedSearchTermItem: React.FC<SelectedSearchTermItemProps> = ({ children, ...props }) => {
    return (
        <Chip
            sx={theme => ({
                margin: 1,
                [theme.breakpoints.down('sm')]: {
                    maxWidth: '100%',
                    margin: '8px 0',
                },
            })}
            tabIndex={0}
            {...props}
            label={children}
        />
    );
};

export default React.memo(SelectedSearchTermItem);
