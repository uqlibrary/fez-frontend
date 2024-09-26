/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { useFormContext, useWatch } from 'react-hook-form';

import { parseHtmlToJSX } from 'helpers/general';
import queryString from 'query-string';
import { styled } from '@mui/material/styles';

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

import FormViewToggler from './FormViewToggler';
import TabContainer from './TabContainer';
import LockedAlert from './LockedAlert';

import { useJournalContext, useTabbedContext } from 'context';
import pageLocale from 'locale/pages';
import { pathConfig, validation } from 'config';
import { translateFormErrorsToText } from 'config/validation';
import { useNavigate, useLocation } from 'react-router-dom';
import { validate } from 'config/journalAdmin';

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

export const navigateToSearchResult = (authorDetails, navigate /* , location*/) => {
    navigate(pathConfig.journals.search);
};

const getActiveTabs = tabs => Object.keys(tabs).filter(tab => tabs[tab].activated);
const useFormValues = () => {
    const { getValues, setError } = useFormContext();
    // setError('root', validate(getValues()));
    return {
        ...useWatch(), // subscribe to form value updates
        ...getValues(), // always merge with latest form values
    };
};

export const JournalAdminInterface = ({
    authorDetails,
    disableSubmit,
    handleSubmit: onSubmit,
    locked,
    tabs,
    error,
    dirty,
}) => {
    console.log(dirty);

    const methods = useFormContext();
    const values = useFormValues();
    const formErrors = methods.formState.errors ?? {};
    console.log(values, methods.formState.errors);
    const submitting = methods.formState.isSubmitting;
    const submitSucceeded = methods.formState.isSubmitSuccessful;

    // const dispatch = useDispatch();
    const { journalDetails: journal } = useJournalContext();
    const navigate = useNavigate();
    const location = useLocation();

    const { tabbed, toggleTabbed } = useTabbedContext();
    const defaultTab = 'admin';
    const [currentTabValue, setCurrentTabValue] = React.useState(getQueryStringValue(location, 'tab', defaultTab));

    const activeTabNames = React.useRef(getActiveTabs(tabs));
    const successConfirmationRef = React.useRef();
    const alertProps = React.useRef(null);
    const txt = React.useRef(pageLocale.pages.edit);

    const errorMessage = error && typeof error === 'object' ? ' ' : null;

    alertProps.current = validation.getErrorAlertProps({
        submitting,
        submitSucceeded,
        formErrors: Object.keys(formErrors).length === 0 ? null : formErrors,
        alertLocale: txt.current.alerts,
        // prioritise form errors
        error: translateFormErrorsToText(formErrors) ? null : errorMessage,
    });

    React.useEffect(() => {
        activeTabNames.current = getActiveTabs(tabs);
    }, [tabs]);

    React.useEffect(() => {
        Cookies.set('adminJournalFormTabbed', tabbed ? 'tabbed' : 'fullform');
    }, [tabbed]);

    // clear form state on unmount, so the form state from admin edit form wont show up in the add form
    // React.useEffect(() => {
    //     return () => {
    //         dispatch(destroy(FORM_NAME));
    //     };
    // }, [dispatch]);

    React.useEffect(() => {
        if (!submitting && submitSucceeded && successConfirmationRef.current) {
            successConfirmationRef.current.showConfirmation();
        }
    }, [submitting, submitSucceeded]);

    const handleTabChange = (event, value) => setCurrentTabValue(value);

    const keyHandler = React.useCallback(
        event => {
            /* istanbul ignore else */
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

    const handleCancel = event => {
        event.preventDefault();
        const navigateTo = () => navigate(pathConfig.journal.view(journal.jnl_jid));

        const navigatedFrom = getQueryStringValue(location, 'navigatedFrom', null);
        if (
            authorDetails &&
            (authorDetails.is_administrator === 1 ||
                /* istanbul ignore next */ authorDetails.is_super_administrator === 1) &&
            !!navigatedFrom
        ) {
            navigate(decodeURIComponent(navigatedFrom));
        } else {
            navigateTo();
        }
    };

    const setSuccessConfirmationRef = React.useCallback(node => {
        successConfirmationRef.current = node; // TODO: Add check that this worked
    }, []);

    if (!journal) {
        return <div className="empty" />;
    }

    const navigateToViewJournal = id => {
        navigate(pathConfig.journal.view(id));
    };

    const renderTabContainer = tab => {
        const Field = tabs[tab].component;
        console.log('tab container');
        return (
            <TabContainer key={tab} value={tab} currentTab={currentTabValue} tabbed={tabbed}>
                <StandardCard
                    standardCardId={`${txt.current.sections[tab].title.toLowerCase().replace(/ /g, '-')}-section`}
                    title={txt.current.sections[tab].title}
                    primaryHeader
                    squareTop
                    smallTitle
                >
                    <Field
                        disabled={submitting || (locked && journal.jnl_editing_user !== authorDetails.username)}
                        name={`${tab}Section`}
                    />
                </StandardCard>
            </TabContainer>
        );
    };

    const saveConfirmationLocale = txt.current.successWorkflowConfirmation;

    const pageTitlePrefix = 'Edit';

    const submitButtonTxt = 'Save';

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

            <Grid item xs={12} sm>
                <Button
                    id={`admin-work-submit${placement}`}
                    data-analyticsid={`submit-admin${placement}`}
                    data-testid={`submit-admin${placement}`}
                    style={{ whiteSpace: 'nowrap' }}
                    disabled={
                        !!submitting ||
                        !!disableSubmit ||
                        (locked && journal.jnl_editing_user !== authorDetails.username)
                    }
                    variant="contained"
                    color="primary"
                    fullWidth
                    children={submitButtonTxt}
                    type="submit"
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
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid container spacing={0} direction="row" alignItems="center" style={{ marginTop: -24 }}>
                    <ConfirmDialogBox
                        onRef={setSuccessConfirmationRef}
                        onAction={() => navigateToSearchResult(authorDetails, navigate, location)}
                        locale={saveConfirmationLocale}
                        onCancelAction={() => navigateToViewJournal(journal.jnl_jid)}
                    />
                    <Grid item xs style={{ marginBottom: 12 }}>
                        <Typography variant="h2" color="primary" style={{ fontSize: 18, fontWeight: 400 }}>
                            {parseHtmlToJSX(`${pageTitlePrefix} journal - ${journal.jnl_title}`)}
                        </Typography>
                    </Grid>
                    <Grid item xs="auto" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <FormViewToggler />
                    </Grid>
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
                <ConfirmDiscardFormChanges dirty={dirty} submitSucceeded={submitSucceeded}>
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

JournalAdminInterface.propTypes = {
    authorDetails: PropTypes.object,
    createMode: PropTypes.bool,
    isDeleted: PropTypes.bool,
    isJobCreated: PropTypes.bool,
    dirty: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    formErrors: PropTypes.object,
    handleSubmit: PropTypes.func,
    locked: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
    tabs: PropTypes.object,
    error: PropTypes.object,
};

export default React.memo(JournalAdminInterface);
