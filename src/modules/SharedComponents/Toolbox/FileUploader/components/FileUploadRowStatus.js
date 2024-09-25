import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Delete from '@mui/icons-material/Delete';
import Done from '@mui/icons-material/Done';

export const FileUploadRowStatus = ({
    disabled,
    onDelete,
    locale = {
        deleteHint: 'Remove this file',
        uploadInProgressText: 'Uploading...',
    },
    name,
    fileUploadRowStatusId,
}) => {
    const store = useSelector(state => state.get('fileUpload'));

    const progress = store[name] || 0;
    const isUploadInProgress = store.isUploadInProgress;

    const { deleteHint, uploadInProgressText } = locale;
    const progressProps = progress > 0 ? { variant: 'determinate', value: progress } : {};

    return (
        <Fragment>
            {!isUploadInProgress && (
                <Tooltip title={deleteHint}>
                    <span>
                        <IconButton
                            onClick={onDelete}
                            disabled={disabled}
                            data-analyticsid={`${fileUploadRowStatusId}-delete`}
                            data-testid={`${fileUploadRowStatusId}-delete`}
                            size="large"
                        >
                            <Delete />
                        </IconButton>
                    </span>
                </Tooltip>
            )}
            {isUploadInProgress && progress !== 100 && (
                <Fragment>
                    <CircularProgress {...progressProps} size={20} thickness={4} />
                    <Typography variant="caption" aria-label={progress > 0 ? `${progress}%` : uploadInProgressText}>
                        {progress > 0 ? `${progress}%` : uploadInProgressText}
                    </Typography>
                </Fragment>
            )}
            {isUploadInProgress && progress === 100 && (
                <IconButton size="large">
                    <Done />
                </IconButton>
            )}
        </Fragment>
    );
};
FileUploadRowStatus.propTypes = {
    disabled: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    locale: PropTypes.object,
    fileUploadRowStatusId: PropTypes.string,
    name: PropTypes.string,
};

export default React.memo(FileUploadRowStatus);
