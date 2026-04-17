import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { locale } from 'locale';

const StyledGridHeader = styled(Grid)(({ theme }) => ({
    padding: '18px 24px 12px 24px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '& p': {
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.1rem',
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    borderRadius: '4px 4px 0px 0px',
}));

const classes = {
    data: {
        padding: 3,
    },
};

export const PublicationStats = ({ publicationsStats }) => {
    const txt = locale.components.publicationStats;
    const pubStats = publicationsStats;
    if (!pubStats) return <span className="publicationsStats empty" />;
    return (
        <React.Fragment>
            {/* Header */}
            <StyledGridHeader container>
                <Grid item xs={6}>
                    <Typography variant={'body2'} color={'inherit'} gutterBottom>
                        {txt.publicationStatsTitle1}
                    </Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'center' }}>
                    <Typography variant={'body2'} color={'inherit'} gutterBottom>
                        {txt.publicationStatsTitle2}
                    </Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right' }}>
                    <Typography variant={'body2'} color={'inherit'} gutterBottom>
                        {txt.publicationStatsTitle3}
                    </Typography>
                </Grid>
            </StyledGridHeader>
            {/* Header */}

            {/* Total pubs */}
            <Grid container spacing={2} sx={{ ...classes.data }}>
                <Grid item xs={6}>
                    <Typography variant={'body2'}>{txt.publicationStatsRowTitle4}</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'center' }}>
                    <Typography variant={'body2'}>{pubStats.thomson_citation_count_i.count}</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right' }}>
                    <Typography variant={'body2'}>{pubStats.scopus_citation_count_i.count}</Typography>
                </Grid>
            </Grid>
            <Divider />
            {/* Total pubs */}

            {/* Range */}
            <Grid container spacing={2} sx={{ ...classes.data }}>
                <Grid item xs={6}>
                    <Typography variant={'body2'}>{txt.publicationStatsRowTitle5}</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'center' }}>
                    <Typography variant={'body2'}>{pubStats.thomson_citation_count_i.years}</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right' }}>
                    <Typography variant={'body2'}>{pubStats.scopus_citation_count_i.years}</Typography>
                </Grid>
            </Grid>
            <Divider />
            {/* Range */}

            {/* hindex */}
            <Grid container spacing={2} sx={{ ...classes.data }}>
                <Grid item xs={6}>
                    <Typography variant={'body2'}>{txt.publicationStatsRowTitle1}</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'center' }}>
                    <Typography variant={'body2'}>
                        {!pubStats.thomson_citation_count_i.hindex ||
                        pubStats.thomson_citation_count_i.hindex === '' ||
                        pubStats.thomson_citation_count_i.hindex.toFixed(0) === '0' ||
                        pubStats.thomson_citation_count_i.hindex === '0'
                            ? txt.publicationStatsNA
                            : pubStats.thomson_citation_count_i.hindex.toFixed(0)}
                    </Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right' }}>
                    <Typography variant={'body2'}>
                        {!pubStats.scopus_citation_count_i.hindex ||
                        pubStats.scopus_citation_count_i.hindex === '' ||
                        pubStats.scopus_citation_count_i.hindex.toFixed(0) === '0' ||
                        pubStats.scopus_citation_count_i.hindex === '0'
                            ? txt.publicationStatsNA
                            : pubStats.scopus_citation_count_i.hindex.toFixed(0)}
                    </Typography>
                </Grid>
            </Grid>
            <Divider />
            {/* hindex */}

            {/* Average */}
            <Grid container spacing={2} sx={{ ...classes.data }}>
                <Grid item xs={6}>
                    <Typography variant={'body2'}>{txt.publicationStatsRowTitle2}</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'center' }}>
                    <Typography variant={'body2'}>
                        {pubStats.thomson_citation_count_i.avg && pubStats.thomson_citation_count_i.avg.toFixed(1)}
                    </Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right' }}>
                    <Typography variant={'body2'}>
                        {pubStats.scopus_citation_count_i.avg && pubStats.scopus_citation_count_i.avg.toFixed(1)}
                    </Typography>
                </Grid>
            </Grid>
            <Divider />
            {/* Average */}

            {/* Total citations */}
            <Grid container spacing={2} sx={{ ...classes.data }}>
                <Grid item xs={6}>
                    <Typography variant={'body2'}>{txt.publicationStatsRowTitle3}</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'center' }}>
                    <Typography variant={'body2'}>{pubStats.thomson_citation_count_i.sum}</Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: 'right' }}>
                    <Typography variant={'body2'}>{pubStats.scopus_citation_count_i.sum}</Typography>
                </Grid>
            </Grid>
            {/* Total citations */}
        </React.Fragment>
    );
};
PublicationStats.propTypes = {
    publicationsStats: PropTypes.object,
};
export default React.memo(PublicationStats);
