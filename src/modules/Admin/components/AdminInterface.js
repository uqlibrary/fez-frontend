import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { parseHtmlToJSX } from 'helpers/general';
import queryString from 'query-string';
import { styled } from '@mui/material/styles';
import * as actions from 'actions';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import * as Sentry from '@sentry/react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';
import {
    DOCUMENT_TYPES_LOOKUP,
    RECORD_TYPE_RECORD,
    RECORD_TYPE_COMMUNITY,
    RECORD_TYPE_COLLECTION,
    PUBLISHED,
    RETRACTED,
    UNPUBLISHED,
} from 'config/general';

import FormViewToggler from './FormViewToggler';
import TabContainer from './TabContainer';
import LockedAlert from './LockedAlert';

import { useRecordContext, useTabbedContext } from 'context';
import pageLocale from 'locale/pages';
import { pathConfig, publicationTypes, validation } from 'config';

import { adminInterfaceConfig } from 'config/admin';
import { useIsUserSuperAdmin } from 'hooks';
import { translateFormErrorsToText } from 'config/validation';

const AdminTab = styled(Tab)({
    minWidth: 84,
});
const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        height: 4,
        backgroundColor: theme.palette.primary.main,
    },
}));

export const getQueryStringValue = (location, varName, initialValue) => {
    const queryStringObject = queryString.parse(
        location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        { ignoreQueryPrefix: true },
    );
    return (queryStringObject && queryStringObject[varName]) || initialValue;
};

export const navigateToSearchResult = (createMode, authorDetails, navigate, location) => {
    if (createMode) {
        navigate(pathConfig.admin.add);
    }
    const navigatedFrom = getQueryStringValue(location, 'navigatedFrom', null);
    if (
        authorDetails &&
        (authorDetails.is_administrator === 1 || authorDetails.is_super_administrator === 1) &&
        !!navigatedFrom
    ) {
        navigate(decodeURIComponent(navigatedFrom));
    } else {
        navigate(pathConfig.records.mine);
    }
};

const getActiveTabs = tabs => Object.keys(tabs).filter(tab => tabs[tab].activated);

