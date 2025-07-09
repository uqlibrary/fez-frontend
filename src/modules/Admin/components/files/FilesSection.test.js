import React from 'react';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';
import FilesSection, { onRenameAttachedFile, onDeleteAttachedFile } from './FilesSection';
import { PUBLICATION_TYPE_DATA_COLLECTION, PUBLICATION_TYPE_AUDIO_DOCUMENT } from 'config/general';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup({ values, ...testProps }) {
    const props = {
        ...testProps,
    };

    return rtlRender(
        <WithReduxStore>
            <FormProviderWrapper
                values={{
                    filesSection: {
                        fez_datastream_info: [],
                    },
                    ...values,
                }}
            >
                <FilesSection {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('FilesSection component', () => {
    afterEach(() => {
        useRecordContext.mockReset();
    });

    it('should render default view for Files on a publication type that DOES show advisory statement', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: PUBLICATION_TYPE_AUDIO_DOCUMENT,
            },
        }));

        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render default view for Files on a Data Collection publication type', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
            },
        }));

        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    describe('onRenameAttachedFile', () => {
        it('should rename the attached file if it exists', () => {
            const mockForm = {
                getValues: jest
                    .fn()
                    .mockReturnValue([
                        { rek_file_attachment_name: 'old_name' },
                        { rek_file_attachment_name: 'another_file' },
                    ]),
                setValue: jest.fn(),
            };

            const renameFile = onRenameAttachedFile(mockForm);
            renameFile('old_name', 'new_name');

            expect(mockForm.getValues).toHaveBeenCalledWith('publication.fez_record_search_key_file_attachment_name');
            expect(mockForm.setValue).toHaveBeenCalledWith('publication.fez_record_search_key_file_attachment_name', [
                { rek_file_attachment_name: 'new_name' },
                { rek_file_attachment_name: 'another_file' },
            ]);
        });

        it('should not rename the attached file if it does not exist', () => {
            const mockForm = {
                getValues: jest.fn().mockReturnValue([{ rek_file_attachment_name: 'another_file' }]),
                setValue: jest.fn(),
            };

            const renameFile = onRenameAttachedFile(mockForm);
            renameFile('non_existent_file', 'new_name');

            expect(mockForm.getValues).toHaveBeenCalledWith('publication.fez_record_search_key_file_attachment_name');
            expect(mockForm.setValue).not.toHaveBeenCalled();
        });
    });
    describe('onDeleteAttachedFile', () => {
        it('should delete the attached file and update all related fields if the file exists', () => {
            const mockForm = {
                getValues: jest.fn().mockImplementation(field => {
                    switch (field) {
                        case 'publication.fez_record_search_key_file_attachment_name':
                            return [
                                { rek_file_attachment_name: 'file_to_delete', rek_file_attachment_name_order: 1 },
                                { rek_file_attachment_name: 'another_file', rek_file_attachment_name_order: 2 },
                            ];
                        case 'securitySection.dataStreams':
                            return [{ dsi_dsid: 'file_to_delete' }, { dsi_dsid: 'another_file' }];
                        case 'publication.fez_record_search_key_file_embargo_date':
                            return [
                                { rek_file_attachment_embargo_date_order: 1 },
                                { rek_file_attachment_embargo_date_order: 2 },
                            ];
                        case 'publication.fez_record_search_key_file_access_condition':
                            return [{ rek_file_access_condition_order: 1 }, { rek_file_access_condition_order: 2 }];
                        default:
                            return [];
                    }
                }),
                setValue: jest.fn(),
            };

            const deleteFile = onDeleteAttachedFile(mockForm);
            deleteFile({ dsi_dsid: 'file_to_delete' });

            expect(mockForm.getValues).toHaveBeenCalledWith('publication.fez_record_search_key_file_attachment_name');
            expect(mockForm.getValues).toHaveBeenCalledWith('securitySection.dataStreams');
            expect(mockForm.getValues).toHaveBeenCalledWith('publication.fez_record_search_key_file_embargo_date');
            expect(mockForm.getValues).toHaveBeenCalledWith('publication.fez_record_search_key_file_access_condition');

            expect(mockForm.setValue).toHaveBeenCalledWith('securitySection.dataStreams', [
                { dsi_dsid: 'another_file' },
            ]);
            expect(mockForm.setValue).toHaveBeenCalledWith('publication.fez_record_search_key_file_attachment_name', [
                { rek_file_attachment_name: 'another_file', rek_file_attachment_name_order: 2 },
            ]);
            expect(mockForm.setValue).toHaveBeenCalledWith('publication.fez_record_search_key_file_embargo_date', [
                { rek_file_attachment_embargo_date_order: 2 },
            ]);
            expect(mockForm.setValue).toHaveBeenCalledWith('publication.fez_record_search_key_file_access_condition', [
                { rek_file_access_condition_order: 2 },
            ]);
        });

        it('should not update any fields if the file does not exist', () => {
            const mockForm = {
                getValues: jest.fn().mockReturnValue([]),
                setValue: jest.fn(),
            };

            const deleteFile = onDeleteAttachedFile(mockForm);
            deleteFile({ dsi_dsid: 'non_existent_file' });

            expect(mockForm.getValues).toHaveBeenCalledWith('publication.fez_record_search_key_file_attachment_name');
            expect(mockForm.setValue).not.toHaveBeenCalled();
        });
    });
});
