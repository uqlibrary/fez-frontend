import React, {PureComponent, Fragment} from 'react';
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

    getMediaPreviewButtons = () => (fullWidth = false) => {
        const {openInNewWindow, close, onClose} = locale.viewRecord.sections.files.preview;
        return (
            <Fragment>
                <div className={`column ${fullWidth ? 'is-12' : 'is-narrow'} download`}>
                    <RaisedButton label={openInNewWindow} onClick={this.openFileInNewWindow} primary fullWidth={fullWidth} />
                </div>
                <div className={`column ${fullWidth ? 'is-12' : 'is-narrow'}`}>
                    <RaisedButton label={close} onClick={onClose} fullWidth={fullWidth} />
                </div>
            </Fragment>
        );
    };

    render()  {
        const {mediaUrl, previewMediaUrl, mimeType} = this.props;
        const {videoTitle, imageTitle, browserNotSupportVideoTagMsg} = locale.viewRecord.sections.files.preview;
        const isVideo = mimeType.indexOf('video') >= 0;
        const isImage = mimeType.indexOf('image') >= 0;
        const title = isVideo ? videoTitle : imageTitle;
        const mediaPreviewButtons = this.getMediaPreviewButtons();
        return (
            <StandardCard title={title} className={'mediaPreview'}>
                <div className="columns is-gapless buttons is-hidden-mobile is-clearfix">
                    <div className="column" />
                    {
                        mediaPreviewButtons()
                    }
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
                <div className="columns is-gapless buttons is-hidden-tablet is-clearfix">
                    {
                        mediaPreviewButtons(true)
                    }
                </div>
            </StandardCard>
        );
    }
}
