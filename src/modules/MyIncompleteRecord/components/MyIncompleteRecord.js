import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { useConfirmationState, userIsAdmin, useValidatedForm } from 'hooks';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { NtroFields } from 'modules/SharedComponents/Toolbox/NtroFields';

import { validation, pathConfig, incompleteRecord } from 'config';
import { default as pagesLocale } from '../locale';
import { default as formsLocale } from 'locale/forms';
import { default as viewRecordLocale } from 'locale/viewRecord';
import { default as alertLocale } from 'locale/publicationForm';
import { useNavigate, useParams } from 'react-router-dom';
import { authorAffiliationRequired } from '../../../config/validation';
import { locale } from '../../../locale';
import {
    AFFILIATION_TYPE_NOT_UQ,
    AFFILIATION_TYPE_UQ,
    CPEE_NTRO_SUBTYPES,
    DOCUMENT_TYPE_BOOK_CHAPTER,
    DOCUMENT_TYPE_JOURNAL_ARTICLE,
    LP_NTRO_SUBTYPES,
    NTRO_SUBTYPES,
    ORG_TYPE_NOT_SET,
} from '../../../config/general';
import { leftJoin } from '../../../helpers/general';
import { isAdded } from '../../../helpers/datastreams';
import { useDispatch, useSelector } from 'react-redux';
import { clearFixRecord, loadRecordToFix } from '../../../actions';
import { InlineLoader } from '../../SharedComponents/Toolbox/Loaders';
import * as actions from 'actions/incompleteRecords';
import Field from '../../SharedComponents/Toolbox/ReactHookForm/components/Field';
import { useWatch } from 'react-hook-form';

export const FORM_NAME = 'MyIncompleteRecord';

const ntroFieldsDefaultValues = {
    significance: '',
    impactStatement: '',
    ntroAbstract: '',
    fez_record_search_key_ismn: '',
    fez_record_search_key_isrc: '',
    fez_record_search_key_series: {
        rek_series: '',
    },
    fez_record_search_key_volume_number: {
        rek_volume_number: '',
    },
    fez_record_search_key_issue_number: {
        rek_issue_number: '',
    },
    fez_record_search_key_start_page: {
        rek_start_page: '',
    },
    fez_record_search_key_end_page: {
        rek_end_page: '',
    },
    fez_record_search_key_total_pages: {
        rek_total_pages: '',
    },
    fez_record_search_key_original_format: {
        rek_original_format: '',
    },
    fez_record_search_key_audience_size: {
        rek_audience_size: '',
    },
    languages: '',
    qualityIndicators: '',
    grants: '',
};

const defaultValues = {
    ...ntroFieldsDefaultValues,
    authorsAffiliation: '',
    comments: '',
    files: '',
};

const getInitialValues = (recordToFix, author, isAdmin, disableInitialGrants) => {
    if (!recordToFix) {
        return defaultValues;
    }

    const grants = recordToFix.fez_record_search_key_grant_agency?.map((grantAgency, index) => ({
        grantAgencyName: grantAgency.rek_grant_agency,
        grantId:
            (recordToFix.fez_record_search_key_grant_id &&
                recordToFix.fez_record_search_key_grant_id.length > 0 &&
                recordToFix.fez_record_search_key_grant_id[index] &&
                recordToFix.fez_record_search_key_grant_id[index].rek_grant_id) ||
            '',
        grantAgencyType:
            (recordToFix.fez_record_search_key_grant_agency_type &&
                recordToFix.fez_record_search_key_grant_agency_type.length > 0 &&
                recordToFix.fez_record_search_key_grant_agency_type[index] &&
                recordToFix.fez_record_search_key_grant_agency_type[index].rek_grant_agency_type) ||
            ORG_TYPE_NOT_SET,
        disabled: disableInitialGrants,
    }));

    const affiliationDataMap = [
        {
            infoArray: recordToFix.fez_record_search_key_author,
            key: 'rek_author_order',
        },
        {
            infoArray: recordToFix.fez_record_search_key_author_affiliation_name,
            key: 'rek_author_affiliation_name_order',
        },
        {
            infoArray: recordToFix.fez_record_search_key_author_affiliation_type,
            key: 'rek_author_affiliation_type_order',
        },
    ];

    const authorsAffiliation = affiliationDataMap
        .reduce(
            (authors, affiliationData) =>
                leftJoin(authors, affiliationData.infoArray, 'rek_author_id_order', affiliationData.key),
            recordToFix.fez_record_search_key_author_id,
        )
        .map(authorAffiliation => ({
            affiliation:
                authorAffiliation.rek_author_affiliation_name === locale.global.orgTitle
                    ? AFFILIATION_TYPE_UQ
                    : AFFILIATION_TYPE_NOT_UQ,
            creatorRole: '',
            nameAsPublished: authorAffiliation.rek_author,
            orgaff: authorAffiliation.rek_author_affiliation_name || '',
            orgtype:
                (authorAffiliation.rek_author_affiliation_type &&
                    String(authorAffiliation.rek_author_affiliation_type)) ||
                '',
            uqIdentifier: String(authorAffiliation.rek_author_id),
            disabled: authorAffiliation.rek_author_id && authorAffiliation.rek_author_id !== author.aut_id,
        }))
        .map(authorAffiliation => ({
            ...authorAffiliation,
            required: authorAffiliationRequired(authorAffiliation, author),
        }));

    const significance = isAdmin && recordToFix.fez_record_search_key_significance;

    const languages = (recordToFix &&
        (recordToFix.fez_record_search_key_language || []).length > 0 &&
        recordToFix.fez_record_search_key_language.map(lang => lang.rek_language)) || ['eng'];

    return {
        ...defaultValues,
        authorsAffiliation,
        grants,
        languages,
        significance,
    };
};

