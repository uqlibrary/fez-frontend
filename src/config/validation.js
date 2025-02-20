import React from 'react';
import moment from 'moment';
import Immutable from 'immutable';

import locale from 'locale/validationErrors';
import { MEDIATED_ACCESS_ID, ORG_TYPE_NOT_SET } from 'config/general';

import { isAdded } from 'helpers/datastreams';

export const isEmpty = value => !value?.length;
export const hasLengthGreaterThan = (value, maxlength) => !isEmpty(value) && value?.length > maxlength;
// Max Length
export const maxLengthValidator = max => value =>
    hasLengthGreaterThan(value, max) ? locale.validationErrors.maxLength.replace('[max]', max) : undefined;
export const spacelessMaxLengthValidator = max => value => {
    return value && hasLengthGreaterThan(value.toString().replace(/\s/g, ''), max)
        ? locale.validationErrors.maxLength.replace('[max]', max)
        : undefined;
};

export const maxLength255Validator = maxLengthValidator(255);
export const maxLength1000Validator = maxLengthValidator(1000);
export const spacelessMaxLength9Validator = spacelessMaxLengthValidator(9);
export const spacelessMaxLength10Validator = spacelessMaxLengthValidator(10);
export const spacelessMaxLength11Validator = spacelessMaxLengthValidator(11);
export const spacelessMaxLength12Validator = spacelessMaxLengthValidator(12);
export const spacelessMaxLength20Validator = spacelessMaxLengthValidator(20);
export const spacelessMaxLength30Validator = spacelessMaxLengthValidator(30);
export const spacelessMaxLength50Validator = spacelessMaxLengthValidator(50);
export const spacelessMaxLength255Validator = spacelessMaxLengthValidator(255);
export const spacelessMaxLength500Validator = spacelessMaxLengthValidator(500);
export const spacelessMaxLength800Validator = spacelessMaxLengthValidator(800);
export const spacelessMaxLength1000Validator = spacelessMaxLengthValidator(1000);
export const spacelessMaxLength2000Validator = spacelessMaxLengthValidator(2000); // URL's must be under 2000 characters

// Min Length
export const minLengthValidator = min => value =>
    (value !== null || value !== undefined) && value.trim().length < min
        ? locale.validationErrors.minLength.replace('[min]', min)
        : undefined;
export const minLength10Validator = minLengthValidator(10);
export const minLength0Validator = minLengthValidator(0);

export const isValidResearcherId = value => {
    const regexResearcherId = /^[A-Z]{1,3}-\d{4}-\d{4}$/g;
    return (
        (!!value &&
            (new RegExp(regexResearcherId).test(value.trim()) ? undefined : locale.validationErrors.researcherId)) ||
        undefined
    );
};

// Max Words
export const maxWords = max => value => {
    let valueToValidate = null;
    if (typeof value === 'object' && value.hasOwnProperty('plainText')) {
        valueToValidate = value.plainText;
    } else {
        valueToValidate = value;
    }

    const regExp = '^ *\\S+(?: +\\S+){[max],}$';
    return new RegExp(regExp.replace('[max]', max), 'gim').test(valueToValidate.trim())
        ? locale.validationErrors.maxWords.replace('[max]', max)
        : undefined;
};

export const maxWords100 = maxWords(100);

export const maxListEditorTextLength = max => value =>
    maxLengthValidator(max + (value?.plainText ? 0 : 7))(value?.plainText || value);

export const maxListEditorTextLength800 = maxListEditorTextLength(800);
export const maxListEditorTextLength2000 = maxListEditorTextLength(2000);
export const maxListEditorTextLength65k = maxListEditorTextLength(65535);

const doiRegexps = [
    /10\.\d{4,9}\/[-._;()\/:A-Z0-9]+/i,
    /10\.1002\/[^\s]+/i,
    /10\.\d{4}\/\d+-\d+X?\(\d+\)\d+[<\[][\d\w]+:[\d\w]*[>\]]\d+.\d+.\w+;\d/i,
    /10\.1021\/\w\w\d+\+/i,
    /10\.1207\/[\w\d]+\&\d+_\d+/i,
];

export const getDoi = value => {
    for (const regex of doiRegexps) {
        const matches = value?.trim().match(regex);
        if (matches) {
            return matches[0];
        }
    }
    return null;
};

