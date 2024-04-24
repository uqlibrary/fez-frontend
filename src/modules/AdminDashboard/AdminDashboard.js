import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import * as adminDashboardConfig from './config';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import locale from 'locale/components';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const CustomTabPanel = ({ children, value, index, ...rest } = {}) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`admin-dashboard-tabs-${index}`}
        aria-labelledby={`admin-dashboard-tab-${index}`}
        {...rest}
    >
        {value === index && <StandardCard>{children}</StandardCard>}
    </div>
);
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = index => ({
    id: `admin-dashboard-tab-${index}`,
    'aria-controls': `admin-dashboard-tab-${index}`,
});

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const { adminDashboardTodayData } = useSelector(state => state.get('adminDashboardTodayReducer'));

    const handleChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab);
    };

    const txt = locale.components.adminDashboard;

    return (
        <StandardPage title={txt.title}>
            <Tabs value={activeTab} onChange={handleChange} aria-label="admin dashboard tabbed interface">
                {adminDashboardConfig.tabs.map(tab => {
                    return (
                        <Tab
                            key={tab.title}
                            label={tab.title}
                            sx={{ minHeight: 'auto' }}
                            {...a11yProps(tab.id)}
                            {...adminDashboardConfig.tabProps
                                .find(_tab => _tab.id === tab.id)
                                ?.render(adminDashboardTodayData?.systemalerts?.total)}
                        />
                    );
                })}
            </Tabs>
            {adminDashboardConfig.tabs.map(tab => (
                <CustomTabPanel key={tab.id} value={activeTab} index={tab.id}>
                    {tab.component}
                </CustomTabPanel>
            ))}
        </StandardPage>
    );
};

export default React.memo(AdminDashboard);
