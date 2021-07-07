import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        textTransform: 'uppercase',
        color: 'white',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    asic: {
        backgroundColor: theme.palette.error.main,
    },
    abdc: {
        backgroundColor: theme.palette.accent.main,
    },
    era: {
        backgroundColor: theme.palette.success.main,
    },
    wos: {
        backgroundColor: theme.palette.primary.main,
    },
    ssci: {
        backgroundColor: theme.palette.primary.dark,
    },
    scie: {
        backgroundColor: theme.palette.primary.dark,
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
