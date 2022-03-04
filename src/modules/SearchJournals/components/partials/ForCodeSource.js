import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import { sanitiseId } from 'helpers/general';

const useStyles = makeStyles(theme => ({
    root: {
        textTransform: 'uppercase',
        padding: 3,
        fontSize: 10,
    },
    asic: {
        backgroundColor: theme.palette.error?.main,
        color: theme.palette.white?.main,
    },
    abdc: {
        backgroundColor: theme.palette.accent?.main,
        color: theme.palette.white?.main,
    },
    era: {
        backgroundColor: theme.palette.success?.main,
        color: theme.palette.white?.main,
    },
    wosssci: {
        backgroundColor: theme.palette.primary?.dark,
        color: theme.palette.white?.main,
    },
    wosscie: {
        backgroundColor: theme.palette.primary?.dark,
        color: theme.palette.white?.main,
    },
    wosesci: {
        backgroundColor: theme.palette.primary?.dark,
        color: theme.palette.white?.main,
    },
    citescore: {
        backgroundColor: theme.palette.accent?.main,
        color: theme.palette.white?.main,
    },
}));

export const ForCodeSource = ({ source, index }) => {
    const classes = useStyles();
    const id = sanitiseId(`journal-search-item-subject-source-${source}-${index}`);
    return (
        <Typography
            variant="caption"
            component="span"
            classes={{ root: classes.root }}
            className={classes[source]}
            id={id}
            data-testid={id}
        >
            {source}
        </Typography>
    );
};

ForCodeSource.propTypes = {
    source: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(ForCodeSource);
