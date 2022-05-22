import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { SIGNIFICANCE_MAP } from 'config/general';
import ReactHtmlParser from 'react-html-parser';

export const ScaleOfSignificanceTemplate = ({ item }) => (
    <Grid container>
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

ScaleOfSignificanceTemplate.propTypes = {
    item: PropTypes.object,
};
