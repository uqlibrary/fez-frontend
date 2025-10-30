import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ReplayIcon from '@mui/icons-material/Replay';

import FileName from './FileName';
import { FileNameProps } from './FileName';

export const getFilenamePart = filename => filename.split('.').shift();
export const getFilenameExtension = filename => filename.split('.').pop();
export const getNewFilename = (filename, extension) => `${filename}.${extension}`;

const EditableFileName = ({
    onFileNameChange,
    onFileSaveFilename,
    handleFileIsValid,
    onFileCancelEdit,
    checkFileNameForErrors,
    checkFileNamesForDupes,
    ...props
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [isEdited, setIsEdited] = useState(false);
    const originalFilenameRef = useRef(null);
    const originalFilenameExtRef = useRef(null);
    const editedFilenameRef = useRef(null);
    const [proxyFilename, setProxyFilename] = useState(props.filename);

    useEffect(() => {
        // update state of filename whenever a new value is passed in props.
        // this will happen whenever several of the functions below fire
        setProxyFilename(getFilenamePart(props.fileName));

        // set edit flag whenever the filename changes
        !!originalFilenameRef.current && setIsEdited(props.fileName !== originalFilenameRef.current);

        /* c8 ignore next */
        if (!!originalFilenameRef.current && !isEditing) {
            onFileCancelEdit?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fileName]);

    const setValidFlag = value => {
        setIsValid(value);
        handleFileIsValid?.(value);
    };

    const onFilenameChangeProxy = event => {
        // update local filename proxy state var to avoid
        // input lag as the user types
        setProxyFilename(event.target.value);
    };

    const handleFileCancelEdit = () => {
        // exit editing mode and set valid to true (last known state)
        setIsEditing(false);
        setValidFlag(true);
        // set edited flag
        setIsEdited(!!editedFilenameRef.current && editedFilenameRef.current !== originalFilenameRef.current);
        // reset the filename to the last previous state (which may be an edited filename)
        setProxyFilename(getFilenamePart(editedFilenameRef.current ?? originalFilenameRef.current));
        onFileCancelEdit?.();
    };

    const handleFileEditFilename = () => {
        // save the initial filename in case we need to reset
        !!!originalFilenameRef.current && (originalFilenameRef.current = props.fileName);
        !!!originalFilenameExtRef.current && (originalFilenameExtRef.current = getFilenameExtension(props.fileName));
        setIsEditing(true);
    };

    const handleFileSaveFilename = () => {
        const newFilename = getNewFilename(proxyFilename, originalFilenameExtRef.current);
        const isValid = checkFileNameForErrors(newFilename) && checkFileNamesForDupes(newFilename);
        setValidFlag(isValid);
        // only allow exit from edit mode if the entered filename is valid
        if (isValid) {
            const previousFilename = editedFilenameRef.current;
            editedFilenameRef.current = newFilename;
            setIsEditing(false);
            onFileSaveFilename?.(originalFilenameRef.current, previousFilename, newFilename);
        }
    };

    const handleFileRestoreFilename = () => {
        setIsEdited(false);
        setValidFlag(true);
        // reset filename to original value
        onFileNameChange(originalFilenameRef.current, editedFilenameRef.current);
        editedFilenameRef.current = null;
    };

    const handleKeyPress = (key, callbackFn) => {
        if (key.code.toLowerCase() === 'enter' || key.code.toLowerCase() === 'numpadenter') {
            key.preventDefault();
            callbackFn?.(originalFilenameRef.current);
        }
    };

    return (
        <>
            {!isEditing ? (
                <Grid container alignItems={'center'} wrap="nowrap">
                    <Grid item xs={12} sm={8} sx={{ display: 'flex', alignItems: 'center' }}>
                        {!!!isEdited && <FileName {...props} />}
                        {!!isEdited && (
                            <Typography
                                data-testid={`${props.id}-edited`}
                                variant="body2"
                                color="textPrimary"
                                sx={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {editedFilenameRef.current}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item sm sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            aria-label="rename file"
                            onClick={handleFileEditFilename}
                            size={'small'}
                            id={`${props.id}-edit`}
                            data-analyticsid={`${props.id}-edit`}
                            data-testid={`${props.id}-edit`}
                        >
                            <EditIcon />
                        </IconButton>
                        {!!isEdited && (
                            <IconButton
                                aria-label="reset file name"
                                onClick={handleFileRestoreFilename}
                                size={'small'}
                                id={`${props.id}-reset`}
                                data-analyticsid={`${props.id}-reset`}
                                data-testid={`${props.id}-reset`}
                            >
                                <ReplayIcon />
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
            ) : (
                <>
                    <TextField
                        autoFocus
                        fullWidth
                        hideLabel
                        required
                        textFieldId={`${props.id}-editing`}
                        value={proxyFilename}
                        onChange={onFilenameChangeProxy}
                        onKeyPress={key => handleKeyPress(key, handleFileSaveFilename)}
                        autoComplete="off"
                        error={!isValid}
                        InputProps={{
                            type: 'text',
                            endAdornment: (
                                <>
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="save rename"
                                            onClick={handleFileSaveFilename}
                                            size={'small'}
                                            id={`${props.id}-save`}
                                            data-analyticsid={`${props.id}-save`}
                                            data-testid={`${props.id}-save`}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="cancel rename"
                                            onClick={handleFileCancelEdit}
                                            size={'small'}
                                            id={`${props.id}-cancel`}
                                            data-analyticsid={`${props.id}-cancel`}
                                            data-testid={`${props.id}-cancel`}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                </>
                            ),
                        }}
                    />
                </>
            )}
        </>
    );
};

export const EditableFileNameProps = {
    onFileNameChange: PropTypes.func,
    onFileSaveFilename: PropTypes.func,
    onFileCancelEdit: PropTypes.func,
    handleFileIsValid: PropTypes.func,
    checkFileNameForErrors: PropTypes.func,
    checkFileNamesForDupes: PropTypes.func,
    ...FileNameProps,
};

EditableFileName.propTypes = { ...EditableFileNameProps };

export default EditableFileName;
