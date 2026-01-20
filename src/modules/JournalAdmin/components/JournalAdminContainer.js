import React from 'react';
import Cookies from 'js-cookie';

import * as actions from 'actions';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FormProvider } from 'react-hook-form';
import locale from 'locale/pages';

import { ThemeProvider } from '@mui/material/styles';
import { adminTheme } from 'config';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import WorkNotFound from 'modules/NotFound/components/WorkNotFound';

import { JournalContext, TabbedContext } from 'context';
import { useIsMobileView, useValidatedForm } from 'hooks';
import { ADMIN_JOURNAL } from 'config/general';
import { onSubmit } from '../submitHandler';
import { validateResolver } from '../validators';

import JournalAdminInterface from './JournalAdminInterface';
import AdminSection from './admin/AdminSection';
import BibliographicSection from './bibliographic/BibliographicSection';
import UqDataSection from './uqData/UqDataSection';
import OpenAccessSection from './openAccess/OpenAccessSection';
import ListedSection from './listed/ListedSection';
import { useJournal } from '../hooks';
import ReadAndPublishSection from './readAndPublish/ReadAndPublishSection';

export const JournalAdminContainer = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [tabbed, setTabbed] = React.useState(
        Cookies.get('adminFormTabbed') && Cookies.get('adminFormTabbed') === 'tabbed',
    );

    const {
        journalToViewLoading,
        authorDetails,
        journalToView,
        journalToViewError,
        journalLoadingError,
        initialValues,
        locked,
        error,
    } = useJournal();

    const attributes = useValidatedForm({
        values: { ...initialValues },
        shouldUnregister: false,
        mode: 'onChange',
        resolver: validateResolver,
    });

    const handleSubmit = async (data, e) => {
        e.preventDefault();
        try {
            await onSubmit(data, dispatch, { setServerError: attributes.formState.setServerError });
        } catch (e) {
            /* istanbul ignore next */
            console.log(e);
            /* istanbul ignore next */
            attributes.setServerError(e);
        }
    };

    const isMobileView = useIsMobileView();
    const tabErrors = React.useRef(null);
    tabErrors.current = Object.entries(attributes.formState || /* istanbul ignore next */ {}).reduce(
        (numberOfErrors, [key, errorObject]) => {
            return {
                ...numberOfErrors,
                ...(!!errorObject ? { [key]: Object.values(errorObject).length } : /* istanbul ignore next */ {}),
            };
        },
        {},
    );

    const handleToggle = React.useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);

    React.useEffect(() => {
        !!id && dispatch(actions.loadJournal(id, true));
        return () => {
            dispatch(actions.adminJournalClear());
        };
    }, [dispatch, id]);

    const txt = locale.pages.edit;
    if (!!id && journalToViewLoading) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (!!id && (!!!journalToView || journalLoadingError)) {
        return <WorkNotFound loadingError={journalToViewError} />;
    } else if (!!!id || !!!journalToView) {
        return <div className="empty" />;
    }

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
                        <FormProvider {...attributes}>
                            <JournalAdminInterface
                                authorDetails={authorDetails}
                                handleSubmit={handleSubmit}
                                locked={locked}
                                disabled
                                error={error}
                                tabs={{
                                    admin: {
                                        component: AdminSection,
                                        numberOfErrors: tabErrors.current.adminSection || null,
                                    },
                                    bibliographic: {
                                        component: BibliographicSection,
                                        numberOfErrors: tabErrors.current.bibliographicSection || null,
                                    },
                                    readAndPublish: {
                                        component: ReadAndPublishSection,
                                        numberOfErrors: tabErrors.current.readAndPublishSection || null,
                                    },
                                    uqData: {
                                        component: UqDataSection,
                                        numberOfErrors: tabErrors.current.uqDataSection || null,
                                    },
                                    openAccess: {
                                        component: OpenAccessSection,
                                        numberOfErrors: tabErrors.current.openAccessSection || null,
                                    },
                                    listed: {
                                        component: ListedSection,
                                        numberOfErrors: tabErrors.current.listedSection || null,
                                    },
                                }}
                            />
                        </FormProvider>
                    </ThemeProvider>
                </JournalContext.Provider>
            </TabbedContext.Provider>
        </React.Fragment>
    );
};

export default React.memo(JournalAdminContainer);
