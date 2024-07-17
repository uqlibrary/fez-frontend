import React from 'react';
import PropTypes from 'prop-types';
import { HelpIcon } from '../../HelpDrawer';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export const StandardRighthandCard = ({ children, title, testId, help }) => {
    return (
        <Grid container {...(testId ? { 'data-testid': testId } : {})}>
            <Grid item xs sx={{ minWidth: '1px' }}>
                {title && (
                    <Typography
                        variant={'h6'}
                        component={'div'}
                        color={'primary'}
                        className={'StandardRighthandCard-title'}
                    >
                        {title}
                    </Typography>
                )}
            </Grid>
            {help && help.text && (
                <Grid item sx={{ marginTop: '-8px' }}>
                    <HelpIcon {...help} />
                </Grid>
            )}
            <Grid item xs={12}>
                <Divider sx={{ marginTop: '6px', marginBottom: '12px' }} />
            </Grid>
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
    );
};
StandardRighthandCard.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    testId: PropTypes.string,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string,
    }),
};

export default StandardRighthandCard;
