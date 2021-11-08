import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { HelpIcon } from '../../../SharedComponents/Toolbox/HelpDrawer';
import locale from '../../../../locale/components';

export const getId = title => `journal-search-keyword-list-${title.trim().toLowerCase()}`;

export const KeywordsList = ({ title, list, help }) => {
    const txt = locale.components.searchJournals;
    return (
        <Grid container id={getId(title)} data-testid={getId(title)}>
            <Grid item xs="auto" style={{ margin: '10px 0 10px 0' }}>
                <Typography variant="subtitle1" color="primary" component="h3" variant="h5">
                    {title}
                </Typography>
            </Grid>
            {!!help && (
                <Grid item xs>
                    <HelpIcon {...help} />
                </Grid>
            )}
            {!!list && list.length > 0 ? (
                list
            ) : (
                <Grid
                    item
                    xs={12}
                    id={`journal-search-keyword-list-${title.toLowerCase().trim()}-no-matches`}
                    data-testid={`journal-search-keyword-list-${title.toLowerCase().trim()}-no-matches`}
                >
                    <Typography color="secondary">{txt.partials.keywordsList.noResultsFound}</Typography>
                </Grid>
            )}
        </Grid>
    );
};

KeywordsList.propTypes = {
    title: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    help: PropTypes.object,
};

export default React.memo(KeywordsList);
