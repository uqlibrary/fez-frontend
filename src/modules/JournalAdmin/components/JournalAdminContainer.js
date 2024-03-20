/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import Immutable from 'immutable';

import locale from 'locale/pages';

import { ThemeProvider } from '@mui/material/styles';
import { adminTheme } from 'config';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import JournalAdminInterface from './JournalAdminInterface';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import AdminSection from './admin/AdminSectionContainer';
import BibliographicSection from './bibliographic/BibliographicSectionContainer';
import UqDataSection from './uqData/UqDataSection';
import DoajSection from './doaj/DoajSection';
import IndexedSection from './indexed/IndexedSection';

import { JournalContext, TabbedContext } from 'context';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { useIsMobileView } from 'hooks';
import { ADMIN_JOURNAL } from 'config/general';
import { useParams } from 'react-router-dom';

export const JournalAdminContainer = ({
    authorDetails,
    clearJournalToView,
    destroy,
    dirty,
    disableSubmit,
    formErrors,
    // eslint-disable-next-line no-unused-vars
    formValues,
    handleSubmit,
    journalToViewLoading,
    loadJournalToView,
    locked,
    journalToView,
    journalToViewError,
    journalLoadingError,
    submitSucceeded,
    submitting,
    unlockJournal,
    error,
}) => {
    const { id } = useParams();
    const [tabbed, setTabbed] = React.useState(
        Cookies.get('adminFormTabbed') && Cookies.get('adminFormTabbed') === 'tabbed',
    );

    const isMobileView = useIsMobileView();
    const tabErrors = React.useRef(null);
    tabErrors.current = Object.entries(
        (formErrors instanceof Immutable.Map && formErrors.toJS()) || formErrors || {},
    ).reduce(
        (numberOfErrors, [key, errorObject]) => ({
            ...numberOfErrors,
            [key]: Object.values(errorObject).length,
        }),
        {},
    );

    const handleToggle = React.useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);

    React.useEffect(() => {
        !!id && !!loadJournalToView && loadJournalToView(id, true);
        return () => {
            clearJournalToView();
        };
    }, [loadJournalToView, clearJournalToView, id]);

    const txt = locale.pages.edit;

    if (!!id && journalToViewLoading) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (!!id && (!!!journalToView || journalLoadingError)) {
        return (
            <StandardPage className="viewJournal" title={locale.pages.viewRecord.notFound.title}>
                <Grid container style={{ marginTop: -24 }}>
                    <Grid item xs={12}>
                        {locale.pages.viewRecord.notFound.message}
                    </Grid>
                </Grid>
                {journalToViewError && (
                    <Typography variant={'caption'} style={{ opacity: 0.5 }}>
                        {`(${journalToViewError.status} - ${journalToViewError.message})`}
                    </Typography>
                )}
            </StandardPage>
        );
    } else if (!id && !journalToView) {
        return <div className="empty" />;
    }

    const isActivated = () => {
        // this is here for potential future use
        return true;
    };

    return (
        <React.Fragment>
            <TabbedContext.Provider
                value={{
                    tabbed: isMobileView ? false : tabbed,
                    toggleTabbed: handleToggle,
                }}
            >
                <JournalContext.Provider
                    value={{
                        journalDetails: journalToView,
                        jnlDisplayType: ADMIN_JOURNAL,
                    }}
                >
                    <ThemeProvider theme={adminTheme}>
                        <JournalAdminInterface
                            authorDetails={authorDetails}
                            handleSubmit={handleSubmit}
                            submitting={submitting}
                            submitSucceeded={submitSucceeded}
                            clearJournalToView={clearJournalToView}
                            dirty={dirty}
                            disableSubmit={disableSubmit}
                            formErrors={formErrors}
                            destroy={destroy}
                            locked={locked}
                            disabled
                            unlockJournal={unlockJournal}
                            error={error}
                            tabs={{
                                admin: {
                                    component: AdminSection,
                                    numberOfErrors: tabErrors.current.adminSection || null,
                                    activated: isActivated(),
                                },
                                /* it would go here or something */
                                bibliographic: {
                                    component: BibliographicSection,
                                    numberOfErrors: tabErrors.current.bibliographicSection || null,
                                    activated: isActivated(),
                                },
                                uqData: {
                                    component: UqDataSection,
                                    numberOfErrors: tabErrors.current.uqDataSection || null,
                                    activated: isActivated(),
                                },
                                doaj: {
                                    component: DoajSection,
                                    numberOfErrors: tabErrors.current.doajSection || null,
                                    activated: isActivated(),
                                },
                                indexed: {
                                    component: IndexedSection,
                                    numberOfErrors: tabErrors.current.indexedSection || null,
                                    activated: isActivated(),
                                },
                            }}
                        />
                    </ThemeProvider>
                </JournalContext.Provider>
            </TabbedContext.Provider>
        </React.Fragment>
    );
};

JournalAdminContainer.propTypes = {
    actions: PropTypes.object,
    authorDetails: PropTypes.object,
    clearJournalToView: PropTypes.func,
    destroy: PropTypes.func,
    dirty: PropTypes.bool,
    disableSubmit: PropTypes.any,
    formErrors: PropTypes.object,
    formValues: PropTypes.object,
    handleSubmit: PropTypes.func,
    journalToViewLoading: PropTypes.bool,
    journalLoadingError: PropTypes.bool,
    loadJournalToView: PropTypes.func,
    journalToViewError: PropTypes.object,
    locked: PropTypes.bool,
    journalToView: PropTypes.object,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.any,
    unlockJournal: PropTypes.func,
    error: PropTypes.object,
};

export function isSame(prevProps, nextProps) {
    return (
        prevProps.disableSubmit === nextProps.disableSubmit &&
        prevProps.submitting === nextProps.submitting &&
        prevProps.submitSucceeded === nextProps.submitSucceeded &&
        (prevProps.journalToView || {}).jnl_jid === (nextProps.journalToView || {}).jnl_jid &&
        prevProps.journalToViewLoading === nextProps.journalToViewLoading &&
        prevProps.formErrors === nextProps.formErrors &&
        prevProps.locked === nextProps.locked
    );
}

export default React.memo(JournalAdminContainer, isSame);
