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
        [theme.breakpoints.down('xs')]: {
            flexShrink: 1,
            flexGrow: 0,
        },
    },
}));

export const KeywordsList = ({ title, list, help }) => {
    const classes = useStyles();

    const txt = locale.components.searchJournals;
    const componentId = sanitiseId(`journal-search-keyword-list-${title}`);

    const isBreakpointXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const typographyProps = {
        color: 'primary',
        component: 'h3',
        variant: isBreakpointXs ? 'h6' : 'h5',
    };
    const helpGridProps = {
        xs: isBreakpointXs ? 'true' : 'auto',
    };

    return (
        <Grid container id={componentId} data-testid={componentId} className={classes.root}>
            <Grid item style={{ margin: '10px 0 10px 0' }} {...helpGridProps}>
                <Typography {...typographyProps}>{title}</Typography>
            </Grid>
            {!!help && (
                <Grid item xs className={classes.helpGrid}>
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
