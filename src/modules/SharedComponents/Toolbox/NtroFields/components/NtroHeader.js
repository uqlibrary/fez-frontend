import React from 'react';
import { default as componentLocale } from 'locale/components';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import Grid from '@mui/material/Grid';

const NtroHeader = ({}) => {
    const txt = componentLocale.components.ntroFields.header;
    return (
        <Grid xs={12}>
            <Alert title={txt.title} message={txt.body} type="info_outline" />
        </Grid>
    );
};

export default NtroHeader;
