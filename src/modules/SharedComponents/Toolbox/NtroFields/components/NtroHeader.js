import React from 'react';
import {default as componentLocale} from 'locale/components';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';

export default class NtroHeader extends React.PureComponent {
    render() {
        const txt = componentLocale.components.ntroFields.header;
        return (
            <Grid item xs={12}>
                <StandardCard title={txt.title}>
                    {txt.body}
                </StandardCard>
            </Grid>
        );
    }
}
