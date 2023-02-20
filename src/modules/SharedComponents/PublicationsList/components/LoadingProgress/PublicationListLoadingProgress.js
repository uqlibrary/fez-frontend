import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import locale from 'locale/pages';
import withStyles from '@mui/styles/withStyles';

const styles = theme => ({
    copy: {
        fontSize: theme.typography.caption.fontSize,
    },
});

export class PublicationListLoadingProgressClass extends PureComponent {
    static propTypes = {
        loadingPublicationSources: PropTypes.object.isRequired,
        classes: PropTypes.object,
    };

    render() {
        const txt = locale.pages.addRecord.step2.searchResults.searchDashboard;
        const { loadingPublicationSources, classes } = this.props;

        return (
            <React.Fragment>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {txt.repositories.map((item, index) => (
                        <Grid container spacing={1} key={index}>
                            <Grid item xs>
                                <Typography variant={'body1'} className={classes.copy}>
                                    {item.title}
                                </Typography>
                            </Grid>
                            {loadingPublicationSources && loadingPublicationSources[item.id] ? (
                                <Grid item>
                                    <Typography className={classes.copy} noWrap>
                                        {loadingPublicationSources[`${item.id}Count`]} {txt.recordSuffix}
                                    </Typography>
                                </Grid>
                            ) : (
                                <Grid item>
                                    <CircularProgress
                                        size={12}
                                        thickness={4}
                                        variant={'indeterminate'}
                                        aria-label={`${item.title} ${txt.ariaCircularProgressLabelSuffix}`}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    ))}
                </Box>
                <LinearProgress
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                    variant="determinate"
                    value={
                        (loadingPublicationSources.totalSearchedCount / loadingPublicationSources.totalSourcesCount) *
                        100
                    }
                    aria-valuenow={
                        (loadingPublicationSources.totalSearchedCount / loadingPublicationSources.totalSourcesCount) *
                        100
                    }
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            </React.Fragment>
        );
    }
}

const StyledPublicationListLoadingProgressClass = withStyles(styles, { withTheme: true })(
    PublicationListLoadingProgressClass,
);
const PublicationListLoadingProgress = props => <StyledPublicationListLoadingProgressClass {...props} />;
export default PublicationListLoadingProgress;
