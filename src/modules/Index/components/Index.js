import React, { PureComponent } from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { TopCitedPublications } from 'modules/TopCitedPublications';
import { CulturalAdvice } from 'modules/SharedComponents/CulturalAdvice';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import { AcknowledgementOfCountry } from '../../SharedComponents/AcknowledgementOfCountry';

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
                                <CulturalAdvice />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}

const StyledIndex = withStyles(null, { withTheme: true })(IndexComponent);
const Index = props => <StyledIndex {...props} />;
export default Index;
