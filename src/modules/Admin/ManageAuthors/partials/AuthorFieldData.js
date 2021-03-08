import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    cellEditable: {
        borderBottom: '1px dashed grey',
    },
    fieldTitle: {
        fontSize: 10,
    },
}));

export const AuthorFieldData = ({ authorFieldDataId, data, title }) => {
    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography
                    className={classes.cellEditable}
                    variant="body2"
                    {...(!!authorFieldDataId
                        ? {
                              'data-testid': authorFieldDataId,
                              id: authorFieldDataId,
                          }
                        : {})}
                >
                    {data || '-'}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="caption" color="secondary" className={classes.fieldTitle}>
                    {title}
                </Typography>
            </Grid>
        </Grid>
    );
};

AuthorFieldData.propTypes = {
    authorFieldDataId: PropTypes.string,
    data: PropTypes.string,
    title: PropTypes.string,
};

export default React.memo(AuthorFieldData);
