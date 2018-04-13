import * as actions from 'actions/actionTypes';
import {openAccessConfig} from 'config';
import moment from 'moment';

export const calculateOpenAccess = (record) => {
    const openAccessStatusId = !!record.fez_record_search_key_oa_status
        && record.fez_record_search_key_oa_status.rek_oa_status;

    if (openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_DOI) {
        // OA with a possible embargo days - check now vs published date + OA embargo days
        // calculate embargo date
        const embargoDays = record.fez_record_search_key_oa_embargo_days
            && record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days
            || 0;
        const publishedDate = record.rek_date;
        const currentDate = moment().format();
        const embargoDate = embargoDays ? moment(publishedDate).add(embargoDays, 'days').format() : null;
        const pastEmgargoDate = !embargoDate || embargoDate < currentDate;
        const displayEmbargoDate = !!embargoDate && !pastEmgargoDate && embargoDate > currentDate ? moment(embargoDate).format('Do MMMM YYYY') : null;
        return {isOpenAccess: pastEmgargoDate, embargoDate: displayEmbargoDate, openAccessStatusId: openAccessStatusId};
    } else if (openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION
        || openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT
        || openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_OTHER) {
        const allFiles =  record.fez_datastream_info && record.fez_datastream_info.length > 0
            ? record.fez_datastream_info.filter(item => (
                !item.dsi_dsid.match('^(FezACML|stream|web|thumbnail|preview|presmd)')
                && (!item.dsi_label || !item.dsi_label.match('(ERA|HERDC|not publicly available|corrected thesis|restricted|lodgement|submission|corrections)', 'gi'))
            ))
            : [];
        const hasFiles = allFiles.length > 0;
        const allEmbargoFiles = hasFiles
            ? record.fez_datastream_info.filter(item => (
                !!item.dsi_embargo_date
                && moment(item.dsi_embargo_date).isAfter(moment())
                && !item.dsi_dsid.match('^(FezACML|stream|web|thumbnail|preview|presmd)'))
                && (!item.dsi_label || !item.dsi_label.match('(ERA|HERDC|not publicly available|corrected thesis|restricted|lodgement|submission|corrections)', 'gi'))
            ).sort((file1, file2) => (file1.dsi_embargo_date > file2.dsi_embargo_date ? 1 : -1))
            : [];
        // OA with a possible file embargo date
        // OA with a possible file embargo date
        return {
            isOpenAccess: !hasFiles || allFiles.length !== allEmbargoFiles.length,
            embargoDate: hasFiles && allFiles.length > 0 && allFiles.length === allEmbargoFiles.length
                ? moment(allEmbargoFiles[0].dsi_embargo_date).format('Do MMMM YYYY')
                : null,
            openAccessStatusId: openAccessStatusId
        };
    } else if (openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_PMC || openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI) {
        return {isOpenAccess: true, embargoDate: null, openAccessStatusId: openAccessStatusId};
    }
    return {isOpenAccess: false, embargoDate: null, openAccessStatusId: openAccessStatusId};
};

const publicationEnhancer = () => next => action => {
    const dompurify = require('dompurify');
    const cleanTitleConfig = { ALLOWED_TAGS: ['sub', 'sup'] };
    const noHtmlConfig = { ALLOWED_TAGS: [''] };
    const formattedFieldConfig = { ALLOWED_TAGS: ['p', 'strong', 'i', 'u', 's', 'strike', 'sup', 'sub', 'em', 'br', 'b', 'sup', 'sub'], ALLOWED_ATTR: [] };

    const cleanHtmlIfValid = (value) => {
        return dompurify.sanitize(value, noHtmlConfig).replace(/\s/g, '').length !== 0
            ? dompurify.sanitize(value, formattedFieldConfig)
            : null;
    };

    if (actions.loadPublicationsListActions.indexOf(action.type) >= 0 && !!action.payload.data) {
        const publicationsWithMethods = action.payload.data.map(publication => ({
            ...publication,
            rek_title: dompurify.sanitize(publication.rek_title, cleanTitleConfig),
            rek_description: dompurify.sanitize(publication.rek_description, formattedFieldConfig),
            calculateOpenAccess() {
                return calculateOpenAccess(this);
            }
        }));

        const enhancedAction = {
            type: action.type,
            payload: {
                ...action.payload,
                data: publicationsWithMethods
            }
        };
        return next(enhancedAction);
    } else if (actions.loadPublicationActions.indexOf(action.type) >= 0) {
        const cleanedPublication = {
            ...action.payload,
            rek_title: dompurify.sanitize(action.payload.rek_title, cleanTitleConfig),
            rek_description: dompurify.sanitize(action.payload.rek_description, formattedFieldConfig),
            rek_formatted_title: cleanHtmlIfValid(action.payload.rek_formatted_title),
            rek_formatted_abstract: cleanHtmlIfValid(action.payload.rek_formatted_abstract)
        };

        const enhancedAction = {
            type: action.type,
            payload: {
                ...cleanedPublication,
                calculateOpenAccess() {
                    return calculateOpenAccess(this);
                }
            }
        };
        return next(enhancedAction);
    } else if ((actions.loadPublicationSearchActions.indexOf(action.type) >= 0)) {
        const cleanedPublications = action.payload.map(publication => ({
            ...publication,
            rek_title: dompurify.sanitize(publication.rek_title, cleanTitleConfig),
            rek_description: dompurify.sanitize(publication.rek_description, formattedFieldConfig)
        }));
        const enhancedSearchTitleClean = {
            type: action.type,
            payload: [
                ...cleanedPublications,
            ]
        };
        return next(enhancedSearchTitleClean);
    }

    return next(action);
};

export default publicationEnhancer;
