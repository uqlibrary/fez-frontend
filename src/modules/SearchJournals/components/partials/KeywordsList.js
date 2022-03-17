import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import locale from 'locale/components';
import { sanitiseId } from 'helpers/general';
import { useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.down('xs')]: {
            flexGrow: 1,
        },
    },
    helpGrid: {
        [theme.breakpoints.down('sm')]: {
            flexShrink: 1,
            flexGrow: 0,
        },
    },
}));

export const KeywordsList = ({ title, list, help }) => {
    const classes = useStyles();

    const txt = locale.components.searchJournals;
    const componentId = sanitiseId(`journal-search-keyword-list-${title}`);

    // const isBreakpointXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const isBreakpointSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const typographyProps = {
        color: 'primary',
        component: 'h3',
        variant: isBreakpointSm ? 'h6' : 'h5',
    };

    return (
        <Grid container id={componentId} data-testid={componentId} className={classes.root}>
            <Grid item xs={!!help ? 11 : 12} style={{ margin: '10px 0 10px 0' }}>
                <Typography {...typographyProps}>{title}</Typography>
            </Grid>
            {!!help && (
                <Grid item xs={1} className={classes.helpGrid}>
                    <HelpIcon {...help} />
                </Grid>
            )}
            {!!list && list.length > 0 ? (
                list
            ) : (
                <Grid item xs={12} id={`${componentId}-no-matches`} data-testid={`${componentId}-no-matches`}>
                    <Typography color="secondary">{txt.partials.keywordsList.noResultsFound}</Typography>
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
