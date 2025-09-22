import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import locale from 'locale/components';
import { sanitiseId } from 'helpers/general';

export const KeywordsList = ({ title, list, help }) => {
    const txt = locale.components.searchJournals;
    const componentId = sanitiseId(`journal-search-keyword-list-${title}`);

    return (
        <Grid container id={componentId} data-testid={componentId}>
            <Grid item xs="auto" style={{ marginBottom: '10px' }}>
                <Typography
                    color="primary"
                    component="h3"
                    variant="h6"
                    style={{ display: 'inline', fontSize: '1.1rem' }}
                >
                    {title}
                </Typography>
                {!!help && <HelpIcon {...help} iconSize={'small'} style={{ marginTop: '-6px' }} />}
            </Grid>
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
