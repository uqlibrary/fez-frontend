import React from 'react';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

const JournalsListDataCol1 = (journal, index) => {
    console.log(journal.journal);
    return (
        <Grid container spacing={1} id={`journal-list-data-${index}`} alignItems="center">
            <Grid item xs="auto" id={`journal-list-data-select-${index}`}>
                <Checkbox style={{ padding: 2 }} />
            </Grid>
            <Grid item xs id={`journal-list-header-title-${index}`}>
                <Typography
                    style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    name={journal.journal.jnl_title || 'Not found'}
                >
                    {journal.journal.jnl_title || 'Not found'}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default React.memo(JournalsListDataCol1);
