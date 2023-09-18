import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import locale from 'locale/pages';

export class PublicationListLoadingProgress extends PureComponent {
    static propTypes = {
        loadingPublicationSources: PropTypes.object.isRequired,
    };

    render() {
        const txt = locale.pages.addRecord.step2.searchResults.searchDashboard;
        const { loadingPublicationSources } = this.props;

        return (
            <React.Fragment>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {txt.repositories.map((item, index) => (
                        <Grid container spacing={1} key={index}>
                            <Grid item xs>
                                <Typography
                                    variant={'body1'}
                                    sx={theme => ({
                                        fontSize: theme.typography.caption.fontSize,
                                    })}
                                >
                                    {item.title}
                                </Typography>
                            </Grid>
                            {loadingPublicationSources && loadingPublicationSources[item.id] ? (
                                <Grid item>
                                    <Typography
                                        sx={theme => ({
                                            fontSize: theme.typography.caption.fontSize,
                                        })}
                                        noWrap
                                    >
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

export default PublicationListLoadingProgress;
