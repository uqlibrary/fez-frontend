import { loadPublicationsListActions, loadPublicationActions } from 'actions/actionTypes';
import { openAccessConfig, viewRecordsConfig } from 'config';
import moment from 'moment';
import { isAdded } from 'helpers/datastreams';

export const calculateOpenAccess = record => {
    const openAccessStatusId =
        !!record.fez_record_search_key_oa_status &&
        Number.isFinite(record.fez_record_search_key_oa_status.rek_oa_status)
            ? record.fez_record_search_key_oa_status.rek_oa_status
            : null;

    if (
        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_DOI ||
        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_RDM
    ) {
        // OA with a possible embargo days - check now vs published date + OA embargo days
        // calculate embargo date
        const currentDate = moment().format();
        const embargoDays =
            (record.fez_record_search_key_oa_embargo_days &&
                record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days) ||
            0;
        let embargoDate =
            (record.fez_record_search_key_embargo_to && record.fez_record_search_key_embargo_to.rek_embargo_to) || null;
        const publishedDate = record.rek_date;
        embargoDate =
            !embargoDate && embargoDays
                ? moment(publishedDate)
                      .add(embargoDays, 'days')
                      .format()
                : embargoDate;
        const pastEmgargoDate = !embargoDate || embargoDate < currentDate;
        const displayEmbargoDate =
            !!embargoDate && !pastEmgargoDate && embargoDate > currentDate
                ? moment(embargoDate).format('Do MMMM YYYY')
                : null;

        return {
            isOpenAccess: pastEmgargoDate,
            embargoDate: displayEmbargoDate,
            openAccessStatusId: openAccessStatusId,
        };
    }

    if (
        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION ||
        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT ||
        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_FILE_AUTHOR_PREPRINT ||
        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_OTHER
    ) {
        const allFiles =
            (record.fez_datastream_info || []).length > 0
                ? record.fez_datastream_info.filter(
                      item => !item.dsi_dsid.match(viewRecordsConfig.files.blacklist.namePrefixRegex) && isAdded(item),
                  )
                : [];
        const hasFiles = allFiles.length > 0;
        const allEmbargoFiles = hasFiles
            ? record.fez_datastream_info
                  .filter(
                      item =>
                          !!item.dsi_embargo_date &&
                          moment(item.dsi_embargo_date).isAfter(moment()) &&
                          !item.dsi_dsid.match(viewRecordsConfig.files.blacklist.namePrefixRegex) &&
                          isAdded(item),
                  )
                  .sort((file1, file2) => (file1.dsi_embargo_date > file2.dsi_embargo_date ? 1 : -1))
            : [];
        // OA with a possible file embargo date
        // OA with a possible file embargo date
        return {
            isOpenAccess: !hasFiles || allFiles.length !== allEmbargoFiles.length,
            embargoDate:
                hasFiles && allFiles.length > 0 && allFiles.length === allEmbargoFiles.length
                    ? moment(allEmbargoFiles[0].dsi_embargo_date).format('Do MMMM YYYY')
                    : null,
            openAccessStatusId: openAccessStatusId,
        };
    }

    const isOpenAccess =
        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_PMC ||
        openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI;

    return {
        isOpenAccess: isOpenAccess,
        embargoDate: null,
        openAccessStatusId: openAccessStatusId,
    };
};

export const enhancePublication = record => {
    const dompurify = require('dompurify');
    const cleanTitleConfig = { ALLOWED_TAGS: ['sub', 'sup'] };
    const noHtmlConfig = { ALLOWED_TAGS: [''] };
    const allowedHtmlConfig = {
        ALLOWED_TAGS: [
            'p',
            'strong',
            'i',
            'u',
            's',
            'strike',
            'sup',
            'sub',
            'em',
            'br',
            'b',
            'sup',
            'sub',
            'a',
            'ol',
            'ul',
            'li',
        ],
        ALLOWED_ATTR: [],
    };

    const cleanHtmlIfValid = value =>
        dompurify.sanitize(value, noHtmlConfig).replace(/\s/g, '').length !== 0
            ? dompurify.sanitize(value, allowedHtmlConfig)
            : null;

    return {
        ...record,
        rek_title: dompurify.sanitize(record.rek_title, cleanTitleConfig),
        rek_formatted_title: cleanHtmlIfValid(record.rek_formatted_title),
        rek_formatted_abstract: cleanHtmlIfValid(record.rek_formatted_abstract),
        calculateOpenAccess() {
            if (!!this.rek_pid) return calculateOpenAccess(this);
            return null;
        },
    };
};

const publicationEnhancer = () => next => action => {
    if (loadPublicationsListActions.test(action.type) && !!action.payload.data) {
        const enhancedPublications = action.payload.data.map(publication => ({
            ...enhancePublication(publication),
        }));

        const enhancedAction = {
            type: action.type,
            payload: {
                ...action.payload,
                data: enhancedPublications,
            },
        };
        return next(enhancedAction);
    } else if (loadPublicationActions.test(action.type)) {
        const enhancedAction = {
            ...action,
            payload: {
                ...enhancePublication(action.payload),
            },
        };
        return next(enhancedAction);
    }

    return next(action);
};

export default publicationEnhancer;
