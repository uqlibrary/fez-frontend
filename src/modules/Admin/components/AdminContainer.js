import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

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
import { publicationTypes } from 'config';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';

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
    formValues,
    location,
    recordToView,
    loadRecordToView,
    loadingRecordToView,
    clearRecordToView,
    classes,
    submitting,
    submitSucceeded,
    disableSubmit,
    handleSubmit,
    match,
    history,
}) => {
    const [tabbed, setTabbed] = useState(Cookies.get('adminFormTabbed') && Cookies.get('adminFormTabbed') === 'tabbed');
    const theme = useTheme();

    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;

    /* istanbul ignore next */
    const handleToggle = useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);

    /* istanbul ignore next */
    /* Enzyme's shallow render doesn't support useEffect hook yet */
    React.useEffect(() => {
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

    const values = JSON.stringify(formValues);
    const displayType = formValues.get('rek_display_type');
    const selectedPublicationType = displayType && publicationTypes({ ...recordForms })[displayType];
    const hasSubtypes = !!(selectedPublicationType && selectedPublicationType.subtypes);
    const selectedSubType = formValues.get('rek_subtype');
    const additionalInformation = formValues.get('additionalInformationSection') || undefined;
    const showAddForm =
        !(!!match.params.pid && !!recordToView) &&
        (!(selectedPublicationType && selectedPublicationType.name) || // Doc type logic
        (!(hasSubtypes && selectedSubType) || !hasSubtypes) || // Subtype logic
            !!!(additionalInformation && additionalInformation.get('collections').length >= 1)); // collections logic

    const isActivated =
        (recordToView && recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
        (selectedPublicationType && selectedPublicationType.name.toLowerCase() === RECORD_TYPE_RECORD) ||
        null;

    console.log('values', values);
    console.log('--------------------------------------------');
    console.log('inital', !(!!match.params.pid && !!recordToView));
    console.log('showAddForm', showAddForm);
    console.log('displayType', displayType);
    console.log('hasSubtypes', hasSubtypes);
    console.log('selectedSubType', selectedSubType);
    console.log('doc type', selectedPublicationType && selectedPublicationType.name);
    console.log(
        'additionalInformationSection',
        !!additionalInformation && additionalInformation.get('collections').length >= 1,
    );
    console.log('--------------------------------------------');
    console.log('doctype:logic', !(selectedPublicationType && selectedPublicationType.name));
    console.log('subType:logic', !(hasSubtypes && selectedSubType) || !hasSubtypes);
    console.log(
        'collections:logic',
        !!!(additionalInformation && additionalInformation.get('collections').length >= 1),
    );
    console.log('--------------------------------------------');
    console.log('--------------------------------------------');
    return (
        <React.Fragment>
            {showAddForm && <AddSection formValues={values} />}
            {!showAddForm && (
                <TabbedContext.Provider
                    value={{
                        tabbed: isMobileView ? false : tabbed,
                        toggleTabbed: handleToggle,
                    }}
                >
                    <RecordContext.Provider value={{ record: recordToView }}>
                        <AdminInterface
                            classes={classes}
                            handleSubmit={handleSubmit}
                            submitting={submitting}
                            submitSucceeded={submitSucceeded}
                            disableSubmit={disableSubmit}
                            location={location}
                            history={history}
                            tabs={{
                                admin: {
                                    component: AdminSection,
                                    activated: isActivated,
                                },
                                identifiers: {
                                    component: IdentifiersSection,
                                    activated: isActivated,
                                },
                                bibliographic: {
                                    component: BibliographicSection,
                                    activated: isActivated,
                                },
                                authorDetails: {
                                    component: AuthorsSection,
                                    activated: isActivated,
                                },
                                additionalInformation: {
                                    component: AdditionalInformationSection,
                                    activated: isActivated,
                                },
                                ntro: {
                                    component: NtroSection,
                                    activated: isActivated && NTRO_SUBTYPES.includes(recordToView.rek_subtype),
                                },
                                grantInformation: {
                                    component: GrantInformationSection,
                                    activated:
                                        isActivated &&
                                        // Blacklist types without grant info
                                        ![PUBLICATION_TYPE_MANUSCRIPT, PUBLICATION_TYPE_THESIS].includes(
                                            recordToView.rek_display_type,
                                        ),
                                },
                                files: {
                                    component: FilesSection,
                                    activated: isActivated,
                                },
                                security: {
                                    component: SecuritySection,
                                    activated: true,
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
    formValues: PropTypes.object,
    recordToView: PropTypes.object,
    actions: PropTypes.object,
    location: PropTypes.object,
    classes: PropTypes.object,
    submitting: PropTypes.any,
    submitSucceeded: PropTypes.bool,
    disableSubmit: PropTypes.any,
    handleSubmit: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
};

export function isChanged(prevProps, nextProps) {
    return (
        prevProps.disableSubmit === nextProps.disableSubmit &&
        prevProps.submitting === nextProps.submitting &&
        prevProps.submitSucceeded === nextProps.submitSucceeded &&
        (prevProps.recordToView || {}).pid === (nextProps.recordToView || {}).pid &&
        prevProps.loadingRecordToView === nextProps.loadingRecordToView &&
        prevProps.formValues === nextProps.formValues
    );
}

export default React.memo(withStyles(styles, { withTheme: true })(AdminContainer), isChanged);
