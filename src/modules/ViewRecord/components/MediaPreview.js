import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import RaisedButton from 'material-ui/RaisedButton';

export default class MediaPreview extends PureComponent {
    static propTypes = {
        mediaUrl: PropTypes.string.isRequired,
        previewMediaUrl: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired
    };

    openFileInNewWindow = () => {
        window.open(this.props.mediaUrl);
    };

    render()  {
        const {mediaUrl, previewMediaUrl, mimeType} = this.props;
        const {videoTitle, imageTitle, openInNewWindow, close, browserNotSupportVideoTagMsg} = locale.viewRecord.sections.files.preview;
        const isVideo = mimeType.indexOf('video') >= 0;
        const isImage = mimeType.indexOf('image') >= 0;
        const title = isVideo ? videoTitle : imageTitle;
        return (
            <StandardCard title={title} className={'mediaPreview'}>
                <div className="column is-narrow buttons">
                    <RaisedButton label={openInNewWindow} onClick={this.openFileInNewWindow} primary />
                    <RaisedButton label={close} onClick={this.props.onClose}/>
                </div>
                {
                    isVideo &&
                    <video controls>
                        <source src={previewMediaUrl} type={mimeType} />
                        {browserNotSupportVideoTagMsg}
                    </video>
                }
                {
                    isImage &&
                        <img id="previewImage" src={previewMediaUrl} alt={mediaUrl} />
                }
            </StandardCard>
        );
    }
}
