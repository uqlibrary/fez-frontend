import {validation, locale} from 'config';

export const isPartialDOIValue = value => {
    const isPartialDOI = /^10\..*/;
    return isPartialDOI.test(value);
};

export const isDOIValue = value => {
    // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
    const doiRegex1 = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
    const doiRegex2 = /^10.1002\/[^\s]+$/i;
    const doiRegex3 = /^10.\d{4}\/\d+-\d+X?(\d+)\d+<[\d\w]+:[\d\w]*>\d+.\d+.\w+;\d$/i;
    const doiRegex4 = /^10.1021\/\w\w\d+$/i;
    const doiRegex5 = /^10.1207\/[\w\d]+\&\d+_\d+$/i;

    // TODO: update with regex groups/or matching
    return (!doiRegex1.test(value) && !doiRegex2.test(value) && !doiRegex3.test(value) && !doiRegex4.test(value) && !doiRegex5.test(value)) ? false : true;
};

export const isPubMedValue = value => {
    // pubmed id is all digits, min 3 digits
    const isPubmedId = /^[\d]{3,}$/;
    return isPubmedId.test(value);
};

export const validate = values => {
    // TODO: all validation should be handled by the validation in config

    const errors = {};
    const fieldValue = values.get('doiSearch');
    const validTitle = /.{10,255}$/i;

    if (!validation.required(fieldValue) && !isDOIValue(fieldValue) && !isPubMedValue(fieldValue) && (fieldValue.trim().length === 0 || !validTitle.test(fieldValue))) {
        errors.doiSearch = locale.pages.addRecord.searchForPublication.errorMsg;
    }


    return errors;
};