const getCurrentAuthorOrder = (recordToFix, author) => {
    const currentAuthor =
        recordToFix &&
        recordToFix.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === author.aut_id);
    return !!currentAuthor && currentAuthor.length > 0 && currentAuthor[0].rek_author_id_order;
};

const getNtroFieldFlags = (recordToFix, author) => {
    const currentAuthorOrder = getCurrentAuthorOrder(recordToFix, author);
    const significance = (recordToFix.fez_record_search_key_significance || []).filter(
        item => item.rek_significance_order === currentAuthorOrder,
    );
    const contributionStatement = (recordToFix.fez_record_search_key_creator_contribution_statement || []).filter(
        item => item.rek_creator_contribution_statement_order === currentAuthorOrder,
    );

    return {
        hideAbstract: !!recordToFix.rek_formatted_abstract || !!recordToFix.rek_description,
        hideLanguage: (recordToFix.fez_record_search_key_language || []).length !== 0,
        hidePeerReviewActivity: (recordToFix.fez_record_search_key_quality_indicator || []).length !== 0,
        hideExtent:
            [DOCUMENT_TYPE_BOOK_CHAPTER, DOCUMENT_TYPE_JOURNAL_ARTICLE].includes(recordToFix.rek_display_type_lookup) ||
            !!(recordToFix.fez_record_search_key_total_pages || {}).rek_total_pages,
        hideAudienceSize:
            ![...LP_NTRO_SUBTYPES, ...CPEE_NTRO_SUBTYPES].includes(recordToFix.rek_subtype) ||
            !!(recordToFix.fez_record_search_key_audience_size || {}).rek_audience_size,
        showSignificance: significance.length === 0 || (significance.length > 0 && !significance[0].rek_significance),
        showContributionStatement:
            contributionStatement.length === 0 ||
            (contributionStatement.length > 0 &&
                (!contributionStatement[0].rek_creator_contribution_statement ||
                    contributionStatement[0].rek_creator_contribution_statement === '' ||
                    contributionStatement[0].rek_creator_contribution_statement ===
                        locale.global.defaultAuthorDataPlaceholder)),
    };
};

const isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
    return (
        !!author &&
        !!recordToFix &&
        recordToFix[searchKey] &&
        recordToFix[searchKey].length > 0 &&
        recordToFix[searchKey].some(authorId => authorId[subkey] === author.aut_id)
    );
};

const getIsAuthorLinked = (recordToFix, author) => {
    const isAuthorLinked = isLoggedInUserLinked(
        author,
        recordToFix,
        'fez_record_search_key_author_id',
        'rek_author_id',
    );
    const isContributorLinked = isLoggedInUserLinked(
        author,
        recordToFix,
        'fez_record_search_key_contributor_id',
        'rek_contributor_id',
    );

    return isAuthorLinked || isContributorLinked;
};

export const validateAuthorsAffiliation = (authorsAffiliation, author) => {
    const errors = {};
    if (authorsAffiliation.some?.(authorAffiliation => authorAffiliationRequired(authorAffiliation, author))) {
        errors.authorsAffiliation = locale.validationErrors.authorsAffiliationIncomplete;
    }
    return errors;
};

