import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { SIGNIFICANCE_MAP } from 'config/general';
import ReactHtmlParser from 'react-html-parser';
import { makeOrdinalNumber } from 'helpers/general';

export const ScaleOfSignificanceTemplate = ({ item }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="body2" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                    {makeOrdinalNumber(item.id + 1)} position ({item.authorName})
                </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <Typography variant="body2">{SIGNIFICANCE_MAP[item.key] || 'Missing'}</Typography>
            </Grid>
            <Grid item xs={12} md={9}>
                <Typography variant="body2" component={'span'}>
                    {ReactHtmlParser(item.value.plainText || item.value.htmlText || '')}
                </Typography>
            </Grid>
        </Grid>
    );
};

ScaleOfSignificanceTemplate.propTypes = {
    item: PropTypes.object,
};
