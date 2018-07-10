import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import AudioPlayer from './AudioPlayer';

export default class FileName extends PureComponent {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        mediaUrl: PropTypes.string.isRequired,
        previewMediaUrl: PropTypes.string.isRequired,
        onFileSelect: PropTypes.func.isRequired,
        allowDownload: PropTypes.bool
    };

    isAudio = (mimeType) => {
        return mimeType.indexOf('audio') >= 0;
    }

    isVideo = (mimeType) => {
        return mimeType.indexOf('video') >= 0;
    }

    isImage = (mimeType) => {
        return mimeType.indexOf('image') === 0;
    }

    canShowPreview = (mimeType) => {
        return this.isImage(mimeType);
        // TODO revert once videos are transcoded to open format #158519502
        // return (this.isImage(mimeType) || this.isVideo(mimeType));
    }

    showPreview = (mediaUrl, previewMediaUrl, mimeType) => (e) => {
        e.preventDefault();
        this.props.onFileSelect(mediaUrl, previewMediaUrl, mimeType);
    }

    render() {
        const {pid, fileName, allowDownload, mimeType, mediaUrl, previewMediaUrl} = this.props;

        return (
            <div className="columns is-gapless is-mobile fileDetails is-vcentered">
                <div className="column fileInfo is-vcentered">
                    {
                        allowDownload && !this.canShowPreview(mimeType) &&
                        <ExternalLink href={mediaUrl} title={fileName} download={fileName} className={'fileName'} openInNewIcon>
                            {fileName}
                        </ExternalLink>
                    }
                    {
                        allowDownload && this.canShowPreview(mimeType) &&
                        <a
                            onClick={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                            onKeyPress={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                            className={'fileName'}>
                            {fileName}
                        </a>
                    }
                    {
                        !allowDownload &&
                        fileName
                    }
                </div>
                {
                    allowDownload && this.isAudio(this.props.mimeType) &&
                    <div className="column is-narrow audioWrapper is-hidden-mobile is-vcentered">
                        <AudioPlayer pid={pid} fileName={fileName} mimeType={mimeType} />
                    </div>
                }
            </div>
        );
    }
}
