import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Field } from 'redux-form/immutable';
import ReactHtmlParser from 'react-html-parser';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import FormViewToggler from './FormViewToggler';
import TabContainer from './TabContainer';
import ScrollToSection from './ScrollToSection';
import { useTabbedContext, useRecordContext /* , ScrollToSectionContext */ } from 'context';

import pageLocale from 'locale/pages';
import queryString from 'query-string';
import { validation, publicationTypes } from 'config';
import { RECORD_TYPE_RECORD } from 'config/general';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';
import { FORM_NAME } from '../constants';
import { routes } from 'config';
import { adminInterfaceConfig } from 'config/admin';

export const useQueryStringTabValueState = (location, initialValue) => {
    const queryStringObject = queryString.parse(location.search, { ignoreQueryPrefix: true });
    const tabValue = (queryStringObject && queryStringObject.tab) || initialValue;
    return useState(tabValue);
};

export const AdminInterface = ({
    classes,
    submitting,
    handleSubmit,
    location,
    tabs,
    history,
    submitSucceeded,
    createMode,
    disableSubmit,
    formErrors,
    destroy,
    authorDetails,
}) => {
    const { record } = useRecordContext();
    const { tabbed } = useTabbedContext();
    const objectType = ((record || {}).rek_object_type_lookup || '').toLowerCase();
    const defaultTab = objectType === RECORD_TYPE_RECORD ? 'bibliographic' : 'security';
    const [currentTabValue, setCurrentTabValue] = useQueryStringTabValueState(location, defaultTab);

    const successConfirmationRef = useRef();
    const alertProps = useRef(null);
    const txt = useRef(pageLocale.pages.edit);

    alertProps.current = validation.getErrorAlertProps({
        submitting,
        submitSucceeded,
        formErrors,
        alertLocale: txt.current.alerts,
    });

    /* istanbul ignore next */
    useEffect(() => {
        return () => {
            destroy(FORM_NAME);
        };
    }, [destroy]);

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
    /* istanbul ignore next */
    const handleCancel = event => {
        event.preventDefault();
        if (!!record.rek_pid) {
            // Editing a record, so navigate to the view page for this PID
            history.push(routes.pathConfig.records.view(record.rek_pid));
        } else {
            // Else this is a new record, so just go to the homepage
            history.push(routes.pathConfig.index);
        }
    };

    /* istanbul ignore next */
    const setSuccessConfirmationRef = useCallback(node => {
        successConfirmationRef.current = node;
    }, []);

    if (!record) {
        return <div className="empty" />;
    }

    const selectedPublicationType =
        (record.rek_display_type && (publicationTypes({ ...recordForms })[record.rek_display_type] || {}).name) ||
        'record';

    if (objectType === RECORD_TYPE_RECORD && !adminInterfaceConfig[record.rek_display_type]) {
        return (
            <StandardPage>
                <Grid container>
                    <Grid item xs={12}>
                        <Alert
                            message={txt.current.notSupportedMessage.replace('[pubType]', selectedPublicationType)}
                            type="info"
                        />
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }

    /* istanbul ignore next */
    const navigateToSearchResult = createMode => {
        if (createMode) {
            history.push(routes.pathConfig.admin.add);
        }
        const navigatedFrom = queryString.parse(location.search).navigatedFrom || null;
        if (
            (authorDetails && authorDetails.is_administrator === 1) ||
            (authorDetails.is_super_administrator === 1 && !!navigatedFrom)
        ) {
            history.push(navigatedFrom);
        } else if (
            authorDetails &&
            authorDetails.is_administrator !== 1 &&
            authorDetails.is_super_administrator !== 1
        ) {
            history.push(routes.pathConfig.records.mine);
        } else {
            history.push(navigatedFrom);
        }
    };

    /* istanbul ignore next */
    const navigateToViewRecord = pid => {
        if (!!pid && validation.isValidPid(pid)) {
            history.push(routes.pathConfig.records.view(pid));
        }
    };

    const renderTabContainer = tab => (
        <TabContainer key={tab} value={tab} currentTab={currentTabValue} tabbed={tabbed}>
            <ScrollToSection scrollToSection={!tabbed && tab === currentTabValue}>
                <StandardCard title={txt.current.sections[tab].title} primaryHeader squareTop smallTitle>
                    <Field component={tabs[tab].component} disabled={submitting} name={`${tab}Section`} />
                </StandardCard>
            </ScrollToSection>
        </TabContainer>
    );

    const saveConfirmationLocale = createMode
        ? txt.current.successAddWorkflowConfirmation
        : txt.current.successWorkflowConfirmation;
    return (
        <StandardPage>
            <React.Fragment>
                <Grid container spacing={0} direction="row" alignItems="center" style={{ marginTop: -24 }}>
                    <ConfirmDialogBox
                        onRef={setSuccessConfirmationRef}
                        onAction={() => navigateToSearchResult(createMode)}
                        locale={saveConfirmationLocale}
                        onCancelAction={
                            /* istanbul ignore next */
                            () => navigateToViewRecord(record.rek_pid)
                        }
                    />
                    <Grid item xs style={{ marginBottom: 12 }}>
                        <Typography variant="h2" color="primary" style={{ fontSize: 24 }}>
                            {!createMode
                                ? ReactHtmlParser(
                                    `Edit ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`,
                                )
                                : `Add a new ${selectedPublicationType}`}
                        </Typography>
                    </Grid>
                    <Hidden xsDown>
                        <Grid item xs="auto">
                            <FormViewToggler />
                        </Grid>
                    </Hidden>
                    {(record.fez_record_search_key_retracted || {}).rek_retracted === 1 && (
                        <Grid
                            container
                            alignContent="center"
                            justify="center"
                            alignItems="center"
                            style={{ marginBottom: 12 }}
                        >
                            <Grid item xs={12}>
                                <Alert message={txt.current.retractedMessage} type="warning" />
                            </Grid>
                        </Grid>
                    )}
                    <Hidden xsDown>
                        <Grid container spacing={0} direction="row">
                            {tabbed && (
                                <Grid item xs={12}>
                                    <Tabs
                                        value={currentTabValue}
                                        variant="fullWidth"
                                        style={{
                                            marginRight: -56,
                                            marginLeft: -56,
                                        }}
                                        classes={{
                                            indicator: classes.tabIndicator,
                                        }}
                                        onChange={handleTabChange}
                                        variant="scrollable"
                                        scrollButtons="on"
                                        indicatorColor="primary"
                                        textColor="primary"
                                    >
                                        {Object.keys(tabs)
                                            .filter(tab => tabs[tab].activated)
                                            .map(tab => (
                                                <Tab
                                                    key={tab}
                                                    value={tab}
                                                    label={
                                                        !!tabs[tab].numberOfErrors ? (
                                                            <Badge
                                                                className={classes.padding}
                                                                color="error"
                                                                badgeContent={tabs[tab].numberOfErrors}
                                                            >
                                                                {txt.current.sections[tab].title}
                                                            </Badge>
                                                        ) : (
                                                            txt.current.sections[tab].title
                                                        )
                                                    }
                                                />
                                            ))}
                                    </Tabs>
                                </Grid>
                            )}
                        </Grid>
                    </Hidden>
                </Grid>
                {/* --------------- Content here ---------------*/}
                <form>
                    <Grid container spacing={0}>
                        {!tabbed
                            ? Object.keys(tabs)
                                .filter(tab => tabs[tab].activated)
                                .map(renderTabContainer)
                            : renderTabContainer(currentTabValue)}
                    </Grid>
                    <Grid container spacing={8}>
                        {alertProps.current && (
                            <Grid item xs={12}>
                                <div style={{ height: 16 }} />
                                <Alert {...alertProps.current} />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Grid container spacing={8} style={{ marginTop: 8 }}>
                                <Grid item xs={12} sm={2}>
                                    <Button
                                        style={{ whiteSpace: 'nowrap' }}
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        children="Cancel"
                                        onClick={handleCancel}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                    <Button
                                        style={{ whiteSpace: 'nowrap' }}
                                        disabled={submitting || disableSubmit}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        children=" Submit "
                                        onClick={handleSubmit}
                                    />
                                </Grid>
                            </Grid>
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
    destroy: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object,
    tabs: PropTypes.object,
    createMode: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    formErrors: PropTypes.object,
    authorDetails: PropTypes.object,
};

export default React.memo(AdminInterface);
