import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import * as actions from 'actions';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FormProvider } from 'react-hook-form';

import locale from 'locale/pages';
import {
    NTRO_SUBTYPES,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_INSTRUMENT,
    PUBLICATION_TYPE_MANUSCRIPT,
    PUBLICATION_TYPE_THESIS,
    RECORD_TYPE_COLLECTION,
    RECORD_TYPE_COMMUNITY,
    RECORD_TYPE_RECORD,
    SUBTYPE_NON_NTRO,
} from 'config/general';

import { ThemeProvider } from '@mui/material/styles';
import { adminTheme } from 'config';

import { onSubmit } from '../submitHandler';
import { useRecord, useRecordToView, useFormOnChangeHook } from '../hooks';
import { RecordContext, TabbedContext } from 'context';
import { useIsMobileView, useValidatedForm } from '../../../hooks';
import { useFormValidator } from '../validators';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import AdminInterface from './AdminInterface';

import AddSection from './add/AddSection';
import AdminSection from './admin/AdminSection';
import BibliographicSection from './bibliographic/BibliographicSection';
import FilesSection from './files/FilesSection';
import IdentifiersSection from './identifiers/IdentifiersSection';
import NotesSection from './notes/NotesSection';
import ReasonSection from './reason/ReasonSection';
import SecuritySection from './security/SecurityCard';
import RelatedServicesSection from './relatedServices/RelatedServicesSection';
import WorkNotFound from 'modules/NotFound/components/WorkNotFound';

import AuthorsSection from './authors/AuthorsSection';
import GrantInformationSection from './grantInformation/GrantInformationSection';
import NtroSection from './ntro/NtroSection';

