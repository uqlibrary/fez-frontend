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
    }

    render()  {
        const {mediaUrl, previewMediaUrl, mimeType} = this.props;
        const isVideo = mimeType.indexOf('video') >= 0;
        const isImage = mimeType.indexOf('image') >= 0;
        const title = isVideo ? locale.viewRecord.sections.files.preview.videoTitle : locale.viewRecord.sections.files.preview.imageTitle;

        return (
            <StandardCard title={title} className={'mediaPreview'}>
                <div className="column is-narrow buttons">
                    <RaisedButton label={locale.viewRecord.sections.files.preview.openInNewWindow} onClick={this.openFileInNewWindow} primary />
                    <RaisedButton label={locale.viewRecord.sections.files.preview.close} onClick={this.props.onClose}/>
                </div>
                {
                    isVideo &&
                    <video controls>
                        <source src={previewMediaUrl} type={mimeType} />
                        {locale.viewRecord.sections.files.preview.browserNotSupportVideoTagMsg}
                    </video>
                }
                {
                    isImage &&
                    <img src={previewMediaUrl} alt={mediaUrl}/>
                }
            </StandardCard>
        );
    }
}
