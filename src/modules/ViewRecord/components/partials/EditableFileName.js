import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ReplayIcon from '@material-ui/icons/Replay';

import FileName from './FileName';
import { FileNameProps } from './FileName';
import { Hidden } from '@material-ui/core';

const EditableFileName = ({
    onFileNameChange,
    onFileSaveFilename,
    handleFileIsValid,
    onFileCancelEdit,
    filenameRestrictions,
    ...props
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const isEdited = useRef(false);
    const originalFilenameRef = useRef(null);
    const editingFilenameRef = useRef(null);

    const onFilenameChangeProxy = event => {
        isEdited.current = event.target.value !== originalFilenameRef.current;
        onFileNameChange(event.target.value);
    };

    const handleFileCancelEdit = () => {
        setIsEditing(false);
        setIsValid(true);
        isEdited.current = editingFilenameRef.current !== originalFilenameRef.current;
        onFileNameChange(editingFilenameRef.current ?? originalFilenameRef.current, true);
        onFileCancelEdit?.();
        /* HERE  - NEED TO ADDRESS ISSUE OF MULTIPLE FILES EDITING AT SAME TIME,
        WHEN ONE IS CANCELLED ANY ERRORS FROM THE OTHER FILES ARE CLEARED.
        ALSO NEED TO TRUNCATE THE LONG TEXT OF A FILENAME AFTER BEING EDITED */
    };

    const handleFileEditFilename = () => {
        !!!originalFilenameRef.current && (originalFilenameRef.current = props.fileName);
        editingFilenameRef.current = props.fileName;
        setIsEditing(true);
    };

    const handleFileSaveFilename = () => {
        const isValid = new RegExp(filenameRestrictions, 'gi').test(props.fileName);
        setIsValid(isValid);
        isValid && setIsEditing(false);
        onFileSaveFilename?.();
    };

    const handleFileRestoreFilename = () => {
        onFileNameChange(originalFilenameRef.current);
        isEdited.current = false;
        setIsValid(true);
    };

    useEffect(() => {
        handleFileIsValid?.(isEditing ? false : isValid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, isValid]);

    return (
        <>
            {!isEditing ? (
                <>
                    <Hidden smDown>
                        <Grid container alignItems={'center'} wrap="nowrap">
                            <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                                {!!!isEdited.current && <FileName {...props} />}
                                {!!isEdited.current && (
                                    <Typography variant="body2" color="textPrimary">
                                        {props.fileName}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs>
                                <IconButton aria-label="rename file" onClick={handleFileEditFilename} size={'small'}>
                                    <EditIcon />
                                </IconButton>
                                {!!isEdited.current && (
                                    <IconButton
                                        aria-label="rename file"
                                        onClick={handleFileRestoreFilename}
                                        size={'small'}
                                    >
                                        <ReplayIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        {!!!isEdited.current && <FileName {...props} />}
                        {!!isEdited.current && (
                            <Typography variant="body2" color="textPrimary">
                                {props.fileName}
                            </Typography>
                        )}
                    </Hidden>
                </>
            ) : (
                <Input
                    autoFocus
                    required
                    error={!isValid}
                    type={'text'}
                    value={props.fileName}
                    onChange={onFilenameChangeProxy}
                    id={`${props.id}-editing`}
                    data-testid={`${props.id}-editing`}
                    endAdornment={
                        <>
                            <InputAdornment position="end">
                                <IconButton aria-label="save rename" onClick={handleFileSaveFilename} size={'small'}>
                                    <CheckIcon />
                                </IconButton>
                                <IconButton aria-label="cancel rename" onClick={handleFileCancelEdit} size={'small'}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        </>
                    }
                />
            )}
        </>
    );
};

export const EditableFileNameProps = {
    onFileNameChange: PropTypes.func,
    onFileSaveFilename: PropTypes.func,
    onFileCancelEdit: PropTypes.func,
    handleFileIsValid: PropTypes.func,
    filenameRestrictions: PropTypes.any,
    ...FileNameProps,
};

EditableFileName.propTypes = { ...EditableFileNameProps };

export default EditableFileName;
