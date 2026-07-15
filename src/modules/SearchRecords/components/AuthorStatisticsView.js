import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Grid from '@mui/material/GridLegacy';

import { loadAuthorStatsByAuthorId } from 'actions';
import {
    AuthorsPublicationsPerYearChart,
    AuthorsPublicationTypesCountChart,
} from 'modules/SharedComponents/Toolbox/Charts';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PublicationStats } from 'modules/SharedComponents/PublicationStats';
import { mui1theme as theme } from 'config';
import locale from 'locale/pages';

const txt = locale.pages.dashboard;

const AuthorStatisticsView = ({ authorId, username }) => {
    const dispatch = useDispatch();
    const { loadingAuthorStats, authorStatsByYear, authorStatsPerType, authorStats } = useSelector(state =>
        state.get('authorStatisticsReducer'),
    );

    React.useEffect(() => {
        if (authorId) {
            dispatch(loadAuthorStatsByAuthorId(authorId, username));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authorId]);

    if (loadingAuthorStats) {
        return <InlineLoader loaderId="author-stats-loading" message="Loading author statistics..." />;
    }

    return (
        <Grid container spacing={3} sx={{ mt: 0 }}>
            {authorStatsByYear && (
                <Grid item xs={12}>
                    <StandardCard
                        title={txt.publicationsByYearChart.title}
                        customBackgroundColor={theme.graphs.color2}
                        customTitleColor={theme.palette.white.main}
                    >
                        <AuthorsPublicationsPerYearChart
                            className="barChart"
                            {...authorStatsByYear}
                            yAxisTitle={txt.publicationsByYearChart.yAxisTitle}
                        />
                    </StandardCard>
                </Grid>
            )}
            {authorStatsPerType && authorStatsPerType.length > 0 && (
                <Grid item xs={12} md={6}>
                    <StandardCard
                        title={txt.publicationTypesCountChart.title}
                        customBackgroundColor={theme.graphs.color1}
                        customTitleColor={theme.palette.white.main}
                    >
                        <AuthorsPublicationTypesCountChart
                            className="donutChart"
                            series={[{ name: txt.publicationTypesCountChart.title, data: authorStatsPerType }]}
                        />
                    </StandardCard>
                </Grid>
            )}
            {authorStats &&
                (authorStats.thomson_citation_count_i?.count > 0 || authorStats.scopus_citation_count_i?.count > 0) && (
                    <Grid item xs={12} md={6}>
                        <StandardCard noPadding noHeader fullHeight>
                            <PublicationStats publicationsStats={authorStats} />
                        </StandardCard>
                    </Grid>
                )}
        </Grid>
    );
};

AuthorStatisticsView.propTypes = {
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
};

export default AuthorStatisticsView;
