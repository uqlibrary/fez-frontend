import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from 'actions';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import locale from 'locale/components';
import { tabConfig, tabProps } from 'config/adminDashboard';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

export const CustomTabPanel = ({ children, value, index, ...rest } = {}) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`admin-dashboard-tabs-${index}`}
        data-testid={`admin-dashboard-tabs-${index}`}
        aria-labelledby={`admin-dashboard-tab-${index}`}
        {...rest}
    >
        {value === index && <div>{children}</div>}
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
    const txt = locale.components.adminDashboard;
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = React.useState(0);
    const {
        adminDashboardConfigLoading,
        adminDashboardConfigData,
        adminDashboardConfigSuccess,
        adminDashboardConfigError,
    } = useSelector(state => state.get('adminDashboardConfigReducer'));

    if (!adminDashboardConfigError && !adminDashboardConfigSuccess && !adminDashboardConfigLoading) {
        dispatch(actions.loadAdminDashboardConfig())
            .then(() => {
                dispatch(actions.loadAdminDashboardToday());
            })
            .catch(
                /* istanbul ignore next */ error => {
                    /* istanbul ignore next */ console.error(error);
                },
            );
    }
    const { adminDashboardTodayData } = useSelector(state => state.get('adminDashboardTodayReducer'));

    const handleChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab);
    };

    return (
        <StandardPage title={txt.title}>
            {adminDashboardConfigLoading && <InlineLoader message={txt.loading.config} />}
            {((!adminDashboardConfigLoading && !!!adminDashboardConfigData) ||
                (Array.isArray(adminDashboardConfigData) && adminDashboardConfigData.length === 0) ||
                !!adminDashboardConfigError) && (
                <Typography fontSize={'1rem'} fontWeight={400} textAlign={'center'}>
                    {txt.loading.noconfig}
                </Typography>
            )}

            {!!adminDashboardConfigData && (
                <>
                    <Tabs value={activeTab} onChange={handleChange} aria-label="admin dashboard tabbed interface">
                        {tabConfig.map(tab => {
                            return (
                                <Tab
                                    key={tab.title}
                                    label={tab.title}
                                    sx={{ minHeight: 'auto' }}
                                    {...a11yProps(tab.id)}
                                    {...tabProps.find(_tab => _tab.id === tab.id)?.render(adminDashboardTodayData)}
                                />
                            );
                        })}
                    </Tabs>
                    {tabConfig.map(tab => (
                        <CustomTabPanel key={tab.id} value={activeTab} index={tab.id}>
                            <tab.component />
                        </CustomTabPanel>
                    ))}
                </>
            )}
        </StandardPage>
    );
};

export default React.memo(AdminDashboard);
