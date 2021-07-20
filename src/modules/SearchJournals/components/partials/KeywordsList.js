import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { HelpIcon } from '../../../SharedComponents/Toolbox/HelpDrawer';

export const KeywordsList = ({ title, list, help }) => {
    return (
        <Grid container>
            <Grid item xs="auto" style={{ margin: '10px 0 10px 0' }}>
                <Typography variant="subtitle1" color="primary" variant="h5">
                    {title}
                </Typography>
            </Grid>
            {!!help && (
                <Grid item xs>
                    <HelpIcon {...help} />
                </Grid>
            )}
            {!!list && list.length > 0 ? (
                list
            ) : (
                <Grid item xs={12}>
                    No matches found.
                </Grid>
            )}
        </Grid>
    );
};

KeywordsList.propTypes = {
    title: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    help: PropTypes.object,
};

export default React.memo(KeywordsList);
