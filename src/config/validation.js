import {locale} from 'locale';

// Min Length
export const maxLength = max => value => value && value.length > max ? locale.validationErrors.maxLength.replace('[max]', max) : undefined;
export const maxLength10 = maxLength(10);
export const maxLength255 = maxLength(255);
export const maxLength1000 = maxLength(1000);
export const maxLength2000 = maxLength(2000); // URL's must be under 2000 characters

// Max Length
export const minLength = min => value => value && value.trim().length < min ? locale.validationErrors.minLength.replace('[min]', min) : undefined;
export const minLength10 = minLength(10);

// TODO: fix validation, make it generic etc....
export const isValidDOIValue = value => {
    const regexGroup = [
        /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
        /^10.1002\/[^\s]+$/i,
        /^10.\d{4}\/\d+-\d+X?(\d+)\d+<[\d\w]+:[\d\w]*>\d+.\d+.\w+;\d$/i,
        /^10.1021\/\w\w\d+$/i,
        /^10.1207\/[\w\d]+\&\d+_\d+$/i
    ];

    return regexGroup.reduce((isValid, regex) => (regex.test(value.trim()) || isValid), false);
};
export const isValidPubMedValue = value => {
    // pubmed id is all digits, min 3 digits
    const isValid = /^[\d]{3,}$/;
    return isValid.test(value.trim());
};
export const isValidPartialDOIValue = value => {
    const isValid = /^10\..*/;
    return isValid.test(value.trim());
};
export const isValidPublicationTitle = value => {
    const isValid = /.{10,255}$/i;
    return isValid.test(value.trim());
};

// Generic
export const required = value => value ? undefined : locale.validationErrors.required;
export const requiredList = value => (value && value.length > 0 ? undefined : locale.validationErrors.required);
export const email = value => !value || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? locale.validationErrors.email : undefined;
export const url = (value) => value && !/^(http[s]?|ftp[s]?)(:\/\/){1}(.*)$/i.test(value) ? locale.validationErrors.url : maxLength2000(value);
export const doi = (value) => !!value && !isValidDOIValue(value) ? locale.validationErrors.doi : undefined;
export const forRequired = (itemList) =>  !itemList || itemList.length === 0 ? locale.validationErrors.forRequired : undefined;

export const peopleRequired = (itemList, validationError, checkSelected = true) =>  (
    !itemList || itemList.length === 0 || (checkSelected && itemList && itemList.filter(item => (item.selected)).length === 0)
        ? validationError : undefined
);

export const authorRequired = (authors) => peopleRequired(authors, locale.validationErrors.authorRequired, true);
export const editorRequired = (editors) => peopleRequired(editors, locale.validationErrors.editorRequired, true);
export const supervisorRequired = (supervisors) => peopleRequired(supervisors, locale.validationErrors.supervisorRequired, false);

// DateTime
export const dateTimeDay = value => value && (isNaN(value) || parseInt(value, 10) < 0 || parseInt(value, 10) > 31) ? locale.validationErrors.dateTimeDay : undefined;
export const dateTimeYear = value => !value || value.length === 0 || isNaN(value) || parseInt(value, 10) > (new Date()).getFullYear() ? locale.validationErrors.dateTimeYear : undefined;
export const validFileUpload = value => {
    return value && value.hasOwnProperty('isValid') && !value.isValid ? locale.validationErrors.fileUpload : undefined;
};

export const fileUploadRequired = value => {
    return value === undefined || value.queue.length === 0 ? locale.validationErrors.fileUploadRequired : undefined;
};

export const isValidIssn = subject => {
    const regex = /^([ep]{0,1}ISSN |)[\d]{4}(\-|)[\d]{3}(\d|\S){1}$/;
    if (subject.trim().length === 0 || regex.test(subject)) {
        return '';
    } else {
        return locale.validationErrors.issn;
    }
};

export const isValidIsbn = subject => {
    // Checks for ISBN-10 or ISBN-13 format
    // https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
    const regex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
    return subject.trim().length === 0 || regex.test(subject) ? '' : locale.validationErrors.isbn;
};

export const isValidAuthorLink = (link) => {
    return link.valid ? '' : locale.validationErrors.authorLinking;
};

export const isValidContributorLink = (link) => {
    return link.valid ? '' : locale.validationErrors.contributorLinking;
};

// Google Scholar ID
export const isValidGoogleScholarId = id => {
    const regex = /^\w{12}$/;
    if (regex.test(id)) {
        return '';
    } else {
        return locale.validationErrors.googleScholarId;
    }
};
