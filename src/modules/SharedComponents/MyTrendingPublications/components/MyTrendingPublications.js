import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { locale } from 'locale';
import { PublicationsList } from 'modules/SharedComponents/PublicationsList';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export class MyTrendingPublications extends PureComponent {
    static propTypes = {
        trendingPublicationsList: PropTypes.array,
        loadingTrendingPublications: PropTypes.bool,
        actions: PropTypes.object,
        accountAuthorDetailsLoading: PropTypes.bool,
    };

    static defaultProps = {
        trendingPublicationsList: [],
        loadingTrendingPublications: false,
    };

    componentDidMount() {
        if (!this.props.accountAuthorDetailsLoading) {
            this.props.actions.searchTrendingPublications(locale.components.myTrendingPublications.recordsPerSource);
        }
    }

    render() {
        const txt = locale.components.myTrendingPublications;
        if (this.props.loadingTrendingPublications) {
            return (
                <Grid container alignItems={'center'}>
                    <Grid item>
                        <InlineLoader message={txt.loading} />
                    </Grid>
                </Grid>
            );
        }
        if (this.props.trendingPublicationsList.length === 0) {
            return <div className="empty" />;
        }
        return (
            <Grid container spacing={3} id={'myTrendingPublications'}>
                <Grid item xs={12}>
                    {this.props.trendingPublicationsList.map(({ key, values }, metricIndex) => {
                        return (
                            <Grid container key={metricIndex} spacing={3}>
                                <Grid item xs>
                                    <Typography variant={'h6'}>
                                        <div className={`fez-icon ${key} xxlarge`} />
                                        {txt.metrics[key].title}
                                    </Typography>
                                    <Typography variant={'subtitle1'}>{txt.metrics[key].subtitle}</Typography>
                                </Grid>
                                <Grid item>
                                    <HelpIcon {...locale.components.trendingPublicationHelp} />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        '& .citationMetrics': {
                                            '& .count': {
                                                fontSize: '1.75rem',
                                            },
                                            '& .difference': {
                                                fontSize: '1rem',
                                            },
                                        },
                                    }}
                                >
                                    <PublicationsList publicationsList={values} showMetrics />
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        );
    }
}

export default MyTrendingPublications;
