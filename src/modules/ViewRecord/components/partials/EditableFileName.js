import React, { useState, useRef } from 'react';
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

const EditableFileName = ({ onFileNameChange, onFileNameBlur, handleCancelEdit, filenameRestrictions, ...props }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const isEdited = useRef(false);
    const originalFilenameRef = useRef(null);
    const editingFilenameRef = useRef(null);

    const onFilenameChangeProxy = event => {
        isEdited.current = event.target.value !== originalFilenameRef.current;
        onFileNameChange(event.target.value);
    };

    const handleFileCancelEdit = () => {
        setIsEditing(false);
        setIsInvalid(false);
        onFileNameChange(editingFilenameRef.current ?? originalFilenameRef.current, true);
        handleCancelEdit?.();
    };

    const handleFileEditFilename = () => {
        !!!originalFilenameRef.current && (originalFilenameRef.current = props.fileName);
        editingFilenameRef.current = props.fileName;
        setIsEditing(true);
    };

    const handleFileSaveFilename = () => {
        const isInvalid = !new RegExp(filenameRestrictions, 'gi').test(props.fileName);
        setIsInvalid(isInvalid);
        !isInvalid && setIsEditing(false);
        onFileNameBlur?.();
    };

    const handleFileRestoreFilename = () => {
        onFileNameChange(originalFilenameRef.current);
        isEdited.current = false;
        setIsInvalid(false);
    };

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
                    error={isInvalid}
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
    onFileNameBlur: PropTypes.func,
    handleCancelEdit: PropTypes.func,
    filenameRestrictions: PropTypes.any,
    ...FileNameProps,
};

EditableFileName.propTypes = { ...EditableFileNameProps };

export default EditableFileName;
