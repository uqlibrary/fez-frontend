import React from 'react';
import PropTypes from 'prop-types';
import { parseHtmlToJSX } from 'helpers/general';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import pagesLocale from 'locale/pages';
import viewRecordLocale from 'locale/viewRecord';
import globalLocale from 'locale/global';
import {
    PUBLICATION_TYPE_DATA_COLLECTION,
    RECORD_TYPE_COLLECTION,
    RECORD_TYPE_COMMUNITY,
    DOI_CROSSREF_PREFIX,
    DOI_DATACITE_PREFIX,
    DOI_DATACITE_NAME,
    DOI_CROSSREF_NAME,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    SUBTYPE_EDITED_BOOK,
    UQ_FULL_NAME,
} from 'config/general';
import { pathConfig } from 'config/pathConfig';
import { doiFields, rccDatasetCollection } from 'config/doi';
import { validation } from 'config';

import { useConfirmationState } from 'hooks';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import DoiPreview from './DoiPreview';

const txt = {
    ...pagesLocale.pages.doi,
    headings: viewRecordLocale.viewRecord.headings,
};

const renderAlertText = (title, messages, type) => (
    <span>
        <Typography variant="h3" style={{ fontSize: 20, marginTop: 6 }}>
            {title}
        </Typography>
        {
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        <Typography variant="body2" data-testid={`rek-doi-${type}-${index}`}>
                            {message}
                        </Typography>
                    </li>
                ))}
            </ul>
        }
    </span>
);

export const getWarningMessage = record => {
    const alertTitle = txt.alertMessages.warningTitle;
    const alertType = 'warning';
    const warningMessages = [];

    // Warn if Edition is not purely numeric
    const editionValue = !!record.fez_record_search_key_edition && record.fez_record_search_key_edition.rek_edition;
    if (!!editionValue && !/^\d+$/.test(editionValue.trim())) {
        warningMessages.push(
            txt.alertMessages.invalidOptionalField
                .replace('[FIELDNAME]', txt.headings.default.fez_record_search_key_edition)
                .replace('[REASON]', txt.alertMessages.fieldValidationDetail.edition),
        );
    }

    return warningMessages.length ? renderAlertText(alertTitle, warningMessages, alertType) : '';
};

export const isArrayValid = (record, fieldConfig, testFunction) => {
    let isValid = true;
    const searchKeyValue = record[fieldConfig.field];
    const subKey = fieldConfig.field.replace('fez_record_search_key', 'rek');

    if (!!searchKeyValue && Array.isArray(searchKeyValue) && searchKeyValue.length > 0) {
        isValid = searchKeyValue.reduce(
            (valid, entry) => !!valid && !!entry[subKey] && testFunction(entry[subKey]),
            true,
        );
    } else {
        isValid = !fieldConfig.isRequired;
    }

    return isValid;
};

export const getInvalidPreviewFields = record => {
    const displayType = !!record && record.rek_display_type;
    const previewFields = !!displayType && !!doiFields[displayType] && doiFields[displayType].fields;
    const invalidPreviewFields = [];

    previewFields.map(fieldConfig => {
        const subKey = fieldConfig.field.replace('fez_record_search_key', 'rek');
        const value =
            !!record[fieldConfig.field] &&
            typeof record[fieldConfig.field] === 'object' &&
            !Array.isArray(record[fieldConfig.field])
                ? record[fieldConfig.field][subKey]
                : record[fieldConfig.field];

        let isValid = true;
        switch (fieldConfig.field) {
            case 'fez_record_search_key_issn':
                isValid = isArrayValid(record, fieldConfig, value => validation.isValidIssn(value) === '');
                break;

            case 'fez_record_search_key_isbn':
                isValid = isArrayValid(record, fieldConfig, value => validation.isValidIsbn(value) === '');
                break;

            case 'fez_record_search_key_org_name':
            case 'fez_record_search_key_publisher':
                isValid = !fieldConfig.requiresUQ || (!!value && value.indexOf(globalLocale.global.orgTitle) > -1);
                break;

            default:
                isValid = !fieldConfig.isRequired || !!value;
                break;
        }

        if (!isValid) {
            invalidPreviewFields.push(fieldConfig.field);
        }
    });
    return invalidPreviewFields;
};

