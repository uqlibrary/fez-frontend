import React from 'react';
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
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import FormViewToggler from './FormViewToggler';
import TabContainer from './TabContainer';
import LockedAlert from './LockedAlert';
import { useTabbedContext, useRecordContext } from 'context';

import pageLocale from 'locale/pages';
import queryString from 'query-string';
import { validation, publicationTypes } from 'config';
import { RECORD_TYPE_RECORD, UNPUBLISHED, PUBLISHED } from 'config/general';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';
import { FORM_NAME } from '../constants';
import { routes } from 'config';
import { adminInterfaceConfig } from 'config/admin';
import { onSubmit } from '../submitHandler';

export const getQueryStringValue = (location, varName, initialValue) => {
    const queryStringObject = queryString.parse(
        location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        { ignoreQueryPrefix: true },
    );
    return (queryStringObject && queryStringObject[varName]) || initialValue;
};

export const navigateToSearchResult = (createMode, authorDetails, history, location) => {
    if (createMode) {
        history.push(routes.pathConfig.admin.add);
    }
    const navigatedFrom = getQueryStringValue(location, 'navigatedFrom', null);
    if (
        authorDetails &&
        (authorDetails.is_administrator === 1 || authorDetails.is_super_administrator === 1) &&
        !!navigatedFrom
    ) {
        history.push(decodeURIComponent(navigatedFrom));
    } else {
        history.push(routes.pathConfig.records.mine);
    }
};

