import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Hidden } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ReplayIcon from '@material-ui/icons/Replay';
import { makeStyles } from '@material-ui/core/styles';

import FileName from './FileName';
import { FileNameProps } from './FileName';

const useStyles = makeStyles(() => ({
    labelTruncated: {
        overflow: 'hidden',
        whiteSspace: 'nowrap',
        textOverflow: 'ellipsis',
    },
}));

const EditableFileName = ({
    onFileNameChange,
    onFileSaveFilename,
    handleFileIsValid,
    onFileCancelEdit,
    filenameRestrictions,
    ...props
}) => {
    const classes = useStyles();
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

    const handleKeyPress = (key, callbackFn) => {
        if (key.code.toLowerCase() === 'enter' || key.code.toLowerCase() === 'numpadenter') {
            key.preventDefault();
            callbackFn?.();
        }
    };

    useEffect(() => {
        handleFileIsValid?.(isEditing ? false : isValid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, isValid]);

    useEffect(() => {
        if (!!originalFilenameRef.current && !isEditing) {
            onFileCancelEdit?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fileName]);

    return (
        <>
            {!isEditing ? (
                <>
                    <Hidden smDown>
                        <Grid container alignItems={'center'} wrap="nowrap">
                            <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                                {!!!isEdited.current && <FileName {...props} />}
                                {!!isEdited.current && (
                                    <Typography variant="body2" color="textPrimary" className={classes.labelTruncated}>
                                        {props.fileName}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs>
                                <IconButton
                                    aria-label="rename file"
                                    onClick={handleFileEditFilename}
                                    size={'small'}
                                    id={`${props.id}-edit`}
                                    data-testid={`${props.id}-edit`}
                                >
                                    <EditIcon />
                                </IconButton>
                                {!!isEdited.current && (
                                    <IconButton
                                        aria-label="reset file name"
                                        onClick={handleFileRestoreFilename}
                                        size={'small'}
                                        id={`${props.id}-reset`}
                                        data-testid={`${props.id}-reset`}
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
                            <Typography variant="body2" color="textPrimary" className={classes.labelTruncated}>
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
                    onKeyPress={key => handleKeyPress(key, handleFileSaveFilename)}
                    id={`${props.id}-editing`}
                    data-testid={`${props.id}-editing`}
                    endAdornment={
                        <>
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="save rename"
                                    onClick={handleFileSaveFilename}
                                    size={'small'}
                                    id={`${props.id}-save`}
                                    data-testid={`${props.id}-save`}
                                >
                                    <CheckIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="cancel rename"
                                    onClick={handleFileCancelEdit}
                                    size={'small'}
                                    id={`${props.id}-cancel`}
                                    data-testid={`${props.id}-cancel`}
                                >
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