export const AdminContainer = ({ createMode = false }) => {
    const dispatch = useDispatch();
    const { pid } = useParams();

    const {
        loadingRecordToView,
        authorDetails,
        recordToView: record,
        isDeleted,
        isJobCreated,
        recordToViewError,
        initialValues,
        locked,
        error: apiUpdateError,
    } = useRecord(createMode);

    const form = useValidatedForm({
        values: { ...initialValues },
        shouldUnregister: false,
        criteriaMode: 'all',
        mode: 'onChange',
        // errors // can we use this to handle tab errors?
    });

    const recordToView = useRecordToView(record, createMode, form);
    useFormOnChangeHook(form);
    const { errors: formErrors } = useFormValidator(form);

    const handleSubmit = async data => {
        try {
            await onSubmit(data, dispatch, { setServerError: form.setServerError, params: { pid } });
        } catch (e) {
            /* istanbul ignore next */
            console.log(e);
            /* istanbul ignore next */
            form.setServerError(form.setError, e);
        }
    };

    const [tabbed, setTabbed] = React.useState(
        Cookies.get('adminFormTabbed') && Cookies.get('adminFormTabbed') === 'tabbed',
    );
    const [showAddForm, setShowAddForm] = React.useState(!pid);

    const isMobileView = useIsMobileView();
    const tabErrors = React.useRef(null);

    tabErrors.current = Object.entries(formErrors || /* istanbul ignore next */ {}).reduce(
        (numberOfErrors, [key, errorObject]) => {
            return {
                ...numberOfErrors,
                ...(!!errorObject ? { [key]: Object.values(errorObject).length } : /* istanbul ignore next */ {}),
            };
        },
        {},
    );

    const handleToggle = React.useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);
    const toggleObject = React.useMemo(() => ({ tabbed: isMobileView ? false : tabbed, toggleTabbed: handleToggle }), [
        isMobileView,
        tabbed,
        handleToggle,
    ]);

    const handleAddFormDisplay = React.useCallback(() => setShowAddForm(!showAddForm), [setShowAddForm, showAddForm]);

    React.useEffect(() => {
        !!pid && dispatch(actions.loadRecordToView(pid, true));
        return () => {
            form.reset();
            dispatch(actions.clearRecordToView());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid]);

    React.useEffect(() => {
        if (createMode) {
            setShowAddForm(true);
        } else {
            setShowAddForm(false);
        }
    }, [createMode]);

    const txt = locale.pages.edit;
    if (!!pid && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (!recordToView) {
        return <WorkNotFound loadingError={recordToViewError} />;
    }

    const isActivated = () => {
        if (recordToView && recordToView.rek_object_type_lookup) {
            return recordToView && recordToView.rek_object_type_lookup?.toLowerCase() === RECORD_TYPE_RECORD;
        }
        return false;
    };

    return (
        <FormProvider {...form}>
            {createMode && showAddForm && <AddSection onCreate={handleAddFormDisplay} createMode={createMode} />}
            {!showAddForm && (
                <TabbedContext.Provider value={{ ...toggleObject }}>
                    <RecordContext.Provider
                        value={{
                            record: recordToView,
                        }}
                    >
                        <ThemeProvider theme={adminTheme}>
                            <AdminInterface
                                authorDetails={authorDetails}
                                handleSubmit={handleSubmit}
                                createMode={createMode}
                                isDeleted={isDeleted}
                                isJobCreated={isJobCreated}
                                locked={locked}
                                disabled
                                error={apiUpdateError}
                                formErrors={formErrors}
                                tabs={{
                                    admin: {
                                        component: AdminSection,
                                        activated:
                                            isActivated() ||
                                            [RECORD_TYPE_COLLECTION].includes(
                                                recordToView && recordToView.rek_object_type_lookup?.toLowerCase(),
                                            ),
                                        numberOfErrors: tabErrors.current.adminSection || null,
                                    },
                                    bibliographic: {
                                        component: BibliographicSection,
                                        activated:
                                            isActivated() ||
                                            [RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY].includes(
                                                recordToView && recordToView.rek_object_type_lookup?.toLowerCase(),
                                            ),
                                        numberOfErrors: tabErrors.current.bibliographicSection || null,
                                    },
                                    authors: {
                                        component: AuthorsSection,
                                        activated: isActivated(),
                                        numberOfErrors: tabErrors.current.authorsSection || null,
                                        subComponent: {
                                            title: 'NTRO',
                                            component: NTRO_SUBTYPES.includes(
                                                form.getValues('adminSection.rek_subtype'),
                                            )
                                                ? NtroSection
                                                : null,
                                        },
                                    },
                                    identifiers: {
                                        component: IdentifiersSection,
                                        activated: isActivated(),
                                    },
                                    grants: {
                                        component: GrantInformationSection,
                                        activated:
                                            isActivated() &&
                                            // Blacklist types without grant info
                                            !(
                                                [
                                                    PUBLICATION_TYPE_MANUSCRIPT,
                                                    PUBLICATION_TYPE_THESIS,
                                                    PUBLICATION_TYPE_INSTRUMENT,
                                                ].includes(recordToView && recordToView.rek_display_type) ||
                                                [SUBTYPE_NON_NTRO].includes(form.getValues('adminSection.rek_subtype'))
                                            ),
                                    },
                                    relatedServices: {
                                        component: RelatedServicesSection,
                                        activated:
                                            isActivated() &&
                                            [PUBLICATION_TYPE_DATA_COLLECTION].includes(
                                                recordToView && recordToView.rek_display_type,
                                            ),
                                    },
                                    notes: {
                                        component: NotesSection,
                                        activated:
                                            isActivated() ||
                                            [RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY].includes(
                                                recordToView && recordToView.rek_object_type_lookup?.toLowerCase(),
                                            ),
                                    },
                                    files: {
                                        component: FilesSection,
                                        activated: isActivated(),
                                        numberOfErrors: tabErrors.current.filesSection || null,
                                    },
                                    security: {
                                        component: SecuritySection,
                                        activated: !createMode, // true,
                                    },

                                    reason: {
                                        component: ReasonSection,
                                        activated:
                                            !createMode &&
                                            [RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY].includes(
                                                recordToView && recordToView.rek_object_type_lookup?.toLowerCase(),
                                            ),
                                    },
                                }}
                            />
                        </ThemeProvider>
                    </RecordContext.Provider>
                </TabbedContext.Provider>
            )}
        </FormProvider>
    );
};

AdminContainer.propTypes = {
    createMode: PropTypes.bool,
};

export default React.memo(AdminContainer);
