import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

export default function TabContainer({value, children, tabbed, currentTab}) {
    if ((tabbed && currentTab === value) || (!tabbed)) {
        return (
            <Grid item xs={12}>
                {children}
            </Grid>
        );
    } else {
        return null;
    }
}

TabContainer.propTypes = {
    value: PropTypes.number,
    tabbed: PropTypes.bool,
    currentTab: PropTypes.number,
    children: PropTypes.node
};