export const addBookChaptersParentErrorMessage = (record, displayType, errorMessages) => {
    if (displayType !== PUBLICATION_TYPE_BOOK_CHAPTER) {
        return;
    }

    if (
        !record.fez_record_search_key_isderivationof ||
        !record.fez_record_search_key_isderivationof[0] ||
        !record.fez_record_search_key_isderivationof[0].parent ||
        !record.fez_record_search_key_isderivationof[0].parent.rek_pid
    ) {
        errorMessages.push(txt.alertMessages.bookChapter.parent.missing);
        return;
    }

    const parent = record.fez_record_search_key_isderivationof[0].parent;
    if (!parent.rek_subtype || parent.rek_subtype.toLowerCase() !== SUBTYPE_EDITED_BOOK.toLowerCase()) {
        errorMessages.push(
            txt.alertMessages.wrongSubtype
                .replace('[TYPE]', 'the parent Book')
                .replace('[SUBTYPES]', SUBTYPE_EDITED_BOOK),
        );
    }

    if (
        !parent.fez_record_search_key_doi ||
        !parent.fez_record_search_key_doi.rek_doi ||
        parent.fez_record_search_key_doi.rek_doi.indexOf(DOI_CROSSREF_PREFIX) === -1
    ) {
        errorMessages.push(txt.alertMessages.uqIsNotPublisher.replace('[SUBJECT]', 'The parent Book'));
    }

    if (
        !parent.fez_record_search_key_publisher ||
        !parent.fez_record_search_key_publisher.rek_publisher ||
        parent.fez_record_search_key_publisher.rek_publisher.indexOf(UQ_FULL_NAME) === -1
    ) {
        errorMessages.push(
            txt.alertMessages.uqCheckMessage.replace(
                '[FIELDNAME]',
                `The parent Book's ${txt.headings.default.fez_record_search_key_publisher}`,
            ),
        );
    }
};

export const getErrorMessage = record => {
    const alertTitle = txt.alertMessages.errorTitle;
    const alertType = 'error';

    const displayType = !!record && record.rek_display_type;
    const displayTypeLookup = !!record && record.rek_display_type_lookup;
    const doi = !!record && !!record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi;
    const recordType = (!!record && record.rek_object_type_lookup) || '';

    const errorMessages = [];
    let unsupportedType = false;

    // Need to filter out community and collection record types
    const isRecord = ![RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY].includes(recordType.toLowerCase());

    // Need to avoid unsupported display types
    const unsupportedDisplayType = !!displayType && !doiFields[displayType];

    if (!isRecord || unsupportedDisplayType) {
        unsupportedType = true;

        const type = displayTypeLookup || recordType;
        errorMessages.push(txt.alertMessages.unsupportedMessage.replace('[TYPE]', type));
    } else {
        addBookChaptersParentErrorMessage(record, displayType, errorMessages);

        // Subtype restrictions
        const supportedSubtypes = !!displayType && !!doiFields[displayType] && doiFields[displayType].subtypes;
        if (!!supportedSubtypes) {
            const subtype = !!record && record.rek_subtype;
            if (supportedSubtypes.indexOf(subtype) === -1) {
                errorMessages.push(
                    txt.alertMessages.wrongSubtype
                        .replace('[TYPE]', displayTypeLookup)
                        .replace('[SUBTYPES]', supportedSubtypes.join(', ')),
                );
            }
        }

        // Should not allow updates of existing Non-UQ DOIs
        if (!!doi && doi.indexOf(DOI_CROSSREF_PREFIX) !== 0 && doi.indexOf(DOI_DATACITE_PREFIX) !== 0) {
            errorMessages.push(txt.alertMessages.uqIsNotPublisher.replace('[SUBJECT]', 'This work'));
        }

        if (
            record.fez_record_search_key_ismemberof?.filter(parent => parent.rek_ismemberof === rccDatasetCollection)
                .length
        ) {
            errorMessages.push(txt.alertMessages.rccDataset);
        }

        // Preview fields
        const invalidPreviewFields = !unsupportedDisplayType && getInvalidPreviewFields(record);
        if (invalidPreviewFields.length) {
            // None of the fields with conditions have a type-specific heading, so commenting out that code path.
            // const displayTypeHeadings =
            //     displayTypeLookup && txt.headings[displayTypeLookup] ? txt.headings[displayTypeLookup] : [];

            invalidPreviewFields.forEach(field => {
                // const fieldName = displayTypeHeadings[field]
                // ? displayTypeHeadings[field] : txt.headings.default[field];
                const fieldName = txt.headings.default[field];
                const errorTemplate = ['fez_record_search_key_org_name', 'fez_record_search_key_publisher'].includes(
                    field,
                )
                    ? txt.alertMessages.uqCheckMessage
                    : txt.alertMessages.missingRequiredField;

                errorMessages.push(errorTemplate.replace('[FIELDNAME]', fieldName));
            });
        }
    }

    return {
        errorMessage: errorMessages.length ? renderAlertText(alertTitle, errorMessages, alertType) : '',
        unsupportedType,
    };
};

