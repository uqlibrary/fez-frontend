import React, { /* useCallback,*/ useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
// import { useDispatch } from 'react-redux';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

export const onRenameAttachedFile = form => (prev, next) => {
    const attachments = form.getValues('publication.fez_record_search_key_file_attachment_name');
    const originalFileAttachmentIndex = attachments.findIndex(file => {
        return file.rek_file_attachment_name === prev;
    });
    /* istanbul ignore else */
    if (originalFileAttachmentIndex > -1) {
        // will be -1 if we've already done this operation before
        attachments[originalFileAttachmentIndex].rek_file_attachment_name = next;
        form.setValue('publication.fez_record_search_key_file_attachment_name', attachments);
    }
};

export const onDeleteAttachedFile = form => file => {
    const fileName = file.dsi_dsid;
    const fileAttachmentName = form
        .getValues('publication.fez_record_search_key_file_attachment_name')
        .filter(file => file.rek_file_attachment_name === fileName)
        .shift();

    /* istanbul ignore else */
    if (!!fileAttachmentName) {
        // update datastreams
        const ds = form.getValues('securitySection.dataStreams').filter(file => file.dsi_dsid !== fileName);
        form.setValue('securitySection.dataStreams', ds);

        // update file attachment name key
        const attachmentNames = form
            .getValues('publication.fez_record_search_key_file_attachment_name')
            .filter(
                file =>
                    !!fileAttachmentName &&
                    file.rek_file_attachment_name_order !== fileAttachmentName.rek_file_attachment_name_order,
            );
        form.setValue('publication.fez_record_search_key_file_attachment_name', attachmentNames);

        // update file embargo date key
        const attachmentEmbargoDates = form
            .getValues('publication.fez_record_search_key_file_embargo_date')
            ?.filter(
                file =>
                    !!fileAttachmentName &&
                    file.rek_file_attachment_embargo_date_order !== fileAttachmentName.rek_file_attachment_name_order,
            );
        form.setValue('publication.fez_record_search_key_file_embargo_date', attachmentEmbargoDates);

        // update attachment access condition
        const attachmentAccessConditions = form
            .getValues('publication.fez_record_search_key_file_access_condition')
            ?.filter(
                file =>
                    !!fileAttachmentName &&
                    file.rek_file_access_condition_order !== fileAttachmentName.rek_file_attachment_name_order,
            );
        form.setValue('publication.fez_record_search_key_file_access_condition', attachmentAccessConditions);
    }
};

export const FilesSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const form = useFormContext();
    const oaStatus = form.getValues('adminSection.fez_record_search_key_oa_status.rek_oa_status');
    const openAccessStatusId = parseInt(oaStatus, 10);

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
            onDeleteAttachedFile={onDeleteAttachedFile(form)}
            onRenameAttachedFile={onRenameAttachedFile(form)}
        />
    );
};

FilesSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(FilesSection);