const isFileValid = dataStream => {
    const {
        files: { blacklist },
    } = incompleteRecord;
    return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex) && isAdded(dataStream);
};

export const MyIncompleteRecord = ({ disableDeleteAllGrants, disableInitialGrants }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const isAdmin = userIsAdmin();
    const { pid } = useParams();
    // constants
    const txt = pagesLocale;
    const txtFixForm = formsLocale.forms.fixPublicationForm;
    const authors = txt.fields.authors;
    // global state
    const { recordToFix, loadingRecordToFix } = useSelector(state => state.get('fixRecordReducer'));
    const { author, accountAuthorLoading } = useSelector(state => state.get('accountReducer'));
    // local state
    const [ntroFieldProps, setNtroFieldProps] = React.useState({});
    const [isNtro, setIsNtro] = React.useState(false);
    const [hasAnyFiles, setHasAnyFiles] = React.useState(false);
    const [isAuthorLinked, setIsAuthorLinked] = React.useState(true);
    const values = getInitialValues(recordToFix, author, isAdmin, disableInitialGrants);
    // form
    const {
        control,
        getPropsForAlert,
        safelyHandleSubmit,
        mergeWithFormValues,
        formState: { isDirty, isSubmitting, isSubmitSuccessful, hasValidationError },
    } = useValidatedForm({ values });
    const { authorsAffiliation } = useWatch({ control });

    // load record on rendering
    useEffect(() => {
        pid && !recordToFix && !!loadRecordToFix && dispatch(loadRecordToFix(pid));
        return () => dispatch(clearFixRecord());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid]);

    // update state upon loading recordToFix
    useEffect(() => {
        if (!!recordToFix) {
            setNtroFieldProps(getNtroFieldFlags(recordToFix, author));
            setIsNtro(!!recordToFix.rek_subtype && !!NTRO_SUBTYPES.includes(recordToFix.rek_subtype));
            setHasAnyFiles(recordToFix.fez_datastream_info.filter(isFileValid).length > 0);
            setIsAuthorLinked(getIsAuthorLinked(recordToFix, author));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recordToFix]);

    // show confirmation dialog upon successful form submission
    useEffect(() => {
        if (isSubmitSuccessful) showConfirmation();
    }, [showConfirmation, isSubmitSuccessful]);

    // loading message
    if (accountAuthorLoading || loadingRecordToFix) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    // if author is not linked to this record, abandon form
    if (!isAuthorLinked) {
        navigate(-1);
        return <div id="author-not-linked" data-testid="author-not-linked" />;
    }

    const alertProps = validation.getErrorAlertProps({
        alertLocale: {
            ...alertLocale,
            progressAlert: txt.progressAlert,
            successAlert: txt.successAlert,
        },
        ...getPropsForAlert(validateAuthorsAffiliation(authorsAffiliation, author)),
    });

    const navigateToMyIncomplete = () => {
        navigate(pathConfig.records.incomplete);
    };

    const navigateToDashboard = () => {
        navigate(pathConfig.dashboard);
    };

    const onSubmit = safelyHandleSubmit(async () => {
        const data = mergeWithFormValues({
            publication: { ...recordToFix },
            author: { ...author },
        });
        dispatch(await actions.updateIncompleteRecord(data));
    });

    return (
        <StandardPage title={txt.title} help={txt.help}>
            <PublicationCitation publication={recordToFix} hideContentIndicators citationStyle={'list'} />
            <ConfirmDiscardFormChanges dirty={isDirty} submitSucceeded={isSubmitSuccessful}>
                <form onSubmit={onSubmit}>
                    <NavigationDialogBox
                        when={isDirty && !isSubmitSuccessful}
                        txt={txtFixForm.cancelWorkflowConfirmation}
                    />
                    <ConfirmationBox
                        confirmationBoxId="submit-succeeded"
                        onAction={navigateToDashboard}
                        onClose={hideConfirmation}
                        onCancelAction={navigateToMyIncomplete}
                        isOpen={isOpen}
                        locale={txt.successWorkflowConfirmation}
                    />
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <Alert title={txt.prompt.title} message={txt.prompt.message} type={txt.prompt.type} />
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={viewRecordLocale.viewRecord.sections.publicationDetails}>
                                <Grid
                                    container
                                    sx={{
                                        paddingBottom: '12px',
                                        borderBottom: '1px solid',
                                        borderBottomColor: 'secondary.light',
                                    }}
                                >
                                    {!!recordToFix && !!recordToFix.rek_display_type_lookup && (
                                        <Grid container alignItems="flex-start" width={'100%'}>
                                            <Grid xs={12} sm={3}>
                                                <Typography>
                                                    {
                                                        viewRecordLocale.viewRecord.headings.default.publicationDetails
                                                            .rek_display_type
                                                    }
                                                </Typography>
                                            </Grid>
                                            <Grid xs={12} sm={9}>
                                                <Typography>{recordToFix.rek_display_type_lookup}</Typography>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                                <Grid
                                    container
                                    sx={{
                                        marginTop: '12px',
                                        paddingBottom: '12px',
                                        borderBottom: '1px solid',
                                        borderBottomColor: 'secondary.light',
                                    }}
                                >
                                    {!!recordToFix && !!recordToFix.rek_subtype && (
                                        <Grid container alignItems="flex-start" width={'100%'}>
                                            <Grid xs={12} sm={3}>
                                                <Typography>
                                                    {
                                                        viewRecordLocale.viewRecord.headings.default.publicationDetails
                                                            .rek_subtype
                                                    }
                                                </Typography>
                                            </Grid>
                                            <Grid xs={12} sm={9}>
                                                <Typography>{recordToFix.rek_subtype}</Typography>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {isNtro && (
                            <NtroFields
                                fieldWrapper={props => <Field {...props} control={control} />}
                                submitting={isSubmitting}
                                hideIsmn
                                hideIsrc
                                hideVolume
                                hideIssue
                                hideStartPage
                                hideEndPage
                                hideOriginalFormat
                                hideSeries
                                disableDeleteAllGrants={disableDeleteAllGrants}
                                {...ntroFieldProps}
                            />
                        )}
                        <Grid xs={12}>
                            <StandardCard title={authors.title} help={authors.help}>
                                <Typography>{authors.description}</Typography>
                                <Field
                                    control={control}
                                    component={ContributorsEditorField}
                                    contributorEditorId="rek-author"
                                    editMode
                                    canEdit
                                    hideDelete
                                    hideReorder
                                    isNtro
                                    locale={txt.fields.authors.field}
                                    name="authorsAffiliation"
                                    required
                                    showContributorAssignment
                                />
                            </StandardCard>
                        </Grid>

                        <Grid xs={12}>
                            <StandardCard title={txt.fields.notes.title}>
                                <Field
                                    control={control}
                                    component={TextField}
                                    disabled={isSubmitting}
                                    fullWidth
                                    label={txt.fields.notes.label}
                                    multiline
                                    name="comments"
                                    placeholder={txt.fields.notes.placeholder}
                                    rows={5}
                                    style={{ marginTop: -24 }}
                                    textFieldId="comments"
                                    type="text"
                                />
                            </StandardCard>
                        </Grid>
                        {!hasAnyFiles && (
                            <Grid xs={12}>
                                <StandardCard title={txt.fields.fileUpload.title}>
                                    <Field
                                        control={control}
                                        name="files"
                                        component={FileUploadField}
                                        disabled={isSubmitting}
                                        requireOpenAccessStatus
                                        validate={[validation.fileUploadRequired, validation.validFileUpload]}
                                        isNtro
                                        {...txt.fields.fileUpload}
                                    />
                                </StandardCard>
                            </Grid>
                        )}
                        {alertProps && (
                            <Grid xs={12}>
                                <Alert pushToTop {...alertProps} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid xs sx={{ display: { xs: 'none', md: 'block' } }} />

                        <Grid xs={12} md="auto">
                            <Button
                                id="cancel-fix-work"
                                variant="contained"
                                fullWidth
                                children={txt.cancelButtonLabel}
                                disabled={isSubmitting}
                                onClick={navigateToMyIncomplete}
                            />
                        </Grid>
                        <Grid xs={12} md="auto">
                            <Button
                                id="update-my-work"
                                variant="contained"
                                color="primary"
                                fullWidth
                                children={txt.submitButtonLabel}
                                type="submit"
                                disabled={isSubmitting || hasValidationError}
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

MyIncompleteRecord.propTypes = {
    disableDeleteAllGrants: PropTypes.bool,
    disableInitialGrants: PropTypes.bool,
};

export default React.memo(MyIncompleteRecord);