const renderTitle = titlePieces => {
    const titleTemplate = txt.pageTitle({ ...titlePieces, title: '[TITLE]' });
    const pieces = titleTemplate.split('[TITLE]');
    return (
        <Typography variant="h2" color="primary" style={{ fontSize: 24 }} data-testid="doi-page-title">
            {pieces[0]}
            {parseHtmlToJSX(titlePieces.title)}
            {pieces[1]}
        </Typography>
    );
};

export const Doi = ({
    doiRequesting,
    doiUpdated,
    doiFailed,
    handleSubmit,
    loadingRecordToView,
    loadRecordToView,
    record,
    resetDoi,
}) => {
    const { pid: pidParam } = useParams();
    React.useEffect(() => {
        // Load record if it hasn't
        !!pidParam && (!record || record.rek_pid !== pidParam) && !!loadRecordToView && loadRecordToView(pidParam);
        return () => {
            // Clear form status
            resetDoi();
        };
    }, [loadRecordToView, pidParam, record, resetDoi]);

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    /* istanbul ignore next */
    React.useEffect(() => {
        if (doiUpdated) {
            showConfirmation();
        }
    }, [showConfirmation, doiUpdated]);

    if (!!pidParam && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    // Record not found
    const pid = !!record && record.rek_pid;
    if (!!pidParam && !pid) {
        return <div className="empty" />;
    }

    // Get subkeys where present
    const displayTypeLookup = !!record && record.rek_display_type_lookup;
    const doi = !!record && !!record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi;
    const title = !!record && !!record.rek_title && record.rek_title;

    // Look for possible issues
    const warningMessage = getWarningMessage(record);
    const { errorMessage, unsupportedType } = getErrorMessage(record);

    const navigateToViewPage = () => {
        window.location.assign(pathConfig.records.view(pid, true));
    };

    // deep clone
    const alertTxt = JSON.parse(JSON.stringify(txt.alertProps));
    const confirmationTxt = JSON.parse(JSON.stringify(txt.successConfirmation));
    if (record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION) {
        alertTxt.progressAlert.message = alertTxt.progressAlert.message
            .replace(DOI_CROSSREF_NAME, DOI_DATACITE_NAME)
            .replace('queued', 'submitted');
        alertTxt.successAlert.message = alertTxt.successAlert.message
            .replace(DOI_CROSSREF_NAME, DOI_DATACITE_NAME)
            .replace('queued', 'submitted');
        confirmationTxt.confirmationMessage = `The DOI has been created/updated in ${DOI_DATACITE_NAME}`;
    }

    const alertProps = validation.getErrorAlertProps({
        alertLocale: alertTxt,
        error: doiFailed,
        submitSucceeded: doiUpdated,
        submitting: doiRequesting,
    });

    return (
        <StandardPage>
            {!!pid && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {renderTitle({ doi, displayTypeLookup, title, pid })}
                        <PublicationCitation publication={record} hideTitle hideCitationCounts hideContentIndicators />
                    </Grid>
                    <Grid item xs={12}>
                        {(!!errorMessage && <Alert message={errorMessage} type="error" testId="rek-doi-error" />) ||
                            (!!warningMessage && (
                                <Alert message={warningMessage} type="warning" testId="rek-doi-warning" />
                            ))}
                    </Grid>
                    <Grid item xs={12}>
                        <ConfirmationBox
                            testId="rek-doi-confirmation-box"
                            confirmationBoxId="rek-doi"
                            hideCancelButton
                            isOpen={isOpen}
                            locale={confirmationTxt}
                            onAction={navigateToViewPage}
                            onClose={hideConfirmation}
                        />
                        {!unsupportedType && <DoiPreview publication={record} />}
                    </Grid>
                    {alertProps && (
                        <Grid item xs={12}>
                            <Alert testId="rek-doi-submit-status" {...alertProps} />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={false} sm />
                            <Grid item xs={12} sm="auto">
                                <Button
                                    id="rek-doi-cancel"
                                    data-analyticsid="rek-doi-cancel"
                                    data-testid="rek-doi-cancel"
                                    variant="contained"
                                    fullWidth
                                    disabled={doiRequesting}
                                    onClick={navigateToViewPage}
                                >
                                    {txt.cancelButtonLabel}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm="auto">
                                <Button
                                    id="rek-doi-submit"
                                    data-analyticsid="rek-doi-submit"
                                    data-testid="rek-doi-submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleSubmit(record)}
                                    disabled={doiRequesting || !!errorMessage}
                                >
                                    {txt.confirmButtonLabel(!!doi)}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </StandardPage>
    );
};

Doi.propTypes = {
    doiFailed: PropTypes.bool,
    doiRequesting: PropTypes.bool,
    doiUpdated: PropTypes.bool,
    handleSubmit: PropTypes.func,
    loadingRecordToView: PropTypes.bool,
    loadRecordToView: PropTypes.func,
    record: PropTypes.object,
    resetDoi: PropTypes.func,
};

export default Doi;
