import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { useFormContext } from 'react-hook-form';

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

export const navigateToSearchResult = (authorDetails, navigate) => {
    navigate(pathConfig.journals.search);
};

export const JournalAdminInterface = ({ authorDetails, handleSubmit: onSubmit, locked, tabs, error }) => {
    const { journalDetails: journal } = useJournalContext();

    const {
        handleSubmit,
        formState: { errors: formErrors, isSubmitting, isSubmitSuccessful, isDirty },
    } = useFormContext();

    const numErrors = Object.keys(formErrors).length;
    const disableSubmit = React.useMemo(() => {
        return !!journal && numErrors > 0;
    }, [journal, numErrors]);

    const navigate = useNavigate();
    const location = useLocation();

    const { tabbed, toggleTabbed } = useTabbedContext();
    const defaultTab = 'admin';
    const [currentTabValue, setCurrentTabValue] = React.useState(getQueryStringValue(location, 'tab', defaultTab));

    const activeTabNames = React.useRef(Object.keys(tabs));
    const successConfirmationRef = React.useRef();
    const alertProps = React.useRef(null);
    const txt = React.useRef(pageLocale.pages.edit);

    const errorMessage = error && typeof error === 'object' ? ' ' : null;

    alertProps.current = validation.getErrorAlertProps({
        isSubmitting,
        isSubmitSuccessful,
        formErrors,
        alertLocale: txt.current.alerts,
        // prioritise form errors
        error: translateFormErrorsToText(formErrors?.server || /* istanbul ignore next */ {}) ? null : errorMessage,
    });

    React.useEffect(() => {
        Cookies.set('adminJournalFormTabbed', tabbed ? 'tabbed' : 'fullform');
    }, [tabbed]);

    React.useEffect(() => {
        if (!isSubmitting && isSubmitSuccessful && successConfirmationRef.current) {
            successConfirmationRef.current.showConfirmation();
        }
    }, [isSubmitting, isSubmitSuccessful]);

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
        const TabComponent = tabs[tab].component;
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
                        disabled={isSubmitting || (locked && journal.jnl_editing_user !== authorDetails.username)}
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
                        !!isSubmitting ||
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <ConfirmDiscardFormChanges dirty={isDirty} submitSucceeded={isSubmitSuccessful}>
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
    disableSubmit: PropTypes.bool,
    handleSubmit: PropTypes.func,
    locked: PropTypes.bool,
    tabs: PropTypes.object,
    error: PropTypes.object,
};

export default React.memo(JournalAdminInterface);
