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
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
}));

const EditableFileName = ({
    onFileNameChange,
    onFileSaveFilename,
    handleFileIsValid,
    onFileCancelEdit,
    checkFileNameForErrors,
    ...props
}) => {
    const classes = useStyles();
    const [isEditing, setIsEditing] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [isEdited, setIsEdited] = useState(false);
    const originalFilenameRef = useRef(null);
    const originalFilenameExtRef = useRef(null);
    const editedFilenameRef = useRef(null);
    const [proxyFilename, setProxyFilename] = useState(props.filename);

    const getFilenamePart = filename => filename.split('.').shift();
    const getNewFilename = filename => `${filename}.${originalFilenameExtRef.current}`;

    useEffect(() => {
        // update state of filename whenever a new value is passed in props.
        // this will happen whenever several of the functions below fire
        setProxyFilename(getFilenamePart(props.fileName));

        // set edit flag whenever the filename changes
        !!originalFilenameRef.current && setIsEdited(props.fileName !== originalFilenameRef.current);

        /* istanbul ignore next */
        if (!!originalFilenameRef.current && !isEditing) {
            onFileCancelEdit?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fileName]);

    const onFilenameChangeProxy = event => {
        // update local filename proxy state var to avoid
        // input lag as the user types
        setProxyFilename(event.target.value);
    };

    const handleFileCancelEdit = () => {
        // exit editing mode and set valid to true (last known state)
        setIsEditing(false);
        setIsValid(true);
        // set edited flag
        setIsEdited(!!editedFilenameRef.current && editedFilenameRef.current !== originalFilenameRef.current);
        // reset the filename to the last previous state (which may be an edited filename)
        setProxyFilename(getFilenamePart(editedFilenameRef.current ?? originalFilenameRef.current));
    };

    const handleFileEditFilename = () => {
        // save the initial filename in case we need to reset
        !!!originalFilenameRef.current && (originalFilenameRef.current = props.fileName);
        !!!originalFilenameExtRef.current && (originalFilenameExtRef.current = props.fileName.split('.').pop());
        setIsEditing(true);
    };

    const handleFileSaveFilename = () => {
        const newFilename = getNewFilename(proxyFilename);
        const isValid = checkFileNameForErrors(newFilename);

        setIsValid(isValid);
        // only allow exit from edit mode if the entered filename is valid
        if (isValid) {
            editedFilenameRef.current = newFilename;
            setIsEditing(false);
            onFileSaveFilename?.(originalFilenameRef.current, newFilename);
        }
    };

    const handleFileRestoreFilename = () => {
        setIsEdited(false);
        setIsValid(true);
        editedFilenameRef.current = null;
        // reset filename to original value
        onFileNameChange(originalFilenameRef.current);
    };

    const handleKeyPress = (key, callbackFn) => {
        if (key.code.toLowerCase() === 'enter' || key.code.toLowerCase() === 'numpadenter') {
            key.preventDefault();
            callbackFn?.(originalFilenameRef.current);
        }
    };

    useEffect(() => {
        handleFileIsValid?.(isValid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValid]);

    return (
        <>
            {!isEditing ? (
                <>
                    <Hidden smDown>
                        <Grid container alignItems={'center'} wrap="nowrap">
                            <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                                {!!!isEdited && <FileName {...props} />}
                                {!!isEdited && (
                                    <Typography variant="body2" color="textPrimary" className={classes.labelTruncated}>
                                        {editedFilenameRef.current}
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
                                {!!isEdited && (
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
                        {!!!isEdited && <FileName {...props} />}
                        {!!isEdited && (
                            <Typography variant="body2" color="textPrimary" className={classes.labelTruncated}>
                                {editedFilenameRef.current}
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
                    value={proxyFilename}
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
    checkFileNameForErrors: PropTypes.func,
    ...FileNameProps,
};

EditableFileName.propTypes = { ...EditableFileNameProps };

export default EditableFileName;
