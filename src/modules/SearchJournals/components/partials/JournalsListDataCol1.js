import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import PropTypes from 'prop-types';

const JournalsListDataCol1 = ({ journal, index }) => {
    return (
        <Grid
            container
            spacing={1}
            id={`journal-list-data-${index}`}
            alignItems="center"
            style={{ borderBottom: '1px dashed #e6e6e6', marginBottom: 4 }}
        >
            <Grid item xs="auto" id={`journal-list-data-select-${index}`}>
                <Checkbox style={{ padding: 2 }} />
            </Grid>
            <Grid item xs id={`journal-list-header-title-${index}`}>
                <Typography
                    style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    name={journal.jnl_title || 'Not found'}
                >
                    <Tooltip title={`Click to view ${journal.jnl_title}`} placement="right">
                        <Typography variant="body1" component="span">
                            <ExternalLink href={`/journal/view/${journal.jnl_jid}`} title={journal.jnl_title}>
                                {journal.jnl_title}
                            </ExternalLink>
                        </Typography>
                    </Tooltip>
                </Typography>
            </Grid>
        </Grid>
    );
};

JournalsListDataCol1.propTypes = {
    journal: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(JournalsListDataCol1);
