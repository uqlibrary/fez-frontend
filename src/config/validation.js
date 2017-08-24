import Immutable from 'immutable';
import {locale} from '.';

// TODO: move all validation error text to locale.validationErrors = { ... }

// Generic
export const required = value => value ? undefined : 'This field is required';
export const email = value => !value || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Please enter a valid email address' : undefined;
export const requiredTrue = value => value === true ? undefined : 'This field is required';
export const unique = (value, array) => array.indexOf(value) !== -1 ? 'This value has already been used' : undefined;
export const url = (value) => value && !/^((http[s]?|ftp):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(value) ? 'Please enter a valid URL' : undefined;

// Min Length
export const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const maxLength10 = maxLength(10);
export const maxLength255 = maxLength(255);

// Max Length
export const minLength = min => value => value && value.trim().length < min ? `Must be at least ${min} characters` : undefined;
export const minLength10 = minLength(10);

// Array
export const arrayRequired = value => Immutable.List.isList(value) && value.size >= 1 ? undefined : 'You must select at least one item';

// Collaborators
export const cannotBeCI = value => {
    const owner = value.find(item => item.get('is_owner') === 1);
    return owner.get('is_lead') === 1 ? 'You must specify a lead UQ supervisor for a RHD project' : undefined;
};

// Project short code
export const shortCode = value => /^[a-zA-Z0-9]{8}$/.test(value) !== true ? 'The project short code must consist of 8 alpha numeric characters' : undefined;

// DateTime
export const dateTimeDay = value => value && (isNaN(value) || parseInt(value, 10) < 0 || parseInt(value, 10) > 31) ? 'Invalid date' : undefined;
export const dateTimeYear = value => !value || value.length === 0 || isNaN(value) || parseInt(value, 10) > (new Date()).getFullYear() ? 'Invalid year' : undefined;

// TODO: fix validation, make it generic etc....
export const isValidDOIValue = value => {
    // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
    const doiRegex1 = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
    const doiRegex2 = /^10.1002\/[^\s]+$/i;
    const doiRegex3 = /^10.\d{4}\/\d+-\d+X?(\d+)\d+<[\d\w]+:[\d\w]*>\d+.\d+.\w+;\d$/i;
    const doiRegex4 = /^10.1021\/\w\w\d+$/i;
    const doiRegex5 = /^10.1207\/[\w\d]+\&\d+_\d+$/i;
    // TODO: update with regex groups/or matching
    return (!doiRegex1.test(value) && !doiRegex2.test(value) && !doiRegex3.test(value) && !doiRegex4.test(value) && !doiRegex5.test(value)) ? false : true;
};

export const isValidPubMedValue = value => {
    // pubmed id is all digits, min 3 digits
    const isValid = /^[\d]{3,}$/;
    return isValid.test(value);
};

export const isValidPartialDOIValue = value => {
    const isValid = /^10\..*/;
    return isValid.test(value);
};

export const isValidPublicationTitle = value => {
    const isValid = /.{10,255}$/i;
    return isValid.test(value);
};

export const isValidContributor = value => {
    // value should not be empty and author should be linked to author id
    return !(value && value.filter(item => (item.selected)).length > 0);
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
        // // Remove non ISBN digits, then split into an array
        // const chars = subject.replace(/[- ]|^ISBN(?:-1[03])?:?/g, '').split('');
        // // Remove the final ISBN digit from `chars`, and assign it to `last`
        // const last = chars.pop();
        // let sum = 0;
        // let check;
        // let i;
        //
        // if (chars.length === 9) {
        //     // Compute the ISBN-10 check digit
        //     chars.reverse();
        //     for (i = 0; i < chars.length; i++) {
        //         sum += (i + 2) * parseInt(chars[i], 10);
        //     }
        //     check = 11 - (sum % 11);
        //     if (check === 10) {
        //         check = 'X';
        //     } else if (check === 11) {
        //         check = '0';
        //     }
        // } else {
        //     // Compute the ISBN-13 check digit
        //     for (i = 0; i < chars.length; i++) {
        //         sum += (i % 2 * 2 + 1) * parseInt(chars[i], 10);
        //     }
        //     check = 10 - (sum % 10);
        //     if (check === 10) {
        //         check = '0';
        //     }
        // }
        //
        // if (subject.trim().length === 0 || check === last) {
        //     return '';
        // } else {
        //     return 'Invalid ISBN check digit';
        // }
        return '';
    } else {
        return locale.validationErrors.isbn;
    }
};

