import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import Immutable from 'immutable';

import locale from 'locale/pages';
import { NTRO_SUBTYPES, PUBLICATION_TYPE_MANUSCRIPT, PUBLICATION_TYPE_THESIS } from 'config/general';

import { withStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/styles/useTheme';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import AdminInterface from './AdminInterface';

import SecuritySection from './security/SecuritySectionContainer';
import IdentifiersSection from './identifiers/IdentifiersSectionContainer';
import BibliographicSection from './bibliographic/BibliographicSectionContainer';
import AdminSection from './admin/AdminSectionContainer';
import AddSection from './add/AddSectionContainer';
import GrantInformationSection from './grantInformation/GrantInformaionSectionContainer';
import FilesSection from './files/FilesSectionContainer';
import AdditionalInformationSection from './additionalInformation/AdditionalInformationSectionContainer';
import NtroSection from './ntro/NtroSectionContainer';
import AuthorsSection from './authors/AuthorsSectionContainer';
import { TabbedContext, RecordContext } from 'context';
import { RECORD_TYPE_RECORD } from 'config/general';

const styles = theme => ({
    helpIcon: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        '&:hover': {
            opacity: 0.87,
        },
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.primary.main,
    },
    badgeMargin: {
        top: 8,
        left: 28,
        width: 12,
        height: 12,
        fontSize: 10,
        fontWeight: 'bold',
        backgroundColor: '#595959',
    },
});

export const AdminContainer = ({
    location,
    recordToView,
    loadingRecordToView,
    loadRecordToView,
    clearRecordToView,
    classes,
    submitting,
    submitSucceeded,
    disableSubmit,
    handleSubmit,
    match,
    history,
    createMode,
    formErrors,
}) => {
    const [tabbed, setTabbed] = useState(Cookies.get('adminFormTabbed') && Cookies.get('adminFormTabbed') === 'tabbed');
    const [showAddForm, setShowAddForm] = useState(!match.params.pid);
    const theme = useTheme();
    const tabErrors = useRef(null);

    tabErrors.current = Object.entries(
        (formErrors instanceof Immutable.Map && formErrors.toJS()) || formErrors || {},
    ).reduce(
        (numberOfErrors, [key, errorObject]) => ({
            ...numberOfErrors,
            [key]: Object.values(errorObject).length,
        }),
        {},
    );

    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;

    /* istanbul ignore next */
    const handleToggle = useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);

    /* istanbul ignore next */
    const handleAddFormDisplay = useCallback(() => setShowAddForm(!showAddForm), [setShowAddForm, showAddForm]);

    /* istanbul ignore next */
    /* Enzyme's shallow render doesn't support useEffect hook yet */
    useEffect(() => {
        if (!!match.params.pid && !!loadRecordToView) {
            loadRecordToView(match.params.pid);
        }

        return () => {
            clearRecordToView();
        };
    }, [loadRecordToView, clearRecordToView, match.params.pid]);

    const txt = locale.pages.edit;

    if (!!match.params.pid && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (!!match.params.pid && !recordToView) {
        return <div className="empty" />;
    }

    const isActivated = () => {
        if (recordToView && recordToView.rek_object_type_lookup) {
            return recordToView && recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD;
        }
        return false;
    };

    return (
        <React.Fragment>
            {createMode && showAddForm && <AddSection onCreate={handleAddFormDisplay} createMode={createMode} />}
            {!showAddForm && (
                <TabbedContext.Provider
                    value={{
                        tabbed: isMobileView ? false : tabbed,
                        toggleTabbed: handleToggle,
                    }}
                >
                    <RecordContext.Provider
                        value={{
                            record: recordToView,
                        }}
                    >
                        <AdminInterface
                            classes={classes}
                            handleSubmit={handleSubmit}
                            submitting={submitting}
                            submitSucceeded={submitSucceeded}
                            disableSubmit={disableSubmit}
                            location={location}
                            history={history}
                            createMode={createMode}
                            formErrors={formErrors}
                            tabs={{
                                admin: {
                                    component: AdminSection,
                                    activated: isActivated(),
                                },
                                identifiers: {
                                    component: IdentifiersSection,
                                    activated: isActivated(),
                                },
                                bibliographic: {
                                    component: BibliographicSection,
                                    activated: isActivated(),
                                    numberOfErrors: (tabErrors.current || {}).bibliographicSection || null,
                                },
                                authorDetails: {
                                    component: AuthorsSection,
                                    activated: isActivated(),
                                    numberOfErrors: (tabErrors.current || {}).authorsSection || null,
                                },
                                additionalInformation: {
                                    component: AdditionalInformationSection,
                                    activated: isActivated(),
                                    numberOfErrors: (tabErrors.current || {}).additionalInformationSection || null,
                                },
                                ntro: {
                                    component: NtroSection,
                                    activated:
                                        isActivated() &&
                                        NTRO_SUBTYPES.includes(recordToView && recordToView.rek_subtype),
                                },
                                grantInformation: {
                                    component: GrantInformationSection,
                                    activated:
                                        isActivated() &&
                                        // Blacklist types without grant info
                                        ![PUBLICATION_TYPE_MANUSCRIPT, PUBLICATION_TYPE_THESIS].includes(
                                            recordToView && recordToView.rek_display_type,
                                        ),
                                },
                                files: {
                                    component: FilesSection,
                                    activated: isActivated(),
                                    numberOfErrors: (tabErrors.current || {}).filesSection || null,
                                },
                                security: {
                                    component: SecuritySection,
                                    activated: !createMode, // true,
                                },
                            }}
                        />
                    </RecordContext.Provider>
                </TabbedContext.Provider>
            )}
        </React.Fragment>
    );
};

AdminContainer.propTypes = {
    loadingRecordToView: PropTypes.bool,
    loadRecordToView: PropTypes.func,
    clearRecordToView: PropTypes.func,
    createMode: PropTypes.bool,
    recordToView: PropTypes.object,
    actions: PropTypes.object,
    location: PropTypes.object,
    classes: PropTypes.object,
    submitting: PropTypes.any,
    submitSucceeded: PropTypes.bool,
    showAddForm: PropTypes.bool,
    disableSubmit: PropTypes.any,
    handleSubmit: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    formErrors: PropTypes.object,
};

export function isChanged(prevProps, nextProps) {
    return (
        prevProps.disableSubmit === nextProps.disableSubmit &&
        prevProps.submitting === nextProps.submitting &&
        prevProps.submitSucceeded === nextProps.submitSucceeded &&
        (prevProps.recordToView || {}).pid === (nextProps.recordToView || {}).pid &&
        (prevProps.recordToView || {}).rek_display_type === (nextProps.recordToView || {}).rek_display_type &&
        (prevProps.recordToView || {}).rek_subtype === (nextProps.recordToView || {}).rek_subtype &&
        prevProps.loadingRecordToView === nextProps.loadingRecordToView &&
        prevProps.showAddForm === nextProps.showAddForm &&
        prevProps.formErrors === nextProps.formErrors
    );
}

export default React.memo(withStyles(styles, { withTheme: true })(AdminContainer), isChanged);
