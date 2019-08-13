import React, { PureComponent } from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { TopCitedPublications } from 'modules/TopCitedPublications';
import { NewsFeed } from 'modules/SharedComponents/NewsFeed';
import { WhatIsEspace } from 'modules/SharedComponents/WhatIsEspace';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class IndexComponent extends PureComponent {
    render() {
        return (
            <StandardPage>
                <Grid container spacing={24}>
                    <Grid item xs={12} md={8}>
                        <TopCitedPublications />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <WhatIsEspace />
                            </Grid>
                            <Grid item xs={12}>
                                <NewsFeed />
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
