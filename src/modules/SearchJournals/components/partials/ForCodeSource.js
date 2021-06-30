import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        textTransform: 'uppercase',
    },
    asic: {
        color: theme.palette.error.main,
    },
    abdc: {
        color: theme.palette.accent.main,
    },
    era: {
        color: theme.palette.success.main,
    },
    wos: {
        color: theme.palette.primary.main,
    },
    ssci: {
        color: theme.palette.primary.dark,
    },
    scie: {
        color: theme.palette.primary.dark,
    },
}));

export const ForCodeSource = ({ source }) => {
    const classes = useStyles();
    return (
        <Typography variant="caption" component="span" classes={{ root: classes.root }} className={classes[source]}>
            {source}
        </Typography>
    );
};

ForCodeSource.propTypes = {
    source: PropTypes.string.isRequired,
};

export default React.memo(ForCodeSource);