export const AdminInterface = ({
    authorDetails,
    handleSubmit: onSubmit,
    createMode,
    isDeleted,
    isJobCreated,
    locked,
    tabs,
    error,
}) => {
    const dispatch = useDispatch();
    const { record } = useRecordContext();

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { errors: formErrors, isSubmitting, isSubmitSuccessful, isDirty },
    } = useFormContext();

    const numErrors = Object.keys(formErrors).length;
    const disableSubmit = React.useMemo(() => {
        return (
            !!record &&
            !!record.rek_display_type &&
            typeof DOCUMENT_TYPES_LOOKUP[record.rek_display_type] !== 'undefined' &&
            numErrors > 0
        );
    }, [numErrors, record]);

    const { tabbed, toggleTabbed } = useTabbedContext();
    const isSuperAdmin = useIsUserSuperAdmin();
    const navigate = useNavigate();
    const location = useLocation();
    const objectType = ((record || {}).rek_object_type_lookup || '').toLowerCase();
    const defaultTab = objectType === RECORD_TYPE_RECORD ? 'bibliographic' : 'security';
    const [currentTabValue, setCurrentTabValue] = React.useState(getQueryStringValue(location, 'tab', defaultTab));

    const activeTabNames = React.useRef(getActiveTabs(tabs));
    const successConfirmationRef = React.useRef();
    const alertProps = React.useRef(null);
    const txt = React.useRef(pageLocale.pages.edit);

    const errorMessage = error && typeof error === 'object' ? ' ' : null;
    if (errorMessage) {
        Sentry.captureMessage(`Error happened: ${errorMessage}`);
    }
    alertProps.current = validation.getErrorAlertProps({
        submitting: isSubmitting,
        submitSucceeded: isSubmitSuccessful,
        formErrors,
        alertLocale: txt.current.alerts,
        // prioritise form errors
        error: translateFormErrorsToText(formErrors) ? null : errorMessage,
    });

    React.useEffect(() => {
        activeTabNames.current = getActiveTabs(tabs);
    }, [tabs]);

    React.useEffect(() => {
        Cookies.set('adminFormTabbed', tabbed ? 'tabbed' : 'fullform');
    }, [tabbed]);

    // clear form state on unmount, so the form state from admin edit form wont show up in the add form
    React.useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    React.useEffect(() => {
        if (!isSubmitting && isSubmitSuccessful && successConfirmationRef.current) {
            successConfirmationRef.current.showConfirmation();
        }
    }, [isSubmitting, isSubmitSuccessful]);

    const handleTabChange = (event, value) => setCurrentTabValue(value);

    const keyHandler = React.useCallback(
        event => {
            if (!!event && event.ctrlKey && event.key !== 'Control') {
                ((event.key === 'ArrowUp' && !tabbed) || (event.key === 'ArrowDown' && tabbed)) && toggleTabbed();
                const activeTabIndex = activeTabNames.current.indexOf(currentTabValue);
                if (event.key === 'ArrowLeft' && activeTabIndex > 0) {
                    setCurrentTabValue(activeTabNames.current[activeTabIndex - 1]);
                }
                if (event.key === 'ArrowRight' && activeTabIndex < activeTabNames.current.length - 1) {
                    setCurrentTabValue(activeTabNames.current[activeTabIndex + 1]);
                }
            }
        },
        [tabbed, toggleTabbed, currentTabValue],
    );

    React.useEffect(() => {
        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    });

    const navigateToViewRecord = pid => {
        if (!!pid && validation.isValidPid(pid)) {
            navigate(pathConfig.records.view(pid));
        }
    };

    const handleCancel = event => {
        event.preventDefault();
        const navigateToViewPage = () => navigate(pathConfig.records.view(record.rek_pid));
        if (!!record.rek_pid) {
            /* istanbul ignore next */
            record.rek_editing_user === authorDetails.username
                ? dispatch(actions.unlockRecord(record.rek_pid, navigateToViewPage))
                : navigateToViewPage();
        } else {
            // Else this is a new record, so just go to the homepage
            navigate(pathConfig.index);
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

    const renderTabContainer = tab => {
        const TabComponent = tabs[tab].component;
        const TabSubComponent = tabs[tab].subComponent?.component;
        return (
            <TabContainer key={tab} value={tab} currentTab={currentTabValue} tabbed={tabbed}>
                <StandardCard
                    standardCardId={`${txt.current.sections[tab].title.toLowerCase().replace(/ /g, '-')}-section`}
                    title={txt.current.sections[tab].title}
                    primaryHeader
                    squareTop
                    smallTitle
                >
                    <TabComponent
                        disabled={isSubmitting || (locked && record.rek_editing_user !== authorDetails.username)}
                        name={`${tab}Section`}
                    />
                </StandardCard>
                {TabSubComponent && (
                    <StandardCard
                        standardCardId={`${tabs[tab].subComponent.title.toLowerCase().replace(/ /g, '-')}-section`}
                        title={tabs[tab].subComponent.title}
                        primaryHeader
                        squareTop
                        smallTitle
                    >
                        <TabSubComponent
                            disabled={
                                isSubmitting ||
                                (locked &&
                                    /* istanbul ignore  next */ record.rek_editing_user !== authorDetails.username)
                            }
                            name={`${tab}Section`}
                        />
                    </StandardCard>
                )}
            </TabContainer>
        );
    };

    const saveConfirmationLocale = createMode
        ? txt.current.successAddWorkflowConfirmation
        : (!isJobCreated && txt.current.successWorkflowConfirmation) || txt.current.successJobCreatedConfirmation;

    const pageTitlePrefix = !isDeleted ? 'Edit' : 'Undelete';

    const submitButtonTxt = !isDeleted ? 'Save' : 'Undelete';

    const setPublicationStatusAndSubmit = status => () => {
        setValue('publication.rek_status', status);
        handleSubmit(onSubmit)();
    };

    const renderButtonBar = (placement = '') => (
        <React.Fragment>
            <Grid item xs={12} sm={2}>
                <Button
                    id={`admin-work-cancel${placement}`}
                    data-analyticsid={`admin-work-cancel${placement}`}
                    data-testid={`admin-work-cancel${placement}`}
                    style={{ whiteSpace: 'nowrap' }}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    children="Cancel"
                    onClick={handleCancel}
                />
            </Grid>

            {!!isSuperAdmin &&
                record.rek_status !== RETRACTED &&
                objectType !== RECORD_TYPE_COMMUNITY &&
                objectType !== RECORD_TYPE_COLLECTION && (
                    <Grid item xs={12} sm={3}>
                        <Button
                            id={`admin-work-retract${placement}`}
                            data-analyticsid={`retract-admin${placement}`}
                            data-testid={`retract-admin${placement}`}
                            disabled={!!isSubmitting || !!disableSubmit}
                            variant="contained"
                            color="secondary"
                            fullWidth
                            children="Retract"
                            onClick={setPublicationStatusAndSubmit(RETRACTED)}
                        />
                    </Grid>
                )}
            {!!record.rek_pid && objectType === RECORD_TYPE_RECORD && record.rek_status !== PUBLISHED && !isDeleted && (
                <Grid item xs={12} sm={3}>
                    <Button
                        id={`admin-work-publish${placement}`}
                        data-analyticsid={`publish-admin${placement}`}
                        data-testid={`publish-admin${placement}`}
                        disabled={
                            !!isSubmitting ||
                            !!disableSubmit ||
                            (locked && record.rek_editing_user !== authorDetails.username)
                        }
                        variant="contained"
                        color="secondary"
                        fullWidth
                        children="Publish"
                        onClick={setPublicationStatusAndSubmit(PUBLISHED)}
                    />
                </Grid>
            )}
            {!!record.rek_pid && objectType === RECORD_TYPE_RECORD && record.rek_status === PUBLISHED && !isDeleted && (
                <Grid item xs={12} sm={3}>
                    <Button
                        id={`admin-work-unpublish${placement}`}
                        data-analyticsid={`unpublish-admin${placement}`}
                        data-testid={`unpublish-admin${placement}`}
                        disabled={
                            !!isSubmitting ||
                            !!disableSubmit ||
                            (locked && record.rek_editing_user !== authorDetails.username)
                        }
                        variant="contained"
                        color="secondary"
                        fullWidth
                        children="Unpublish"
                        onClick={setPublicationStatusAndSubmit(UNPUBLISHED)}
                    />
                </Grid>
            )}
            <Grid item xs={12} sm>
                <Button
                    id={`admin-work-submit${placement}`}
                    data-analyticsid={`submit-admin${placement}`}
                    data-testid={`submit-admin${placement}`}
                    style={{ whiteSpace: 'nowrap' }}
                    disabled={
                        !!isSubmitting ||
                        !!disableSubmit ||
                        (locked && record.rek_editing_user !== authorDetails.username)
                    }
                    variant="contained"
                    color="primary"
                    fullWidth
                    children={submitButtonTxt}
                    onClick={!isDeleted ? handleSubmit(onSubmit) : setPublicationStatusAndSubmit(UNPUBLISHED)}
                />
            </Grid>
        </React.Fragment>
    );

    const renderSaveStatusAlert = (
        <React.Fragment>
            {alertProps.current && (
                <Grid item xs={12}>
                    <div style={{ height: 16 }} />
                    <Alert {...alertProps.current} />
                </Grid>
            )}
        </React.Fragment>
    );

    return (
        <StandardPage>
            <form>
                <Grid container spacing={0} direction="row" alignItems="center" style={{ marginTop: -24 }}>
                    <ConfirmDialogBox
                        onRef={setSuccessConfirmationRef}
                        onAction={() => navigateToSearchResult(createMode, authorDetails, navigate, location)}
                        locale={saveConfirmationLocale}
                        onCancelAction={() => navigateToViewRecord(record.rek_pid)}
                    />
                    <Grid item xs style={{ marginBottom: 12 }}>
                        <Typography variant="h2" color="primary" style={{ fontSize: 18, fontWeight: 400 }}>
                            {!createMode
                                ? parseHtmlToJSX(
                                      `${pageTitlePrefix} ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`,
                                  )
                                : `Add a new ${selectedPublicationType}`}
                        </Typography>
                    </Grid>
                    <Grid item xs="auto" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <FormViewToggler />
                    </Grid>
                    {record.rek_status === RETRACTED && (
                        <Grid
                            container
                            alignContent="center"
                            justifyContent="center"
                            alignItems="center"
                            style={{ marginBottom: 12 }}
                        >
                            <Grid item xs={12}>
                                <Alert message={txt.current.retractedMessage} type="warning" />
                            </Grid>
                        </Grid>
                    )}
                    {/* Admin lock alert */}
                    {!!locked && <LockedAlert />}
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Grid container spacing={1} style={{ marginBottom: 8, marginTop: 4 }}>
                                {renderButtonBar('-top')}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} direction="row" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        {tabbed && (
                            <Grid item xs={12}>
                                <StyledTabs
                                    value={currentTabValue}
                                    onChange={handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                >
                                    {activeTabNames.current.map(tab => (
                                        <AdminTab
                                            key={tab}
                                            value={tab}
                                            data-analyticsid={`${tab}-tab`}
                                            data-testid={`${tab}-tab`}
                                            label={
                                                !!tabs[tab].numberOfErrors ? (
                                                    <Badge color="error" badgeContent={tabs[tab].numberOfErrors}>
                                                        {txt.current.sections[tab].title}
                                                    </Badge>
                                                ) : (
                                                    txt.current.sections[tab].title
                                                )
                                            }
                                        />
                                    ))}
                                </StyledTabs>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <ConfirmDiscardFormChanges dirty={isDirty} isSubmitSuccessful={isSubmitSuccessful}>
                    <Grid container spacing={0}>
                        {!tabbed ? activeTabNames.current.map(renderTabContainer) : renderTabContainer(currentTabValue)}
                    </Grid>
                    <Grid container spacing={1}>
                        {renderSaveStatusAlert}
                        <Grid item xs={12}>
                            <Grid container spacing={1} style={{ marginTop: 8 }}>
                                {renderButtonBar()}
                            </Grid>
                        </Grid>
                    </Grid>
                </ConfirmDiscardFormChanges>
            </form>
        </StandardPage>
    );
};

AdminInterface.propTypes = {
    authorDetails: PropTypes.object,
    createMode: PropTypes.bool,
    isDeleted: PropTypes.bool,
    isJobCreated: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    handleSubmit: PropTypes.func,
    locked: PropTypes.bool,
    tabs: PropTypes.object,
    error: PropTypes.object,
};

export default React.memo(AdminInterface);
