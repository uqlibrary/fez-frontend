import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import Immutable from 'immutable';

import locale from 'locale/pages';
import { NTRO_SUBTYPES, PUBLICATION_TYPE_MANUSCRIPT, PUBLICATION_TYPE_THESIS, SUBTYPE_NON_NTRO } from 'config/general';

import { makeStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider } from '@material-ui/core/styles';
import { adminTheme } from 'config';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import AdminInterface from './AdminInterface';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import AddSection from './add/AddSectionContainer';
import AdminSection from './admin/AdminSectionContainer';
import AuthorsSection from './authors/AuthorsSectionContainer';
import BibliographicSection from './bibliographic/BibliographicSectionContainer';
import FilesSection from './files/FilesSectionContainer';
import GrantInformationSection from './grantInformation/GrantInformationSectionContainer';
import IdentifiersSection from './identifiers/IdentifiersSectionContainer';
import NotesSection from './notes/NotesSection';
import NtroSection from './ntro/NtroSectionContainer';
import SecuritySection from './security/SecuritySectionContainer';
import { TabbedContext, RecordContext } from 'context';
import { RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY, RECORD_TYPE_RECORD } from 'config/general';
import { StandardPage } from '../../SharedComponents/Toolbox/StandardPage';

const useStyles = makeStyles(
    theme => ({
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
    }),
    { withTheme: true },
);

export const AdminContainer = ({
    authorDetails,
    clearRecordToView,
    createMode,
    destroy,
    dirty,
    disableSubmit,
    formErrors,
    formValues,
    handleSubmit,
    history,
    isDeleted,
    isJobCreated,
    loadingRecordToView,
    loadRecordToView,
    locked,
    match,
    recordToView,
    recordToViewError,
    submitSucceeded,
    submitting,
    unlockRecord,
}) => {
    const [tabbed, setTabbed] = React.useState(
        Cookies.get('adminFormTabbed') && Cookies.get('adminFormTabbed') === 'tabbed',
    );
    const [showAddForm, setShowAddForm] = React.useState(!match.params.pid);
    const classes = useStyles();
    const theme = useTheme();
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

    // Collections and Communities admin edit currently only has the Security tab, so don't act on errors in other tabs
    const reducedFormErrors = formErrors => {
        if (
            !!recordToView &&
            recordToView.rek_display_type_lookup &&
            (recordToView.rek_display_type_lookup.toLowerCase() === RECORD_TYPE_COMMUNITY ||
                recordToView.rek_display_type_lookup.toLowerCase() === RECORD_TYPE_COLLECTION)
        ) {
            return Object.keys(formErrors).reduce((result, key) => key === 'securitySection', {});
        }
        return formErrors;
    };

    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;

    const handleToggle = React.useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);

    const handleAddFormDisplay = React.useCallback(() => setShowAddForm(!showAddForm), [setShowAddForm, showAddForm]);

    React.useEffect(() => {
        !!match.params.pid && !!loadRecordToView && loadRecordToView(match.params.pid, true);
        return () => {
            clearRecordToView();
        };
    }, [loadRecordToView, clearRecordToView, match.params.pid]);

    const txt = locale.pages.edit;

    if (!!match.params.pid && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (!recordToView && isDeleted) {
        return (
            <StandardPage className="viewRecord" title={locale.pages.viewRecord.notFound.title}>
                <Grid container style={{ marginTop: -24 }}>
                    <Grid item xs={12}>
                        {locale.pages.viewRecord.notFound.message}
                    </Grid>
                </Grid>
                {recordToViewError && (
                    <Typography variant={'caption'} style={{ opacity: 0.5 }}>
                        {`(${recordToViewError.status} - ${recordToViewError.message})`}
                    </Typography>
                )}
            </StandardPage>
        );
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
            {createMode && showAddForm && (
                <AddSection onCreate={handleAddFormDisplay} createMode={createMode} history={history} />
            )}
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
                        <ThemeProvider theme={adminTheme}>
                            <AdminInterface
                                authorDetails={authorDetails}
                                classes={classes}
                                handleSubmit={handleSubmit}
                                submitting={submitting}
                                submitSucceeded={submitSucceeded}
                                dirty={dirty}
                                disableSubmit={disableSubmit}
                                history={history}
                                location={location}
                                createMode={createMode}
                                isDeleted={isDeleted}
                                isJobCreated={isJobCreated}
                                formErrors={reducedFormErrors(formErrors)}
                                destroy={destroy}
                                locked={locked}
                                disabled
                                unlockRecord={unlockRecord}
                                tabs={{
                                    admin: {
                                        component: AdminSection,
                                        activated: isActivated(),
                                        numberOfErrors: tabErrors.current.adminSection || null,
                                    },
                                    identifiers: {
                                        component: IdentifiersSection,
                                        activated: isActivated(),
                                    },
                                    bibliographic: {
                                        component: BibliographicSection,
                                        activated: isActivated(),
                                        numberOfErrors: tabErrors.current.bibliographicSection || null,
                                    },
                                    authors: {
                                        component: AuthorsSection,
                                        activated: isActivated(),
                                        numberOfErrors: tabErrors.current.authorsSection || null,
                                    },
                                    ntro: {
                                        component: NtroSection,
                                        activated:
                                            isActivated() &&
                                            NTRO_SUBTYPES.includes(
                                                !!formValues && (formValues.toJS().adminSection || {}).rek_subtype,
                                            ),
                                    },
                                    grants: {
                                        component: GrantInformationSection,
                                        activated:
                                            isActivated() &&
                                            // Blacklist types without grant info
                                            !(
                                                [PUBLICATION_TYPE_MANUSCRIPT, PUBLICATION_TYPE_THESIS].includes(
                                                    recordToView && recordToView.rek_display_type,
                                                ) ||
                                                [SUBTYPE_NON_NTRO].includes(
                                                    !!formValues && (formValues.toJS().adminSection || {}).rek_subtype,
                                                )
                                            ),
                                    },
                                    notes: {
                                        component: NotesSection,
                                        activated: isActivated(),
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
                                }}
                            />
                        </ThemeProvider>
                    </RecordContext.Provider>
                </TabbedContext.Provider>
            )}
        </React.Fragment>
    );
};

