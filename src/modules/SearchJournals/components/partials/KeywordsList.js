import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const KeywordsList = ({ title, list }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary">
                    {title}
                </Typography>
            </Grid>
            {!!list && list.length > 0 && list}
        </Grid>
    );
};

KeywordsList.propTypes = {
    title: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
};

export default React.memo(KeywordsList);
