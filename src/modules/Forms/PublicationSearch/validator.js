import {validation} from '../../../config';

export const isDOIValue = value => {
    // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
    const doiRegex1 = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
    const doiRegex2 = /^10.1002\/[^\s]+$/i;
    const doiRegex3 = /^10.\d{4}\/\d+-\d+X?(\d+)\d+<[\d\w]+:[\d\w]*>\d+.\d+.\w+;\d$/i;
    const doiRegex4 = /^10.1021\/\w\w\d+$/i;
    const doiRegex5 = /^10.1207\/[\w\d]+\&\d+_\d+$/i;

    return (!doiRegex1.test(value) && !doiRegex2.test(value) && !doiRegex3.test(value) && !doiRegex4.test(value) && !doiRegex5.test(value)) ? false : true;
};

export const isPubMedValue = value => {
    const numbersOnlyRegex = /^[\d]*$/; // pubmed regex
    return numbersOnlyRegex.test(value);
};

export const validate = values => {
    const errors = {};
    const fieldValue = values.get('doiSearch');

    errors.doiSearch = validation.required(fieldValue);


    const titleRegex = /^[a-zA-Z\s\d\!\?\-]+$/; // title regex

    if (!isDOIValue(fieldValue) && !isPubMedValue(fieldValue) && !titleRegex.test(fieldValue)) {
        errors.doiSearch = 'Please enter a valid publication DOI (e.g. 10.1163/9789004326828), Pubmed ID (e.g. 28131963) or the title of the publication';
    }

    return errors;
};