AdminContainer.propTypes = {
    actions: PropTypes.object,
    authorDetails: PropTypes.object,
    clearRecordToView: PropTypes.func,
    createMode: PropTypes.bool,
    destroy: PropTypes.func,
    dirty: PropTypes.bool,
    disableSubmit: PropTypes.any,
    formErrors: PropTypes.object,
    formValues: PropTypes.object,
    handleSubmit: PropTypes.func,
    history: PropTypes.object,
    loadingRecordToView: PropTypes.bool,
    loadRecordToView: PropTypes.func,
    recordToViewError: PropTypes.object,
    locked: PropTypes.bool,
    match: PropTypes.object,
    recordToView: PropTypes.object,
    isDeleted: PropTypes.bool,
    isJobCreated: PropTypes.bool,
    showAddForm: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.any,
    unlockRecord: PropTypes.func,
};

export function isSame(prevProps, nextProps) {
    return (
        prevProps.disableSubmit === nextProps.disableSubmit &&
        prevProps.submitting === nextProps.submitting &&
        prevProps.submitSucceeded === nextProps.submitSucceeded &&
        (prevProps.recordToView || {}).pid === (nextProps.recordToView || {}).pid &&
        (prevProps.recordToView || {}).rek_display_type === (nextProps.recordToView || {}).rek_display_type &&
        ((prevProps.formValues || Immutable.Map({})).toJS().adminSection || {}).rek_subtype ===
            ((nextProps.formValues || Immutable.Map({})).toJS().adminSection || {}).rek_subtype &&
        prevProps.loadingRecordToView === nextProps.loadingRecordToView &&
        prevProps.showAddForm === nextProps.showAddForm &&
        prevProps.formErrors === nextProps.formErrors &&
        prevProps.locked === nextProps.locked
    );
}

export default React.memo(AdminContainer, isSame);
