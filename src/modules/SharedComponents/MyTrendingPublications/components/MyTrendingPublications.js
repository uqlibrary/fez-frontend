import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { locale } from 'locale';
import * as actions from 'actions';

import { PublicationsList } from 'modules/SharedComponents/PublicationsList';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

export const MyTrendingPublications = () => {
    const dispatch = useDispatch();
    const { trendingPublicationsList, loadingTrendingPublications } = useSelector(state =>
        state.get('myTrendingPublicationsReducer'),
    );

    const { author } = useSelector(state => state.get('accountReducer')) || /* istanbul ignore next */ false;

    React.useEffect(() => {
        if (!!author) {
            dispatch(actions.searchTrendingPublications(locale.components.myTrendingPublications.recordsPerSource));
        }
    }, [author, dispatch]);

    const txt = locale.components.myTrendingPublications;
    if (loadingTrendingPublications) {
        return (
            <Grid container alignItems={'center'}>
                <Grid item>
                    <InlineLoader message={txt.loading} />
                </Grid>
            </Grid>
        );
    }
    if (trendingPublicationsList.length === 0) {
        return <div className="empty" />;
    }
    return (
        <Grid container spacing={3} id={'myTrendingPublications'}>
            <Grid item xs={12}>
                {trendingPublicationsList.map(({ key, values }, metricIndex) => {
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
};

export default React.memo(MyTrendingPublications);
