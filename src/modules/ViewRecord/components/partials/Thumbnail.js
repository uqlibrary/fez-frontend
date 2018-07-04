import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class Thumbnail extends PureComponent {
    static propTypes = {
        mediaUrl: PropTypes.string.isRequired,
        previewMediaUrl: PropTypes.string.isRequired,
        thumbnailMediaUrl: PropTypes.string.isRequired,
        thumbnailFileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        onClick: PropTypes.func
    };

    showPreview = (mediaUrl, previewMediaUrl, mimeType) => (e) => {
        e.preventDefault();
        this.props.onClick(mediaUrl, previewMediaUrl, mimeType);
    };

    imageError = (e) => {
        e.target.src = '/public/images/nothumbnail.svg';
    };

    render() {
        const {mediaUrl, thumbnailMediaUrl, previewMediaUrl, thumbnailFileName, mimeType} = this.props;
        return (
            <a
                onClick={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                onKeyPress={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                className={'fileThumbnail'}>
                <img src={thumbnailMediaUrl} alt={thumbnailFileName} onError={this.imageError}/>
            </a>
        );
    }
}

export default Thumbnail;
