import React from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import Grid from '@mui/material/GridLegacy';
import FileUploadDropzoneStaticContent from './FileUploadDropzoneStaticContent';
import { FILE_NAME_RESTRICTION, MIME_TYPE_WHITELIST } from '../config';
import { useFormContext } from 'react-hook-form';

/**
 * Remove invalid file names
 *
 * @param incomingFiles - array of files
 * @param fileNameRestrictions - RegExp
 * @returns Object
 */
export const removeInvalidFileNames = (incomingFiles, fileNameRestrictions) => {
    const validFiles = incomingFiles.filter(file => file && new RegExp(fileNameRestrictions, 'gi').test(file.name));
    const invalidFileNames = incomingFiles
        .filter(file => file && !new RegExp(fileNameRestrictions, 'gi').test(file.name))
        .map(file => file.name);

    return { validFiles: validFiles, invalidFileNames: invalidFileNames };
};

export const FileUploadDropzone = ({
    onDrop,
    maxSize,
    locale,
    fileNameRestrictions = FILE_NAME_RESTRICTION,
    mimeTypeWhitelist = MIME_TYPE_WHITELIST,
    filesInQueue = [],
    fileUploadLimit = 10,
    disabled,
}) => {
    const form = useFormContext();
    const formValues = form?.getValues('filesSection.fez_datastream_info');

    /* c8 ignore next */
    const onReadFileError = (file, errors, resolve) => () => {
        errors.push(file.name);
        return resolve(false);
    };

    const onReadFileLoad = (file, resolve) => () => {
        resolve(file);
    };

    /**
     * Try to read file and set error for a folder
     *
     * @param file
     * @param errors
     * @param resolve
     */
    const readFile = (file, errors, resolve) => {
        const fileReader = new FileReader();
        fileReader.onerror = onReadFileError(file, errors, resolve);
        fileReader.onload = onReadFileLoad(file, resolve);
        const slice = file.slice(0, 10);
        return fileReader.readAsDataURL(slice);
    };

    /**
     * Remove duplicate files from given accepted files
     *
     * @param incomingFiles
     * @param filesInQueue - list of names of files in queue to be uploaded
     * @param existingFiles - Files that are already attached from a previous upload.
     * @returns Object
     */
    const removeDuplicate = (incomingFiles, filesInQueue, existingFiles) => {
        // Ignore files from incomingFiles which have same name with different extension
        const incomingFilesWithoutDuplicateFileName = incomingFiles.reduce(
            (unique, file) => {
                const fileNameWithoutExt = file.name.slice(0, file.name.lastIndexOf('.'));
                const index = unique.fileNames.findIndex(element => {
                    return element.toLowerCase() === fileNameWithoutExt.toLowerCase();
                });
                index < 0
                    ? unique.fileNames.push(fileNameWithoutExt) && unique.incomingFiles.push(file)
                    : unique.filesWithSameNameDifferentExt.push(file.name);
                return unique;
            },
            { fileNames: [], incomingFiles: [], filesWithSameNameDifferentExt: [] },
        );

        // Ignore files from incomingFiles which have same name with different extension
        // of a formerly uploaded file (For example, when editing and adding new files)
        const incomingFilesWithoutDuplicateExisting = incomingFilesWithoutDuplicateFileName.incomingFiles.reduce(
            (unique, file) => {
                const fileNameWithoutExt = file.name.slice(0, file.name.lastIndexOf('.'));
                !existingFiles.some(
                    item =>
                        item.dsi_dsid.slice(0, item.dsi_dsid.lastIndexOf('.')).toLowerCase() ===
                            fileNameWithoutExt.toLowerCase() ||
                        (!!item?.dsi_dsid_new &&
                            item.dsi_dsid_new.slice(0, item.dsi_dsid_new.lastIndexOf('.')).toLowerCase() ===
                                fileNameWithoutExt.toLowerCase()),
                )
                    ? unique.fileNames.push(fileNameWithoutExt) && unique.incomingFiles.push(file)
                    : unique.filesWithSameNameDifferentExt.push(file.name);
                return unique;
            },
            { fileNames: [], incomingFiles: [], filesWithSameNameDifferentExt: [] },
        );

        const incomingFilesWithoutDuplicate = incomingFilesWithoutDuplicateExisting.incomingFiles.reduce(
            (unique, file) => {
                if (unique.fileNames.indexOf(file.name) === -1) {
                    const fileNameWithoutExt = file.name.slice(0, file.name.lastIndexOf('.'));

                    unique.fileNames
                        .map(fileName => fileName.slice(0, fileName.lastIndexOf('.')).toLowerCase())
                        .indexOf(fileNameWithoutExt.toLowerCase()) === -1
                        ? unique.incomingFiles.push(file)
                        : unique.filesWithSameNameDifferentExt.push(file.name);
                } else {
                    unique.incomingFiles.push(file);
                }

                return unique;
            },
            {
                fileNames: filesInQueue,
                incomingFiles: [],
                filesWithSameNameDifferentExt: [],
            },
        );

        // Ignore files from incomingFiles which are already in files queue
        const uniqueFiles = incomingFilesWithoutDuplicate.incomingFiles.filter(
            file => filesInQueue.indexOf(file.name) === -1,
        );
        const duplicateFiles = incomingFilesWithoutDuplicate.incomingFiles
            .filter(file => filesInQueue.indexOf(file.name) >= 0)
            .map(file => file.name);

        // Return unique files and errors with duplicate file names
        return {
            uniqueFiles: uniqueFiles,
            duplicateFiles: duplicateFiles,
            sameFileNameWithDifferentExt: [
                ...incomingFilesWithoutDuplicateFileName.filesWithSameNameDifferentExt,
                ...incomingFilesWithoutDuplicateExisting.filesWithSameNameDifferentExt,
                ...incomingFilesWithoutDuplicate.filesWithSameNameDifferentExt,
            ],
        };
    };

    /**
     * Remove folders from the list
     *
     * @param filesAndFolders files and/or folders
     * @param errors
     * @returns {Promise.<*>}
     */
    const removeDroppedFolders = (filesAndFolders, errors) => {
        return Promise.all(
            filesAndFolders.map(file => {
                return new Promise(resolve => {
                    readFile(file, errors, resolve);
                });
            }),
        );
    };

    /**
     * Remove invalid file names
     *
     * Note: We could use a library like this, however, anything at this end can be easily be tampered.
     * @link https://github.com/sindresorhus/file-type
     *
     * @param files - array of files
     * @param mimeTypeWhitelist - object ext -> mimetype
     * @returns Object
     */
    const removeInvalidMimeTypes = (files, mimeTypeWhitelist) => {
        const validMimeTypeFiles = files.filter(
            file =>
                file &&
                file.name &&
                mimeTypeWhitelist.hasOwnProperty(file.name.split('.').pop().toString().toLowerCase()),
        );
        const invalidMimeTypeFiles = files
            .filter(
                file =>
                    file &&
                    file.name &&
                    !mimeTypeWhitelist.hasOwnProperty(file.name.split('.').pop().toString().toLowerCase()),
            )
            .map(file => file.name);
        return { validMimeTypeFiles: validMimeTypeFiles, invalidMimeTypeFiles: invalidMimeTypeFiles };
    };

    /**
     * Remove files if there are too many files
     *
     * @param incomingFiles - array of files
     * @param maxAllowed files to return
     * @returns Object
     */
    const removeTooManyFiles = (incomingFiles, maxAllowed) => {
        const tooManyFiles = incomingFiles.slice(maxAllowed).map(file => file.name);
        const limitedFiles = incomingFiles.slice(0, maxAllowed);

        return { limitedFiles: limitedFiles, tooManyFiles: tooManyFiles };
    };

    /**
     * Handle accepted and rejected files on dropped in Dropzone
     *
     * @param incomingFiles
     * @param rejectedFiles
     * @private
     */
    const _onDrop = (incomingFiles, rejectedFiles) => {
        const existingFiles = formValues || [];
        const notFiles = [];
        // Remove folders from accepted files (async)
        removeDroppedFolders([...incomingFiles], notFiles).then(onlyFiles => {
            // Remove invalid file names
            const { validFiles, invalidFileNames } = removeInvalidFileNames(onlyFiles, fileNameRestrictions);

            // Remove duplicate files from accepted files
            const { uniqueFiles, duplicateFiles, sameFileNameWithDifferentExt } = removeDuplicate(
                validFiles,
                filesInQueue,
                existingFiles,
            );

            // Remove invalid mime type files - based on it's extension
            const { validMimeTypeFiles, invalidMimeTypeFiles } = removeInvalidMimeTypes(uniqueFiles, mimeTypeWhitelist);

            // Remove files exceeding the max number of files allowed
            const { limitedFiles, tooManyFiles } = removeTooManyFiles(
                validMimeTypeFiles,
                fileUploadLimit - filesInQueue.length,
            );

            onDrop(
                limitedFiles
                    .map(file => ({ fileData: file, name: file.name, size: file.size }))
                    .sort((a, b) => {
                        return a.name < b.name ? -1 : 1;
                    }),
                {
                    tooBigFiles: rejectedFiles.map(file => file.file.name),
                    notFiles: notFiles,
                    invalidFileNames: invalidFileNames,
                    invalidMimeTypeFiles: invalidMimeTypeFiles,
                    duplicateFiles: duplicateFiles,
                    tooManyFiles: tooManyFiles,
                    sameFileNameWithDifferentExt: sameFileNameWithDifferentExt,
                },
            );
        });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop: _onDrop, maxSize, disabled, noClick: disabled });

    return (
        <Grid container>
            <Grid item xs={12}>
                <div tabIndex={0} {...getRootProps({ id: 'FileUploadDropZone', style: { padding: '0px' } })}>
                    <input
                        {...getInputProps({
                            id: 'Uploader',
                            'aria-label': 'Upload files',
                            'data-analyticsid': 'fez-datastream-info-input',
                            'data-testid': 'fez-datastream-info-input',
                        })}
                    />
                    <FileUploadDropzoneStaticContent locale={locale} />
                </div>
            </Grid>
        </Grid>
    );
};

FileUploadDropzone.propTypes = {
    onDrop: PropTypes.func.isRequired,
    maxSize: PropTypes.number.isRequired,
    locale: PropTypes.object.isRequired,
    fileNameRestrictions: PropTypes.instanceOf(RegExp),
    mimeTypeWhitelist: PropTypes.object,
    filesInQueue: PropTypes.array,
    fileUploadLimit: PropTypes.number,
    disabled: PropTypes.bool,
};

export default FileUploadDropzone;
