import React, {PureComponent} from 'react';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {TopCitedPublications} from 'modules/TopCitedPublications';
import {NewsFeed} from 'modules/SharedComponents/NewsFeed';
import {WhatIsEspace} from 'modules/SharedComponents/WhatIsEspace';

import {Alert} from 'modules/SharedComponents/Toolbox/Alert';

// MUI 1
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class Index extends PureComponent {
    render() {
        return (
            <StandardPage>
                <Grid container spacing={24}>
                    <Grid item xs={8} >
                        <Alert type={'warning'} dismissAction={() => {console.log('ping');}} allowDismiss dismissTitle={'Bye'} action={() => {console.log('ping');}} actionButtonLabel={'Button'} title="Test" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed convallis lorem. Aenean ac feugiat nisl, non accumsan orci. Pellentesque sed placerat orci. In mauris lacus, pellentesque vitae erat sit amet, viverra mollis tellus. Nam fermentum mi eget auctor lacinia. Mauris sit amet facilisis velit. Cras lacus erat, egestas facilisis faucibus vel, gravida sed leo. Proin nec augue sed eros volutpat porta. Nunc lacus enim, tempor vel urna vel, varius efficitur felis. Quisque imperdiet egestas imperdiet. Morbi varius malesuada porttitor." />
                        <Alert type={'error'} dismissAction={() => {console.log('ping');}} allowDismiss dismissTitle={'Bye'} action={() => {console.log('ping');}} actionButtonLabel={'Button'} title="Test" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed convallis lorem. Aenean ac feugiat nisl, non accumsan orci. Pellentesque sed placerat orci. In mauris lacus, pellentesque vitae erat sit amet, viverra mollis tellus. Nam fermentum mi eget auctor lacinia. Mauris sit amet facilisis velit. Cras lacus erat, egestas facilisis faucibus vel, gravida sed leo. Proin nec augue sed eros volutpat porta. Nunc lacus enim, tempor vel urna vel, varius efficitur felis. Quisque imperdiet egestas imperdiet. Morbi varius malesuada porttitor." />
                        <Alert type={'info'} dismissAction={() => {console.log('ping');}} action={() => {console.log('ping');}} actionButtonLabel={'Button'} title="Test" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed convallis lorem. Aenean ac feugiat nisl, non accumsan orci. Pellentesque sed placerat orci. In mauris lacus, pellentesque vitae erat sit amet, viverra mollis tellus. Nam fermentum mi eget auctor lacinia. Mauris sit amet facilisis velit. Cras lacus erat, egestas facilisis faucibus vel, gravida sed leo. Proin nec augue sed eros volutpat porta. Nunc lacus enim, tempor vel urna vel, varius efficitur felis. Quisque imperdiet egestas imperdiet. Morbi varius malesuada porttitor." />
                        <Alert type={'info_outline'} dismissAction={() => {console.log('ping');}} allowDismiss dismissTitle={'Bye'} action={() => {console.log('ping');}} actionButtonLabel={'Button'} title="Test" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed convallis lorem. Aenean ac feugiat nisl, non accumsan orci. Pellentesque sed placerat orci. In mauris lacus, pellentesque vitae erat sit amet, viverra mollis tellus. Nam fermentum mi eget auctor lacinia. Mauris sit amet facilisis velit. Cras lacus erat, egestas facilisis faucibus vel, gravida sed leo. Proin nec augue sed eros volutpat porta. Nunc lacus enim, tempor vel urna vel, varius efficitur felis. Quisque imperdiet egestas imperdiet. Morbi varius malesuada porttitor." />
                        <Alert type={'help'} dismissAction={() => {console.log('ping');}} allowDismiss dismissTitle={'Bye'} action={() => {console.log('ping');}} actionButtonLabel={'Button'} title="Test" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed convallis lorem. Aenean ac feugiat nisl, non accumsan orci. Pellentesque sed placerat orci. In mauris lacus, pellentesque vitae erat sit amet, viverra mollis tellus. Nam fermentum mi eget auctor lacinia. Mauris sit amet facilisis velit. Cras lacus erat, egestas facilisis faucibus vel, gravida sed leo. Proin nec augue sed eros volutpat porta. Nunc lacus enim, tempor vel urna vel, varius efficitur felis. Quisque imperdiet egestas imperdiet. Morbi varius malesuada porttitor." />
                        <Alert type={'help_outline'} dismissAction={() => {console.log('ping');}} allowDismiss dismissTitle={'Bye'} action={() => {console.log('ping');}} actionButtonLabel={'Button'} title="Test" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed convallis lorem. Aenean ac feugiat nisl, non accumsan orci. Pellentesque sed placerat orci. In mauris lacus, pellentesque vitae erat sit amet, viverra mollis tellus. Nam fermentum mi eget auctor lacinia. Mauris sit amet facilisis velit. Cras lacus erat, egestas facilisis faucibus vel, gravida sed leo. Proin nec augue sed eros volutpat porta. Nunc lacus enim, tempor vel urna vel, varius efficitur felis. Quisque imperdiet egestas imperdiet. Morbi varius malesuada porttitor." />
                        <Alert type={'done'} dismissAction={() => {console.log('ping');}} allowDismiss dismissTitle={'Bye'} action={() => {console.log('ping');}} actionButtonLabel={'Button'} title="Test" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed convallis lorem. Aenean ac feugiat nisl, non accumsan orci. Pellentesque sed placerat orci. In mauris lacus, pellentesque vitae erat sit amet, viverra mollis tellus. Nam fermentum mi eget auctor lacinia. Mauris sit amet facilisis velit. Cras lacus erat, egestas facilisis faucibus vel, gravida sed leo. Proin nec augue sed eros volutpat porta. Nunc lacus enim, tempor vel urna vel, varius efficitur felis. Quisque imperdiet egestas imperdiet. Morbi varius malesuada porttitor." />
                        <TopCitedPublications/>
                    </Grid>
                    <Grid item xs={4} >
                        <WhatIsEspace />
                        <NewsFeed />
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}
export default withStyles(null, {withTheme: true})(Index);
