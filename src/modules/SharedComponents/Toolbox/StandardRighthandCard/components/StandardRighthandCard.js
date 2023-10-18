import React from 'react';
import PropTypes from 'prop-types';
import { HelpIcon } from '../../HelpDrawer';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export class StandardRighthandCard extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        title: PropTypes.string,
        testId: PropTypes.string,
        help: PropTypes.shape({
            title: PropTypes.string,
            text: PropTypes.any,
            buttonLabel: PropTypes.string,
        }),
    };

    render() {
        const { title, children, help, testId } = this.props;
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
    }
}

export default StandardRighthandCard;
