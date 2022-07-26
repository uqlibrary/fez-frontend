import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

import FileName from './FileName';
import { FileNameProps } from './FileName';
import { Hidden } from '@material-ui/core';

const EditableFileName = ({ onFileNameChange, onFileNameBlur, handleCancelEdit, filenameRestrictions, ...props }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const isEdited = useRef(false);
    const originalFilenameRef = useRef(null);

    const onFilenameChangeProxy = event => {
        event.target.value !== originalFilenameRef.current && (isEdited.current = true);
        onFileNameChange(event.target.value);
    };

    const handleFileCancelEdit = () => {
        setIsEditing(false);
        setIsInvalid(false);
        onFileNameChange(originalFilenameRef.current, true);
        handleCancelEdit?.();
    };

    const handleFileEditFilename = () => {
        originalFilenameRef.current = props.fileName;
        setIsEditing(true);
    };

    const onFileNameBlurProxy = () => {
        setIsInvalid(!new RegExp(filenameRestrictions, 'gi').test(props.fileName));
        onFileNameBlur?.();
    };

    return (
        <>
            {!isEditing ? (
                <>
                    <Hidden smDown>
                        <Grid container alignItems={'center'} wrap="nowrap">
                            <Grid item xs={10} style={{ display: 'flex', alignItems: 'center' }}>
                                <FileName {...props} />
                            </Grid>
                            <Grid item xs>
                                <IconButton aria-label="rename file" onClick={handleFileEditFilename} size={'small'}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <FileName {...props} />
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
                    onBlur={onFileNameBlurProxy}
                    id={`${props.id}`}
                    data-testid={`${props.id}`}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton aria-label="cancel rename" onClick={handleFileCancelEdit} size={'small'}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
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
