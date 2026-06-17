import React from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export type SelectedSearchCriteriaItemProps = Omit<ChipProps, 'children'> &
    React.PropsWithChildren & {
        type: string;
    };

export const SelectedSearchCriteriaItem: React.FC<SelectedSearchCriteriaItemProps> = ({ type, children, ...props }) => {
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
            label={
                <>
                    <Typography variant="body2" component="span" color="secondary">
                        {`${type}: `}
                    </Typography>
                    {children}
                </>
            }
        />
    );
};

export default React.memo(SelectedSearchCriteriaItem);
