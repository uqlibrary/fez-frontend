import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { numberToWords, SIGNIFICANCE_MAP } from 'config/general';
import { parseHtmlToJSX } from 'helpers/general';

export const ScaleOfSignificanceTemplate = ({ item }) => {
    // eslint-disable-next-line camelcase
    const authorNameIfKnown = <>{!!item.author?.rek_author ? `(${item.author.rek_author})` : ''}</>;
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography
                    variant="body2"
                    style={{ color: 'rgba(0, 0, 0, 0.5)' }}
                    data-testid={`scalesignif-author-${item.id}`}
                >
                    {numberToWords(item.id + 1)} listed author {authorNameIfKnown}
                </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <Typography variant="body2" id={`scale-item-${item.id}`} data-testid={`scale-item-${item.id}`}>
                    {SIGNIFICANCE_MAP[item.scaleValue] || 'Missing'}
                </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
                <Typography
                    variant="body2"
                    component={'span'}
                    id={`statement-item-${item.id}`}
                    data-testid={`statement-item-${item.id}`}
                >
                    {parseHtmlToJSX(item.signifValue.plainText || item.signifValue.htmlText || '')}
                </Typography>
            </Grid>
        </Grid>
    );
};

ScaleOfSignificanceTemplate.propTypes = {
    item: PropTypes.object,
};
