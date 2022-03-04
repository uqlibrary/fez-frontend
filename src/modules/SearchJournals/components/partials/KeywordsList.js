import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import locale from 'locale/components';
import { sanitiseId } from 'helpers/general';

export const KeywordsList = ({ title, list, help }) => {
    const txt = locale.components.searchJournals;
    const componentId = sanitiseId(`journal-search-keyword-list-${title}`);

    return (
        <Grid container id={componentId} data-testid={componentId}>
            <Grid item xs="auto" style={{ margin: '10px 0 10px 0' }}>
                <Typography color="primary" component="h3" variant="h5">
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
                <Grid item xs={12} id={`${componentId}-no-matches`} data-testid={`${componentId}-no-matches`}>
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
