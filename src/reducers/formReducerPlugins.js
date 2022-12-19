import { actionTypes } from 'redux-form';
import { ADMIN_DELETE_ATTACHED_FILE, ADMIN_RENAME_ATTACHED_FILE } from 'actions/actionTypes';

import { PUBLICATION_TYPE_CONFERENCE_PAPER, PUBLICATION_TYPE_JOURNAL_ARTICLE } from 'config/general';

export const resetValue = (state, action) => {
    switch (action.type) {
        case actionTypes.UNREGISTER_FIELD:
            if (!action.payload.name) {
                return state;
            }

            const key = action.payload.name.split('.').shift();

            if (state && state.hasIn(['initial', key])) {
                return state;
            }

            return state
                ? state
                      .deleteIn(['values', key])
                      .deleteIn(['registeredFields', action.payload.name])
                      .deleteIn(['fields', key])
                : null;
        case actionTypes.CHANGE:
            const field = action.meta.field;
            if (field === 'rek_display_type' && action.meta.touch === false) {
                return state.deleteIn(['values', 'rek_subtype']);
            }
            return state;
        default:
            return state;
    }
};

export const adminReduxFormPlugin = (state, action) => {
    switch (action.type) {
        case ADMIN_RENAME_ATTACHED_FILE:
            const oldFileName = action.payload.prev;
            const newFileName = action.payload.next;
            const originalFileAttachmentIndex = state
                .get('values')
                .get('publication')
                .get('fez_record_search_key_file_attachment_name')
                .findIndex(file => {
                    return file.get('rek_file_attachment_name') === oldFileName;
                });
            const newState = state.setIn(
                [
                    'values',
                    'publication',
                    'fez_record_search_key_file_attachment_name',
                    originalFileAttachmentIndex,
                    'rek_file_attachment_name',
                ],
                newFileName,
            );
            return newState;
        case ADMIN_DELETE_ATTACHED_FILE:
            const fileName = action.payload.dsi_dsid;
            const fileAttachmentName = state
                .get('values')
                .get('publication')
                .get('fez_record_search_key_file_attachment_name')
                .filter(file => file.toJS().rek_file_attachment_name === fileName)
                .toJS()
                .shift();

            return state
                .setIn(
                    ['values', 'securitySection', 'dataStreams'],
                    state
                        .get('values')
                        .get('securitySection')
                        .get('dataStreams')
                        .filter(file => file.toJS().dsi_dsid !== fileName),
                )
                .setIn(
                    ['values', 'publication', 'fez_record_search_key_file_attachment_name'],
                    state
                        .get('values')
                        .get('publication')
                        .get('fez_record_search_key_file_attachment_name')
                        .filter(
                            file =>
                                !!fileAttachmentName &&
                                file.toJS().rek_file_attachment_name_order !==
                                    fileAttachmentName.rek_file_attachment_name_order,
                        ),
                )
                .setIn(
                    ['values', 'publication', 'fez_record_search_key_file_attachment_embargo_date'],
                    state
                        .get('values')
                        .get('publication')
                        .get('fez_record_search_key_file_attachment_embargo_date')
                        .filter(
                            file =>
                                !!fileAttachmentName &&
                                file.toJS().rek_file_attachment_embargo_date_order !==
                                    fileAttachmentName.rek_file_attachment_name_order,
                        ),
                )
                .setIn(
                    ['values', 'publication', 'fez_record_search_key_file_attachment_access_condition'],
                    state
                        .get('values')
                        .get('publication')
                        .get('fez_record_search_key_file_attachment_access_condition')
                        .filter(
                            file =>
                                !!fileAttachmentName &&
                                file.toJS().rek_file_attachment_access_condition_order !==
                                    fileAttachmentName.rek_file_attachment_name_order,
                        ),
                );
        case actionTypes.CHANGE:
            const field = action.meta.field;
            if (
                field === 'bibliographicSection.fez_matched_journals' &&
                action.meta.touch === false &&
                [PUBLICATION_TYPE_CONFERENCE_PAPER, PUBLICATION_TYPE_JOURNAL_ARTICLE].includes(
                    state.get('values').get('rek_display_type'),
                )
            ) {
                if (action.payload === null) {
                    return state;
                }
                const issns = action.payload.fez_journal_issn.map(issn => ({
                    rek_value: {
                        key: issn.jnl_issn,
                        value: {
                            sherpaRomeo: { link: false },
                            ulrichs: { link: false, linkText: '' },
                        },
                    },
                }));
                return state
                    .setIn(
                        ['values', 'bibliographicSection', 'fez_record_search_key_journal_name', 'rek_journal_name'],
                        action.payload.value,
                    )
                    .updateIn(['values', 'bibliographicSection', 'issns'], values => values.concat(issns));
            }
            return state;
        default:
            return state;
    }
};
