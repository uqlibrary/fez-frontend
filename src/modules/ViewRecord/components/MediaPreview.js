import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import RaisedButton from 'material-ui/RaisedButton';

export default class MediaPreview extends Component {
    static propTypes = {
        mediaUrl: PropTypes.string.isRequired,
        previewMediaUrl: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        closeAction: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderVideoPreview = (url, mimeType) => {
        return (
            <video controls>
                <source src={url} type={mimeType} />
                {locale.viewRecord.sections.files.preview.browserNotSupportVideoTagMsg}
            </video>
        );
    }

    renderImagePreview = (url) => {
        return (
            <img src={url} />
        );
    }

    openFileInNewWindow = () => {
        window.open(this.props.mediaUrl);
    }

    getTitle = (isVideo) => {
        return isVideo ? locale.viewRecord.sections.files.preview.videoTitle : locale.viewRecord.sections.files.preview.imageTitle;
    }

    renderButtons = (closeAction) => {
        return (
            <div className="column is-narrow filePreview">
                <RaisedButton label={locale.viewRecord.sections.files.preview.openInNewWindow} onTouchTap={this.openFileInNewWindow} primary />
                <RaisedButton label={locale.viewRecord.sections.files.preview.close} onTouchTap={closeAction}/>
            </div>
        );
    }

    renderPreview = (isVideo, mediaUrl, mimeType) => {
        return isVideo ? this.renderVideoPreview(mediaUrl, mimeType) : this.renderImagePreview(mediaUrl);
    }

    render()  {
        const {previewMediaUrl, mimeType, closeAction} = this.props;
        const isVideo = mimeType.indexOf('video') === 0;

        return (
            <StandardCard title={this.getTitle(isVideo)}>
                {this.renderButtons(closeAction)}
                {this.renderPreview(isVideo, previewMediaUrl, mimeType)}
            </StandardCard>
        );
    }
}
