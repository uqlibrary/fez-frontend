import React from 'react';
import Grid from '@material-ui/core/Grid';

const JournalsListHeaderCol3 = () => {
    return (
        <Grid
            container
            spacing={0}
            id="journal-list-header-1"
            alignItems="center"
            style={{ height: 32, borderBottom: '1px solid #CCC', marginBottom: 6 }}
        />
    );
};

export default React.memo(JournalsListHeaderCol3);
