import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { parseHtmlToJSX } from 'helpers/general';
import config from 'locale/viewRecord';
import Button from '@mui/material/Button';
import DOMPurify from 'dompurify';
export const navigateToEdit = (navigate, pid) => {
    navigate(`/admin/edit/${pid}?tab=authors`);
};

export const formattedString = (type, lookup) => {
    if (!!!type && !!!lookup) return '-';
    return `${type ?? ''}${type && lookup ? ' - ' : ''}${lookup ?? ''}`;
};

export const parseKey = (key, content) => {
    return key.split('.').reduce((prev, curr) => prev && prev[curr], content);
};

export const authorAffiliates = (key, content, navigate, pid, AAProblems) => {
    const hasError = AAProblems.length > 0;
    const authorAffiliate = parseKey(key, content) ?? null;

    if (!!!authorAffiliate || !Array.isArray(authorAffiliate)) {
        return config.viewRecord.adminViewRecordDrawerFields.hasNoAffiliates;
    }
    if (hasError) {
        const Problems =
            AAProblems.length > 0 &&
            AAProblems.map(item => (
                <Typography
                    variant={'body2'}
                    style={{ marginTop: 10, display: 'block' }}
                    component={'span'}
                    key={`affil_error_${item.rek_author_id}`}
                    id={`affil_error_${item.rek_author_id}`}
                    data-testid={`affil_error_${item.rek_author_id}`}
                    aria-label={`Afffiliation error for ${item.rek_author}`}
                >
                    <b>{item.rek_author}</b> {config.viewRecord.adminViewRecordDrawerFields.errorDetail(item)}
                </Typography>
            ));

        const EditButton = (
            <Button
                key={'affil_cal_error_btn'}
                onClick={() => navigateToEdit(navigate, pid)}
                style={{ marginTop: 10, width: '100%' }}
                variant="outlined"
                id="admin-fix-affiliations-button"
                data-testid="btnFixAffiliations"
            >
                {config.viewRecord.adminViewRecordDrawerFields.buttonLabel}
            </Button>
        );
        return [...Problems, EditButton];
    } else {
        return !!authorAffiliate.length > 0
            ? config.viewRecord.adminViewRecordDrawerFields.hasAffiliates
            : config.viewRecord.adminViewRecordDrawerFields.hasNoAffiliates;
    }
};

export const getDefaultDrawerDescriptorObject = () => {
    return (
        (config?.viewRecord?.adminViewRecordDefaultContent?.object && {
            ...config.viewRecord.adminViewRecordDefaultContent.object,
        }) ||
        /* istanbul ignore next */
        undefined
    );
};
export const getDefaultDrawerDescriptorIndex = () => {
    return (
        (config?.viewRecord?.adminViewRecordDefaultContent?.index && {
            ...config.viewRecord.adminViewRecordDefaultContent.index,
        }) ||
        /* istanbul ignore next */
        undefined
    );
};

/* istanbul ignore next */
export const createDefaultDrawerDescriptorObject = (
    locale = {},
    content = [],
    fields = {},
    navigate,
    pid,
    shouldHandleAffiliations = false,
    AAProblems = [],
) => {
    const adminViewRecordDefaultContentObject = getDefaultDrawerDescriptorObject();
    const adminViewRecordDefaultContentIndex = getDefaultDrawerDescriptorIndex();
    if (!adminViewRecordDefaultContentObject || !adminViewRecordDefaultContentIndex) return {};

    // Notes
    const notes = parseKey(fields.notes, content)?.trim?.();
    const parsedNotes = !notes?.length ? '-' : parseHtmlToJSX(DOMPurify.sanitize(notes));
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.notes][0].value = locale.notes;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.notes][1].value = parsedNotes;

    // Authors (Change this for new AA)
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.authors][0].value =
        locale.authorAffiliations;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.authors][0].error =
        !!shouldHandleAffiliations && AAProblems.length > 0;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.authors][1].value =
        !!shouldHandleAffiliations
            ? authorAffiliates(fields.authorAffiliates, content, navigate, pid, AAProblems)
            : config.viewRecord.adminViewRecordDrawerFields.affiliatesDoNotApply;
    // WoS
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.wos][0].value = locale.wosId;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.wos][1].value = formattedString(
        parseKey(fields.wosId, content) ?? undefined,
    );
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.wos][2].value = locale.wosDocType;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.wos][3].value = formattedString(
        parseKey(fields.wosDocType, content) ?? undefined,
        parseKey(fields.wosDocTypeLookup, content) ?? undefined,
    );

    // Scopus
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.scopus][0].value = locale.scopusId;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.scopus][1].value = formattedString(
        parseKey(fields.scopusId, content) ?? undefined,
    );
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.scopus][2].value =
        locale.scopusDocType;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.scopus][3].value = formattedString(
        parseKey(fields.scopusDocType, content) ?? undefined,
        parseKey(fields.scopusDocTypeLookup, content) ?? undefined,
    );

    // Pubmed
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][0].value = locale.pubmedId;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][1].value = formattedString(
        parseKey(fields.pubMedId, content) ?? undefined,
    );
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][2].value =
        locale.pubmedCentralId;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][3].value = formattedString(
        parseKey(fields.pubMedCentralId, content) ?? undefined,
    );
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][4].value =
        locale.pubmedDocType;
    adminViewRecordDefaultContentObject.sections[adminViewRecordDefaultContentIndex.pubmed][5].value = formattedString(
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
