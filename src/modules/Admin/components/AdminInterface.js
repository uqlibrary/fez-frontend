import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Field } from 'redux-form/immutable';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import FormViewToggler from './FormViewToggler';
import TabContainer from './TabContainer';
import { useTabbedContext, useRecordContext } from 'context';

import pageLocale from 'locale/pages';
import queryString from 'query-string';
import { validation } from 'config';

function useQueryStringTabValueState(location, initialValue = 'security') {
    const tabValue =
        queryString.parse(location.search, { ignoreQueryPrefix: true }).tab === 'security' ? 'security' : initialValue;
    return useState(tabValue);
}

export const AdminInterface = ({ classes, submitting, handleSubmit, location, tabs, history, submitSucceeded }) => {
    const { record } = useRecordContext();
    const { tabbed } = useTabbedContext();
    const [currentTabValue, setCurrentTabValue] = useQueryStringTabValueState(location);

    const successConfirmationRef = useRef();
    const alertProps = useRef(null);
    const txt = useRef(pageLocale.pages.edit);

    alertProps.current = validation.getErrorAlertProps({
        submitting,
        submitSucceeded,
        alertLocale: txt.current.alerts,
    });

    /* istanbul ignore next */
    useEffect(() => {
        Cookies.set('adminFormTabbed', tabbed ? 'tabbed' : 'fullform');
    }, [tabbed]);

    /* istanbul ignore next */
    useEffect(() => {
        if (!submitting && submitSucceeded && successConfirmationRef.current) {
            successConfirmationRef.current.showConfirmation();
        }
    }, [submitting, submitSucceeded]);

    const handleTabChange = (event, value) => setCurrentTabValue(value);
    const setSuccessConfirmationRef = useCallback((node) => {
        successConfirmationRef.current = node;
    }, []);

    const navigateToSearchResult = () => history.go(-1);

    const renderTabContainer = (tab) => (
        <TabContainer key={tab} value={tab} currentTab={currentTabValue} tabbed={tabbed}>
            <StandardCard title={txt.current.sections[tab].title} primaryHeader={!!tabbed} squareTop={!!tabbed}>
                <Field component={tabs[tab].component} disabled={submitting} name={`${tab}Section`} />
            </StandardCard>
        </TabContainer>
    );

    const saveConfirmationLocale = txt.current.successWorkflowConfirmation;

    return (
        <StandardPage>
            <React.Fragment>
                <Grid container direction="row" alignItems="center" style={{ marginTop: -24 }}>
                    <ConfirmDialogBox
                        onRef={setSuccessConfirmationRef}
                        onAction={navigateToSearchResult}
                        locale={saveConfirmationLocale}
                    />
                    <Grid item xs style={{ marginBottom: 12 }}>
                        <Typography variant="h5" color="primary" style={{ fontSize: 24 }}>{`${record.rek_pid} ${
                            record.rek_title
                        }`}</Typography>
                    </Grid>
                    <Hidden xsDown>
                        <Grid item xs="auto">
                            <FormViewToggler />
                        </Grid>
                        <Grid container spacing={0} direction="row">
                            {tabbed && (
                                <Grid item xs={12}>
                                    <Tabs
                                        value={currentTabValue}
                                        variant="fullWidth"
                                        style={{ marginRight: -56, marginLeft: -56 }}
                                        classes={{ indicator: classes.tabIndicator }}
                                        onChange={handleTabChange}
                                        variant="scrollable"
                                        scrollButtons="on"
                                        indicatorColor="primary"
                                        textColor="primary"
                                    >
                                        {Object.keys(tabs)
                                            .filter((tab) => tabs[tab].activated)
                                            .map((tab) => (
                                                <Tab key={tab} label={txt.current.sections[tab].title} value={tab} />
                                            ))}
                                    </Tabs>
                                </Grid>
                            )}
                        </Grid>
                    </Hidden>
                </Grid>
                {/* --------------- Content here ---------------*/}
                <form>
                    <Grid container spacing={16}>
                        {!tabbed
                            ? Object.keys(tabs)
                                .filter((tab) => tabs[tab].activated)
                                .map(renderTabContainer)
                            : renderTabContainer(currentTabValue)}
                        {alertProps.current && (
                            <Grid item xs={12}>
                                <Alert pushToTop {...alertProps.current} />
                            </Grid>
                        )}
                        <Grid item xs={12} sm={12}>
                            <Button
                                style={{ whiteSpace: 'nowrap' }}
                                disabled={submitting}
                                variant="contained"
                                color="primary"
                                fullWidth
                                children="Submit"
                                onClick={handleSubmit}
                            />
                        </Grid>
                    </Grid>
                </form>
            </React.Fragment>
        </StandardPage>
    );
};

AdminInterface.propTypes = {
    classes: PropTypes.object,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    handleSubmit: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object,
    tabs: PropTypes.object,
};

export default React.memo(AdminInterface);