export const AdminInterface = ({
    authorDetails,
    classes,
    createMode,
    isDeleted,
    destroy,
    dirty,
    disableSubmit,
    formErrors,
    handleSubmit,
    history,
    location,
    locked,
    submitSucceeded,
    submitting,
    tabs,
    unlockRecord,
}) => {
    const { record } = useRecordContext();
    const { tabbed } = useTabbedContext();
    const objectType = ((record || {}).rek_object_type_lookup || '').toLowerCase();
    const defaultTab = objectType === RECORD_TYPE_RECORD ? 'bibliographic' : 'security';
    const [currentTabValue, setCurrentTabValue] = React.useState(getQueryStringValue(location, 'tab', defaultTab));

    const successConfirmationRef = React.useRef();
    const alertProps = React.useRef(null);
    const txt = React.useRef(pageLocale.pages.edit);

    alertProps.current = validation.getErrorAlertProps({
        submitting,
        submitSucceeded,
        formErrors,
        alertLocale: txt.current.alerts,
    });

    React.useEffect(() => {
        return () => {
            destroy(FORM_NAME);
        };
    }, [destroy]);

    React.useEffect(() => {
        Cookies.set('adminFormTabbed', tabbed ? 'tabbed' : 'fullform');
    }, [tabbed]);

    React.useEffect(() => {
        if (!submitting && submitSucceeded && successConfirmationRef.current) {
            successConfirmationRef.current.showConfirmation();
        }
    }, [submitting, submitSucceeded]);

    const handleTabChange = (event, value) => setCurrentTabValue(value);

    const handleCancel = event => {
        event.preventDefault();
        const pushToHistory = () => history.push(routes.pathConfig.records.view(record.rek_pid));
        if (!!record.rek_pid) {
            /* istanbul ignore next */
            record.rek_editing_user === authorDetails.username
                ? unlockRecord(record.rek_pid, pushToHistory)
                : pushToHistory();
        } else {
            // Else this is a new record, so just go to the homepage
            history.push(routes.pathConfig.index);
        }
    };

    const setSuccessConfirmationRef = React.useCallback(node => {
        successConfirmationRef.current = node; // TODO: Add check that this worked
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

    const navigateToViewRecord = pid => {
        if (!!pid && validation.isValidPid(pid)) {
            history.push(routes.pathConfig.records.view(pid));
        }
    };

    const renderTabContainer = tab => (
        <TabContainer key={tab} value={tab} currentTab={currentTabValue} tabbed={tabbed}>
            <StandardCard
                standardCardId={`${txt.current.sections[tab].title.toLowerCase()}-section`}
                title={txt.current.sections[tab].title}
                primaryHeader
                squareTop
                smallTitle
            >
                <Field
                    component={tabs[tab].component}
                    disabled={submitting || (locked && record.rek_editing_user !== authorDetails.username)}
                    name={`${tab}Section`}
                />
            </StandardCard>
        </TabContainer>
    );

    const saveConfirmationLocale = createMode
        ? txt.current.successAddWorkflowConfirmation
        : txt.current.successWorkflowConfirmation;

    const pageTitlePrefix = !isDeleted ? 'Edit' : 'Undelete';

    const submitButtonTxt = !isDeleted ? 'Save' : 'Undelete';

    const setPublicationStatusAndSubmit = status =>
        handleSubmit((values, dispatch, props) =>
            onSubmit(values.setIn(['publication', 'rek_status'], status), dispatch, props),
        );

    return (
        <StandardPage>
            <React.Fragment>
                <Grid container spacing={0} direction="row" alignItems="center" style={{ marginTop: -24 }}>
                    <ConfirmDialogBox
                        onRef={setSuccessConfirmationRef}
                        onAction={() => navigateToSearchResult(createMode, authorDetails, history, location)}
                        locale={saveConfirmationLocale}
                        onCancelAction={() => navigateToViewRecord(record.rek_pid)}
                    />
                    <Grid item xs style={{ marginBottom: 12 }}>
                        <Typography variant="h2" color="primary" style={{ fontSize: 24 }}>
                            {!createMode
                                ? ReactHtmlParser(
                                      `${pageTitlePrefix} ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`,
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
                    {/* Admin lock alert */}
                    {!!locked && <LockedAlert handleCancel={handleCancel} />}
                    <Hidden xsDown>
                        <Grid container spacing={0} direction="row">
                            {tabbed && (
                                <Grid item xs={12}>
                                    <Tabs
                                        value={currentTabValue}
                                        variant="fullWidth"
                                        style={{
                                            marginRight: -40,
                                            marginLeft: -40,
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
                <ConfirmDiscardFormChanges dirty={dirty} submitSucceeded={submitSucceeded}>
                    <form>
                        <Grid container spacing={0}>
                            {!tabbed
                                ? Object.keys(tabs)
                                      .filter(tab => tabs[tab].activated)
                                      .map(renderTabContainer)
                                : renderTabContainer(currentTabValue)}
                        </Grid>
                        <Grid container spacing={1}>
                            {alertProps.current && (
                                <Grid item xs={12}>
                                    <div style={{ height: 16 }} />
                                    <Alert {...alertProps.current} />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Grid container spacing={1} style={{ marginTop: 8 }}>
                                    <Grid item xs={12} sm={2}>
                                        <Button
                                            id="admin-work-cancel"
                                            style={{ whiteSpace: 'nowrap' }}
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            children="Cancel"
                                            onClick={handleCancel}
                                        />
                                    </Grid>
                                    {!!record.rek_pid &&
                                        objectType === RECORD_TYPE_RECORD &&
                                        record.rek_status !== PUBLISHED &&
                                        !isDeleted && (
                                            <Grid item xs={12} sm={3}>
                                                <Button
                                                    id="admin-work-publish"
                                                    data-testid="publish-admin"
                                                    disabled={!!submitting || !!disableSubmit || !!locked}
                                                    variant="contained"
                                                    color="secondary"
                                                    fullWidth
                                                    children="Publish"
                                                    onClick={setPublicationStatusAndSubmit(PUBLISHED)}
                                                />
                                            </Grid>
                                        )}
                                    {!!record.rek_pid &&
                                        objectType === RECORD_TYPE_RECORD &&
                                        record.rek_status === PUBLISHED &&
                                        !isDeleted && (
                                            <Grid item xs={12} sm={3}>
                                                <Button
                                                    id="admin-work-unpublish"
                                                    data-testid="unpublish-admin"
                                                    disabled={!!submitting || !!disableSubmit || !!locked}
                                                    variant="contained"
                                                    color="secondary"
                                                    fullWidth
                                                    children="Unpublish"
                                                    onClick={setPublicationStatusAndSubmit(UNPUBLISHED)}
                                                />
                                            </Grid>
                                        )}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={
                                            !!record.rek_pid && objectType === RECORD_TYPE_RECORD && !isDeleted ? 7 : 10
                                        }
                                    >
                                        <Button
                                            id="admin-work-submit"
                                            data-testid="submit-admin"
                                            style={{ whiteSpace: 'nowrap' }}
                                            disabled={!!submitting || !!disableSubmit || !!locked}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            children={submitButtonTxt}
                                            onClick={handleSubmit}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </React.Fragment>
        </StandardPage>
    );
};

AdminInterface.propTypes = {
    authorDetails: PropTypes.object,
    classes: PropTypes.object,
    createMode: PropTypes.bool,
    isDeleted: PropTypes.bool,
    destroy: PropTypes.func,
    dirty: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    formErrors: PropTypes.object,
    handleSubmit: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    locked: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
    tabs: PropTypes.object,
    unlockRecord: PropTypes.func,
};

export default React.memo(AdminInterface);
