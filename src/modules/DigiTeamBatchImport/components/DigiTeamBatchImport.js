import React, { Fragment, PureComponent } from 'react';
import { locale } from 'locale';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import Grid from '@material-ui/core/Grid';

export class DigiTeamBatchImport extends PureComponent {
    render() {
        const localeContent = locale.components.digiTeam.batchImport.display;
        return (
            <StandardPage title={localeContent.title}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Fragment>WELCOME TO BatchImport, DigiTeam Member!</Fragment>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}

export default DigiTeamBatchImport;
