import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Delete from '@mui/icons-material/Delete';
import Done from '@mui/icons-material/Done';

export class FileUploadRowStatus extends PureComponent {
    static propTypes = {
        progress: PropTypes.number,
        isUploadInProgress: PropTypes.bool,
        disabled: PropTypes.bool,
        onDelete: PropTypes.func.isRequired,
        locale: PropTypes.object,
        name: PropTypes.string,
        fileUploadRowStatusId: PropTypes.string,
    };

    static defaultProps = {
        locale: {
            deleteHint: 'Remove this file',
            uploadInProgressText: 'Uploading...',
        },
    };

    render() {
        const { isUploadInProgress, disabled, progress } = this.props;
        const { deleteHint, uploadInProgressText } = this.props.locale;
        const progressProps = progress > 0 ? { variant: 'determinate', value: progress } : {};

        return (
            <Fragment>
                {!isUploadInProgress && (
                    <Tooltip title={deleteHint}>
                        <span>
                            <IconButton
                                onClick={this.props.onDelete}
                                disabled={disabled}
                                data-analyticsid={`${this.props.fileUploadRowStatusId}-delete`}
                                data-testid={`${this.props.fileUploadRowStatusId}-delete`}
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
    }
}

export const mapStateToProps = (state, ownProps) => {
    return {
        progress: (!!state.get('fileUpload') && state.get('fileUpload')[ownProps.name]) || 0,
        isUploadInProgress: !!state.get('fileUpload') && state.get('fileUpload').isUploadInProgress,
    };
};

export default connect(mapStateToProps)(FileUploadRowStatus);
