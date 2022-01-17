import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import config from 'locale/viewRecord';

export const formattedDocTypeString = (type, lookup) => {
    if (!!!type && !!!lookup) return '-';
    return `${type ?? ''}${type && lookup ? ' - ' : ''}${lookup ?? ''}`;
};

export const parseKey = (key, content) => {
    return key.split('.').reduce((prev, curr) => prev && prev[curr], content);
};

export const authorAffiliates = (key, content) => {
    const authorAffiliate = parseKey(key, content) ?? null;
    if (!!!authorAffiliate || !Array.isArray(authorAffiliate)) return 'No';
    return !!authorAffiliate.length > 0 ? 'Yes' : 'No';
};

export const getDefaultDrawerDescriptorObject = () => {
    return (
        (config?.viewRecord?.adminViewRecordDefaultContent?.object && {
            ...config.viewRecord.adminViewRecordDefaultContent.object,
        }) ||
        undefined
    );
};
export const getDefaultDrawerDescriptorIndex = () => {
    return (
        (config?.viewRecord?.adminViewRecordDefaultContent?.index && {
            ...config.viewRecord.adminViewRecordDefaultContent.index,
        }) ||
        undefined
    );
};

export const createDefaultDrawerDescriptorObject = (locale = {}, content = [], fields = {}) => {
    const adminViewRecordDefaultContentObject = getDefaultDrawerDescriptorObject();
    const adminViewRecordDefaultContentIndex = getDefaultDrawerDescriptorIndex();
    if (!adminViewRecordDefaultContentObject || !adminViewRecordDefaultContentIndex) return {};

    // Notes
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.notes][0].value = locale.notes;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.notes][1].value = ReactHtmlParser(
        `${parseKey(fields.notes, content) ?? ''}`,
    );

    // Authors
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.authors][0].value =
        locale.authorAffiliations;
    adminViewRecordDefaultContentObject.sections[
        adminViewRecordDefaultContentIndex.authors
    ][1].value = authorAffiliates(fields.authorAffiliates, content);

    // WoS
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.wos][0].value = locale.wosId;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.wos][1].value =
        parseKey(fields.wosId, content) ?? undefined;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.wos][2].value = locale.wosDocType;
    adminViewRecordDefaultContentObject.sections[
        adminViewRecordDefaultContentIndex.wos
    ][3].value = formattedDocTypeString(
        parseKey(fields.wosDocType, content) ?? undefined,
        parseKey(fields.wosDocTypeLookup, content) ?? undefined,
    );

    // Scopus
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.scopus][0].value = locale.scopusId;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.scopus][1].value =
        parseKey(fields.scopusId, content) ?? undefined;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.scopus][2].value =
        locale.scopusDocType;
    adminViewRecordDefaultContentObject.sections[
        adminViewRecordDefaultContentIndex.scopus
    ][3].value = formattedDocTypeString(
        parseKey(fields.scopusDocType, content) ?? undefined,
        parseKey(fields.scopusDocTypeLookup, content) ?? undefined,
    );

    // Pubmed
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][0].value = locale.pubmedId;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][1].value =
        parseKey(fields.pubMedId, content) ?? undefined;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][2].value =
        locale.pubmedCentralId;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][3].value =
        parseKey(fields.pubMedCentralId, content) ?? undefined;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][4].value =
        locale.pubmedDocType;
    adminViewRecordDefaultContentObject.sections[
        adminViewRecordDefaultContentIndex.pubmed
    ][5].value = formattedDocTypeString(
        parseKey(fields.pubMedDocType, content) ?? undefined,
        parseKey(fields.pubMedDocTypeLookup, content) ?? undefined,
    );

    return adminViewRecordDefaultContentObject;
};
createDefaultDrawerDescriptorObject.propTypes = {
    locale: PropTypes.object.isRequired,
    content: PropTypes.array.isRequired,
    fields: PropTypes.object.isRequired,
};
