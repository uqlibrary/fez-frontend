import React, { PureComponent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { redirectUserToPassiveLogin } from 'helpers/redirectUserToPassiveLogin';
import { TopCitedPublications } from 'modules/TopCitedPublications';
import { CulturalAdvice, CulturalNotice } from 'modules/SharedComponents/CulturalAdvice';
import Grid from '@mui/material/GridLegacy';
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
                                <CulturalAdvice />
                            </Grid>
                            <Grid item xs={12}>
                                <GenAiTermsOfUse />
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

const Index = props => {
    const { account, accountLoading } = useSelector(state => state.get('accountReducer'));
    // Homepage only: attempt a one-shot passive (silent) SSO login, but ONLY once the account
    // check has resolved and confirmed the visitor is anonymous. Do not rely on UQLID/UQLSSO
    // cookie presence - Auth sets those on any request (even a failed passive attempt), so they
    // do not indicate a valid session. The /account result (redux account) is the source of truth.
    useEffect(() => {
        if (!accountLoading && account === null) {
            redirectUserToPassiveLogin();
        }
    }, [account, accountLoading]);
    return <IndexComponent {...props} />;
};
export default Index;
