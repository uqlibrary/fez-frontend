/* eslint-disable no-unused-vars */
/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import locale from 'locale/pages';

import { ThemeProvider } from '@mui/material/styles';
import { adminTheme } from 'config';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import WorkNotFound from 'modules/NotFound/components/WorkNotFound';

import { JournalContext, TabbedContext } from 'context';
import { useIsMobileView } from 'hooks';
import { ADMIN_JOURNAL } from 'config/general';
import { validate } from 'config/journalAdmin';
import { onSubmit } from '../submitHandler';

import JournalAdminInterface from './JournalAdminInterface';
// import FilesSection from './files/FilesSectionContainer';
import AdminSection from './admin/AdminSectionContainer';
import BibliographicSection from './bibliographic/BibliographicSectionContainer';
import UqDataSection from './uqData/UqDataSection';
import DoajSection from './doaj/DoajSection';
import IndexedSection from './indexed/IndexedSection';

const validateResolver = async data => {
    const errors = validate(data);
    console.log('validate', data, errors);
    const hasErrors = Object.keys(errors).length > 0;
    return {
        values: hasErrors ? {} : data,
        errors: hasErrors ? { ...errors } : {},
    };
};

export const JournalAdminContainer = ({
    authorDetails,
    clearJournalToView,
    initialValues,
    journalToViewLoading,
    loadJournalToView,
    locked,
    journalToView,
    journalToViewError,
    journalLoadingError,
    unlockJournal,
    error,
}) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [tabbed, setTabbed] = React.useState(
        Cookies.get('adminFormTabbed') && Cookies.get('adminFormTabbed') === 'tabbed',
    );
    console.log({
        authorDetails,
        clearJournalToView,
        initialValues,
        journalToViewLoading,
        loadJournalToView,
        locked,
        journalToView,
        journalToViewError,
        journalLoadingError,
        unlockJournal,
        error,
    });
    const methods = useForm({
        values: { ...initialValues },
        shouldUnregister: false,
        mode: 'onChange',
        resolver: validateResolver,
    });

    // React.useEffect(() => {

    const data = methods.getValues();
    const handleSubmit = async (data, e) => {
        e.preventDefault();
        try {
            console.log(data, { initialValues, methods });
            await onSubmit(data, dispatch, { initialValues, methods });
        } catch (e) {
            console.log(e);
            // this is being set, but how do we use it?
            methods.setError('server', { type: 'custom', message: e.message });
        }
    };
    const formErrors = methods.formState.errors ?? {};
    const isMobileView = useIsMobileView();
    const tabErrors = React.useRef(null);
    tabErrors.current = Object.entries(formErrors || {}).reduce((numberOfErrors, [key, errorObject]) => {
        return {
            ...numberOfErrors,
            ...(!!errorObject ? { [key]: Object.values(errorObject).length } : {}),
        };
    }, {});

    const handleToggle = React.useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);

    React.useEffect(() => {
        !!id && !!loadJournalToView && loadJournalToView(id, true);
        return () => {
            console.log('unmount');
            clearJournalToView();
        };
    }, [loadJournalToView, clearJournalToView, id]);

    const txt = locale.pages.edit;

    if (!!id && journalToViewLoading) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (!!id && (!!!journalToView || journalLoadingError)) {
        return <WorkNotFound loadingError={journalToViewError} />;
    } else if (!id && !journalToView) {
        return <div className="empty" />;
    }

    const isActivated = () => {
        // this is here for potential future use
        return true;
    };
    const destroy = () => {};

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
                        <FormProvider {...methods}>
                            <JournalAdminInterface
                                journal={journalToView}
                                authorDetails={authorDetails}
                                handleSubmit={handleSubmit}
                                clearJournalToView={clearJournalToView}
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
                                    // files: {
                                    //     component: FilesSection,
                                    //     activated: isActivated(),
                                    //     numberOfErrors: tabErrors.current.filesSection || null,
                                    // },
                                }}
                            />
                        </FormProvider>
                    </ThemeProvider>
                </JournalContext.Provider>
            </TabbedContext.Provider>
        </React.Fragment>
    );
};

JournalAdminContainer.propTypes = {
    actions: PropTypes.object,
    authorDetails: PropTypes.object,
    initialValues: PropTypes.object,
    clearJournalToView: PropTypes.func,
    journalToViewLoading: PropTypes.bool,
    journalLoadingError: PropTypes.bool,
    loadJournalToView: PropTypes.func,
    journalToViewError: PropTypes.object,
    locked: PropTypes.bool,
    journalToView: PropTypes.object,
    unlockJournal: PropTypes.func,
    error: PropTypes.object,
};

export function isSame(prevProps, nextProps) {
    return (
        (prevProps.journalToView || {}).jnl_jid === (nextProps.journalToView || {}).jnl_jid &&
        prevProps.journalToViewLoading === nextProps.journalToViewLoading &&
        prevProps.locked === nextProps.locked
    );
}

export default React.memo(JournalAdminContainer, isSame);
