import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

export default class MediaPreview extends Component {
    static propTypes = {
        mediaUrl: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired
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

    renderPreview = (mediaUrl, mimeType) => {
        if (this.isVideo(mimeType)) {
            return this.renderVideoPreview(mediaUrl, mimeType);
        } else if (this.isImage(mimeType)) {
            return this.renderImagePreview(mediaUrl);
        } else {
            return <span/>;
        }
    }

    renderImagePreview = (url) => {
        return (
            <img src={url} />
        );
    }

    isVideo = (mimeType) => {
        return mimeType.indexOf('video') === 0;
    }

    isImage = (mimeType) => {
        return mimeType.indexOf('image') === 0;
    }

    getTitle = (mimeType) => {
        return this.isVideo(mimeType) ? locale.viewRecord.sections.files.preview.videoTitle : locale.viewRecord.sections.files.preview.imageTitle;
    }

    render()  {
        const {mediaUrl, mimeType} = this.props;

        return (
            <StandardCard title={this.getTitle(mimeType)}>
                {this.renderPreview(mediaUrl, mimeType)}
            </StandardCard>
        );
    }
}
