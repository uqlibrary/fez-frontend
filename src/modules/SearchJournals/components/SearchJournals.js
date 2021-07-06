import React from 'react';
import Grid from '@material-ui/core/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import JournalSearchInterface from './JournalSearchInterface';

export const SearchJournals = ({}) => {
    return (
        <StandardPage>
            <Grid container>
                <Grid item xs={12}>
                    <JournalSearchInterface />
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(SearchJournals);
