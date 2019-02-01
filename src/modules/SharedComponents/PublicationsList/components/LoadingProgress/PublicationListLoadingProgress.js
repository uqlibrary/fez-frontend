import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import locale from 'locale/pages';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    copy: {
        fontSize: theme.typography.caption.fontSize
    }
});

export class PublicationListLoadingProgress extends PureComponent {
    static propTypes = {
        loadingPublicationSources: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    render() {
        const txt = locale.pages.addRecord.step2.searchResults.searchDashboard;
        const {loadingPublicationSources, classes} = this.props;

        return (
            <React.Fragment>
                <Hidden xsDown>
                    {txt.repositories.map((item, index) => (
                        <Grid container spacing={8} key={index}>
                            <Grid item xs>
                                <Typography variant={'body1'} className={classes.copy}>{item.title}</Typography>
                            </Grid>
                            {
                                loadingPublicationSources && loadingPublicationSources[item.id]
                                    ? (
                                        <Grid item>
                                            <Typography className={classes.copy} noWrap>{loadingPublicationSources[`${item.id}Count`]} {txt.recordSuffix}</Typography>
                                        </Grid>
                                    )
                                    : (
                                        <Grid item>
                                            <CircularProgress
                                                size={12}
                                                thickness={4}
                                                variant={'indeterminate'}
                                                aria-label={`${item.title} ${txt.ariaCircularProgressLabelSuffix}`}/>
                                        </Grid>
                                    )
                            }
                        </Grid>
                    ))}
                </Hidden>
                <Hidden smUp>
                    <LinearProgress
                        variant="determinate"
                        value={loadingPublicationSources.totalSearchedCount / loadingPublicationSources.totalSourcesCount * 100}
                        aria-valuenow={loadingPublicationSources.totalSearchedCount / loadingPublicationSources.totalSourcesCount * 100}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </Hidden>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(PublicationListLoadingProgress);

