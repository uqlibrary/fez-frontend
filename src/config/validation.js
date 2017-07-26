import Immutable from 'immutable';

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