export const isValidDOIValue = value => {
    if (!value.trim?.()) return false;
    for (const regex of doiRegexps) {
        const anchoredRegex = new RegExp(`^${regex.source}`, regex.flags);
        const matches = value?.match(anchoredRegex);
        if (matches) {
            return true;
        }
    }
    return false;
};

export const sanitizeDoi = value => getDoi(value) || value;

export const isValidPubMedValue = value => {
    // pubmed id is all digits, min 3 digits
    const isValid = /^[\d]{3,}$/;
    return isValid.test(value.trim());
};

export const isValidPartialDOIValue = value => {
    const isValid = /^10\..*/;
    return isValid.test(value.trim());
};

export const isValidPid = value => {
    const isValid = /^uq:[a-z0-9]+$/i;
    return isValid.test(value.toString().trim());
};

export const isValidPublicationTitle = value => {
    const isValid = /.{10,255}$/i;
    return isValid.test(value.trim());
};

// Generic
export const required = value => (value ? undefined : locale.validationErrors.required);

// Check if copyright/agreement is checked
export const requireChecked = value => (value === 'on' ? undefined : locale.validationErrors.requireChecked);

export const requiredList = value => {
    return ((value instanceof Immutable.List && value.toJS()) || value || []).length > 0
        ? undefined
        : locale.validationErrors.required;
};

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? locale.validationErrors.email : undefined;
export const url = value =>
    value && !/^(http[s]?|ftp[s]?)(:\/\/){1}(.*)$/i.test(value)
        ? locale.validationErrors.url
        : spacelessMaxLength2000Validator(value);
export const doi = value => (!!value && !isValidDOIValue(value) ? locale.validationErrors.doi : undefined);
export const pid = value => (!!value && !isValidPid(value) ? locale.validationErrors.pid : undefined);
export const forRequired = itemList =>
    !itemList || itemList.length === 0 ? locale.validationErrors.forRequired : undefined;

export const peopleRequired = (itemList, validationError, checkSelected = true) =>
    !itemList ||
    itemList.length === 0 ||
    (checkSelected && itemList && itemList.filter(item => item.selected).length === 0)
        ? validationError
        : undefined;

export const authorRequired = authors => peopleRequired(authors, locale.validationErrors.authorRequired, true);
export const editorRequired = editors => peopleRequired(editors, locale.validationErrors.editorRequired, true);
export const supervisorRequired = supervisors =>
    peopleRequired(supervisors, locale.validationErrors.supervisorRequired, false);

export const authorAffiliationRequired = (authorAffiliation, loggedInAuthor) =>
    (authorAffiliation.uqIdentifier === '0' || authorAffiliation.uqIdentifier === String(loggedInAuthor.aut_id)) &&
    ((authorAffiliation.nameAsPublished || '').trim().length === 0 ||
        (authorAffiliation.orgaff || '').trim().length === 0 ||
        authorAffiliation.orgaff === 'Missing' ||
        (authorAffiliation.orgtype || '').trim().length === 0 ||
        authorAffiliation.orgtype === 'Missing' ||
        authorAffiliation.orgtype === ORG_TYPE_NOT_SET);

// DateTime
export const dateTimeDay = value =>
    value && (isNaN(value) || parseInt(value, 10) < 0 || parseInt(value, 10) > 31)
        ? locale.validationErrors.dateTimeDay
        : undefined;
export const dateTimeYear = value =>
    (value && value.length > 0 && (isNaN(value) || parseInt(value, 10) > new Date().getFullYear())) ||
    (value && value.length < 4)
        ? locale.validationErrors.dateTimeYear
        : undefined;
export const validFileUpload = value => {
    return value && value.hasOwnProperty('isValid') && !value.isValid ? locale.validationErrors.fileUpload : undefined;
};

export const validFileNames = value => {
    return value && value.some(file => file.hasOwnProperty('isValid') && file.isValid === false)
        ? locale.validationErrors.fileName
        : undefined;
};

export const fileUploadRequired = value => {
    return !value || value.queue?.length === 0 ? locale.validationErrors.fileUploadRequired : undefined;
};

