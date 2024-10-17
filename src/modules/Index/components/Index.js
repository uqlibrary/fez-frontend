import React, { PureComponent } from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { TopCitedPublications } from 'modules/TopCitedPublications';
import { CulturalAdvice, CulturalNotice } from 'modules/SharedComponents/CulturalAdvice';
import Grid from '@mui/material/Grid';
import { AcknowledgementOfCountry } from '../../SharedComponents/AcknowledgementOfCountry';
import { GenAiTermsOfUse } from '../../SharedComponents/GenAiTermsOfUse';

class IndexComponent extends PureComponent {
    render() {
        return (
            <StandardPage>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <TopCitedPublications />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <AcknowledgementOfCountry />
                            </Grid>
                            <Grid item xs={12}>
                                <GenAiTermsOfUse />
                            </Grid>
                            <Grid item xs={12}>
                                <CulturalAdvice />
                            </Grid>
                            <Grid item xs={12}>
                                <CulturalNotice />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}

const Index = props => <IndexComponent {...props} />;
export default Index;
