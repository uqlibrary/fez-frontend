import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {pathConfig} from 'config/routes';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import AudioPlayer from './AudioPlayer';

export default class FileName extends PureComponent {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        onFileSelect: PropTypes.func.isRequired,
        previewFileName: PropTypes.string,
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
        return (this.isImage(mimeType) || this.isVideo(mimeType));
    }

    getUrl = (pid, fileName) => {
        return fileName && pathConfig.file.url(pid, fileName);
    }

    render() {
        const {pid, fileName, allowDownload, mimeType, previewFileName, onFileSelect} = this.props;
        const mediaUrl = this.getUrl(pid, fileName);
        const previewMediaUrl = this.getUrl(pid, previewFileName || fileName);

        return (
            <div className="columns is-gapless is-mobile fileDetails">
                <div className="column fileInfo">
                    {
                        allowDownload && !this.canShowPreview(mimeType) &&
                        <ExternalLink href={mediaUrl} title={fileName} className={'fileName'} openInNewIcon>
                            {fileName}
                        </ExternalLink>
                    }
                    {
                        allowDownload && this.canShowPreview(mimeType) &&
                        <a
                            href="#"
                            onClick={(e)=>{e.preventDefault(); onFileSelect(mediaUrl, previewMediaUrl, mimeType);}}
                            onKeyPress={(e)=>{e.preventDefault(); onFileSelect(mediaUrl, previewMediaUrl, mimeType);}}
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
                    <div className="column is-narrow audioWrapper is-hidden-mobile">
                        <AudioPlayer pid={pid} fileName={fileName} mimeType={mimeType} />
                    </div>
                }
            </div>
        );
    }
}
