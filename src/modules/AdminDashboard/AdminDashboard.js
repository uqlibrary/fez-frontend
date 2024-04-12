import React from 'react';
import PropTypes from 'prop-types';

import { adminDashboardConfig } from 'config';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import locale from 'locale/components';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const CustomTabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-dashboard-tabs-${index}`}
            aria-labelledby={`admin-dashboard-tab-${index}`}
            {...other}
        >
            {value === index && <StandardCard>{children}</StandardCard>}
        </div>
    );
};

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `admin-dashboard-tabs-${index}`,
    };
}

const AdminDashboard = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const txt = locale.components.adminDashboard;

    return (
        <StandardPage title={txt.title}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                {adminDashboardConfig.tabs.map(tab => {
                    <Tab label={tab.title} {...a11yProps(0)} />;
                })}
            </Tabs>
            {adminDashboardConfig.tabs.map(tab => {
                <CustomTabPanel value={value} index={tab.id}>
                    Item One
                </CustomTabPanel>;
            })}
        </StandardPage>
    );
};

export default React.memo(AdminDashboard);