export const fileUploadNotRequiredForMediated = (value, values) => {
    const accessCondition = values.toJS().fez_record_search_key_access_conditions;
    if (!!accessCondition && accessCondition.rek_access_conditions === MEDIATED_ACCESS_ID) {
        return undefined;
    } else {
        return value === undefined || value.queue.length === 0 ? locale.validationErrors.fileUploadRequired : undefined;
    }
};

export const isValidIssn = subject => {
    const regex = /^\d{4}-?\d{3}[\dX]$/;
    if (subject.trim().length === 0 || regex.test(subject)) {
        return '';
    } else {
        return locale.validationErrors.issn;
    }
};

export const isValidIsbn = subject => {
    // Checks for ISBN-10 or ISBN-13 format
    // https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
    // Edited to remove "ISBN" / "ISBN-10" / "ISBN-13" prefix.
    const regex = /^(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
    return subject.trim().length === 0 || regex.test(subject) ? '' : locale.validationErrors.isbn;
};

export const isValidKeyword = maxKeywordLength => subject => {
    const keywords = subject.split('|');

    return keywords.some(keyword => keyword.length > maxKeywordLength)
        ? locale.validationErrors.keywords.replace('[max]', maxKeywordLength)
        : undefined;
};
export const checkDigit = subject => {
    const check =
        subject &&
        subject.toString().slice(-1) &&
        !isNaN(subject.toString().slice(-1)) &&
        parseInt(subject.toString().slice(-1), 10);
    const cleanCapitalM = subject.toString().replace('m', 'M');
    const cleanOldISMN = cleanCapitalM.replace('M', '9790');
    const ismn = cleanOldISMN.replace(/-/g, '');
    let checksum = null;
    for (let i = 0; i < ismn.length - 1; i++) {
        checksum += parseInt(ismn.charAt(i), 10) * (i % 2 === 0 ? 1 : 3);
    }
    return ismn.length === 13 && (checksum + check) % 10 === 0;
};

export const isValidIsmn = subject => {
    // https://www.wikidata.org/wiki/Property:P1208
    // const regex = /^(?:ISMN )?((?:979-0-[\d-]{9}-\d)|(?:M-[\d-]{9}-\d))$/gi;
    return subject.trim().length === 0 || checkDigit(subject) ? '' : locale.validationErrors.ismn;
};

export const isValidIsrc = subject => {
    // https://www.wikidata.org/wiki/Property:P1243
    const regex = /^(?:ISRC )?(?:[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5})$/gi;
    return subject.trim().length === 0 || regex.test(subject) ? '' : locale.validationErrors.isrc;
};

export const isValidAuthorLink = link => {
    return link && link.valid ? '' : locale.validationErrors.authorLinking;
};

export const isValidContributorLink = (link, required = false) => {
    return required && !(link && link.valid) ? locale.validationErrors.contributorLinking : '';
};

// Google Scholar ID
export const isValidGoogleScholarId = id => {
    const regex = /^[\w-]{12}$/;
    if (id && !regex.test(id)) {
        return locale.validationErrors.googleScholarId;
    } else {
        return undefined;
    }
};

export const isValidDate = date => {
    try {
        return moment(date).isValid();
    } catch (e) {
        return false;
    }
};

export const isDateSameOrAfter = (date, anotherDate) =>
    moment(date).isSameOrAfter(moment(anotherDate).format('YYYY-MM-DD'));

export const isDateSameOrBefore = (date, anotherDate) =>
    moment(date).isSameOrBefore(moment(anotherDate).format('YYYY-MM-DD'));

export const isDateInBetween = (date, from, to) => isDateSameOrAfter(date, from) && isDateSameOrBefore(date, to);

/**
 * @param {?string} start
 * @param {?string} end
 * @param {string} message
 * @return {string}
 */
export const dateRange = (start, end, message = locale.validationErrors.dateRange) =>
    !!start && !!end && !isDateSameOrBefore(start, end) ? message : undefined;

export const grantFormIsPopulated = value => (value === true ? locale.validationErrors.grants : undefined);

export const translateFormErrorsToText = formErrors => {
    if (!formErrors) return null;

    let errorMessagesList = [];

    Object.keys(formErrors).map(key => {
        const value = formErrors[key];
        if (typeof value === 'object') {
            const errorMessage = translateFormErrorsToText(value);
            if (errorMessage) {
                errorMessagesList = errorMessagesList.concat(errorMessage);
            }
        }

        if (locale.validationErrorsSummary.hasOwnProperty(key)) {
            errorMessagesList.push(locale.validationErrorsSummary[key]);
        }
    });
    return errorMessagesList.length > 0 ? errorMessagesList : null;
};

/**
 * @param submitting {boolean}
 * @param error {Object|undefined}
 * @param formErrors {Object|undefined}
 * @param submitSucceeded {boolean}
 * @param alertLocale {Object}
 * @return {Object}
 */
export const getErrorAlertProps = ({
    submitting = false,
    error,
    formErrors,
    submitSucceeded = false,
    alertLocale = {},
}) => {
    let alertProps = null;
    if (submitting) {
        alertProps = { ...alertLocale.progressAlert };
    } else if (submitSucceeded) {
        alertProps = { ...alertLocale.successAlert };
    } else {
        if (error) {
            let message = error;
            if (alertLocale.errorAlert.message) {
                message =
                    typeof alertLocale.errorAlert.message === 'function'
                        ? alertLocale.errorAlert.message(error)
                        : alertLocale.errorAlert.message;
            }
            // error is set by submit failed, it's reset once form is re-validated (updated for re-submit)
            alertProps = {
                ...alertLocale.errorAlert,
                message: message,
            };
        } else if (!!formErrors && formErrors.constructor === Object && Object.keys(formErrors).length > 0) {
            // formErrors is set by form validation or validate method, it's reset once form is re-validated
            const errorMessagesList = formErrors ? translateFormErrorsToText(formErrors) : null;
            const keyPrefix = `validation-${alertLocale.validationAlert.type || 'warning'}`;
            const message = (
                <span>
                    {alertLocale.validationAlert.message}
                    <ul>
                        {errorMessagesList &&
                            errorMessagesList.length > 0 &&
                            errorMessagesList.map((item, index) => (
                                <li key={`${keyPrefix}-${index}`} data-testid={`${keyPrefix}-${index}`}>
                                    {item}
                                </li>
                            ))}
                    </ul>
                </span>
            );
            alertProps = { ...alertLocale.validationAlert, message: message };
        }
    }
    return alertProps;
};

export const isFileValid = ({ files: { blacklist } }, isAdmin = false, isAdminEdit = false) => dataStream => {
    const prefixMatch = !!dataStream.dsi_dsid.match(blacklist.namePrefixRegex);
    const suffixMatch = !!dataStream.dsi_dsid.match(blacklist.nameSuffixRegex);
    return (!prefixMatch && !suffixMatch && isAdded(dataStream)) || (isAdmin && !isAdminEdit);
};

export const isAuthorOrEditorSelected = (data, isAdmin = false, allowOnlyOne = false, isEditorRequired = false) => {
    const authors = data.authors ?? data.authorsWithAffiliations;
    const errors = {};
    // authors and editors are empty or no selected authors and editors for non-admin users
    if (
        (!authors && !data.editors) ||
        (!authors && data.editors && data.editors.length === 0) ||
        (!data.editors && authors && authors.length === 0) ||
        (authors && data.editors && data.editors.length === 0 && authors.length === 0) ||
        (!isAdmin && authors && authors.length !== 0 && authors.filter(item => item.selected).length === 0) ||
        (!isAdmin &&
            data.editors &&
            data.editors.length !== 0 &&
            data.editors.filter(item => item.selected).length === 0) ||
        (isEditorRequired && data.editors && data.editors.length === 0)
    ) {
        if (!isEditorRequired) {
            errors.authors = isAdmin
                ? locale.validationErrors.authorRequiredAdmin
                : locale.validationErrors.authorRequired;
        }
        errors.editors = isAdmin ? locale.validationErrors.editorRequiredAdmin : locale.validationErrors.editorRequired;
        // authors or editors but not both
    } else if (allowOnlyOne && authors && authors.length > 0 && data.editors && data.editors.length > 0) {
        errors.onlyOneOfAuthorOrEditor = locale.validationErrors.onlyOneOfAuthorOrEditor;
        // editor is required
    }
    return errors;
};
