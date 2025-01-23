import React, { /* useCallback,*/ useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
// import { useDispatch } from 'react-redux';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

// import { deleteAttachedFile, renameAttachedFile } from 'actions/records';

export const FilesSection = ({ disabled = false }) => {
    // const dispatch = useDispatch();
    const { record } = useRecordContext();
    const form = useFormContext();
    const oaStatus = form.getValues('adminSection.fez_record_search_key_oa_status.rek_oa_status');
    const openAccessStatusId = parseInt(oaStatus, 10);

    const onRenameAttachedFile = React.useCallback(
        (prev, next) => {
            // const dataStreams = form.getValues('filesSection.fez_datastream_info');
            // const oldFileName = prev;
            // const newFileName = next;
            // const originalFileAttachmentIndex = dataStreams.findIndex(file => {
            //     return file.get('dsi_dsid') === oldFileName;
            // });
            // form.setValue(`filesSection.fez_datastream_info.${originalFileAttachmentIndex}.dsi`, attachments);
            console.log(form.getValues());
            const attachments = form.getValues('publication.fez_record_search_key_file_attachment_name');
            const originalFileAttachmentIndex = attachments.findIndex(file => {
                return file.rek_file_attachment_name === prev;
            });
            /* istanbul ignore else */
            if (originalFileAttachmentIndex > -1) {
                console.log('updating publication.fez_record_search_key_file_attachment_name', attachments);
                // will be -1 if we've already done this operation before
                attachments[originalFileAttachmentIndex].rek_file_attachment_name = next;
                form.setValue('publication.fez_record_search_key_file_attachment_name', attachments);
            }
        },
        [form],
    );

    /*
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
    */

    /*
if (!!formValues.filesSection?.fez_datastream_info) {
        const attachments = methods.getValues('journal.fez_record_search_key_file_attachment_name');
        let updated = false;
        formValues.filesSection.fez_datastream_info.forEach(file => {
            if (!!file.dsi_dsid_new) {
                const oldFileName = file.dsi_dsid_new;
                const newFileName = file.dsi_dsid;
                const originalFileAttachmentIndex = attachments.findIndex(file => {
                    return file.rek_file_attachment_name === oldFileName;
                });
                if (originalFileAttachmentIndex > -1) {
                    updated = true;
                    // will be -1 if we've already done this operation before
                    attachments[originalFileAttachmentIndex].rek_file_attachment_name = newFileName;
                }
            }
        });
        if (updated) {
            methods.setValue('journal.fez_record_search_key_file_attachment_name', attachments);
        }
    }
    */

    // const onDeleteAttachedFile = useCallback(file => dispatch(deleteAttachedFile(file)), [dispatch]);
    // const onRenameAttachedFile = useCallback((prev, next) => dispatch(renameAttachedFile(prev, next)), [dispatch]);

    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].files({
            isDataset: record.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION,
        }),
    );

    return (
        <Section
            cards={cards.current}
            disabled={disabled}
            openAccessStatusId={openAccessStatusId}
            // onDeleteAttachedFile={onDeleteAttachedFile}
            onRenameAttachedFile={onRenameAttachedFile}
        />
    );
};

FilesSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(FilesSection);
