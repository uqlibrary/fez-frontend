
import {default as locale} from './locale';

const {validationErrors} = locale;

// Generic
export const required = value => value ? undefined : validationErrors.required;
export const email = value => !value || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? validationErrors.email : undefined;
export const url = (value) => value && !/^((http[s]?|ftp[s]?):\/\/)?([\w\.-]+)\.([a-z\.]{1,6})([\/\w \?\&\=\.\+-]*)\/?$/i.test(value) ? validationErrors.url : undefined;
export const authorRequired = (authors) => !authors || authors.length === 0 || authors.filter(item => (item.selected)).length === 0 ? validationErrors.authorRequired : undefined;

// Min Length
export const maxLength = max => value => value && value.length > max ? validationErrors.maxLength.replace('[max]', max) : undefined;
export const maxLength10 = maxLength(10);
export const maxLength255 = maxLength(255);

// Max Length
export const minLength = min => value => value && value.trim().length < min ? validationErrors.minLength.replace('[min]', min) : undefined;
export const minLength10 = minLength(10);

// DateTime
export const dateTimeDay = value => value && (isNaN(value) || parseInt(value, 10) < 0 || parseInt(value, 10) > 31) ? validationErrors.dateTimeDay : undefined;
export const dateTimeYear = value => !value || value.length === 0 || isNaN(value) || parseInt(value, 10) > (new Date()).getFullYear() ? validationErrors.dateTimeYear : undefined;

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

export const validFileUpload = value => {
    return value && value.hasOwnProperty('isValid') && !value.isValid ? validationErrors.fileUpload : undefined;
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

    if (subject.trim().length === 0 || regex.test(subject)) {
        return '';
    } else {
        return locale.validationErrors.isbn;
    }
};

export const isValidAuthorLink = (link) => {
    return link.valid ? '' : locale.validationErrors.authorLinking;
};
