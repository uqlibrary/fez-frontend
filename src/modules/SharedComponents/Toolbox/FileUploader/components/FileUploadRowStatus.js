import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import Delete from '@material-ui/icons/Delete';
import Done from '@material-ui/icons/Done';

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
                        <IconButton
                            onClick={this.props.onDelete}
                            disabled={disabled}
                            data-testid={`${this.props.fileUploadRowStatusId}-delete`}
                        >
                            <Delete />
                        </IconButton>
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
                    <IconButton>
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
