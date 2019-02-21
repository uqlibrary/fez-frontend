import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import BrokenImage from '@material-ui/icons/BrokenImage';
import {withStyles} from '@material-ui/core/styles';
import locale from 'locale/pages';

const styles = () => ({
    image: {
        width: '100%',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    brokenImage: {
        opacity: 0.5,
    }
});

export class Thumbnail extends Component {
    static propTypes = {
        mediaUrl: PropTypes.string.isRequired,
        previewMediaUrl: PropTypes.string.isRequired,
        thumbnailMediaUrl: PropTypes.string.isRequired,
        thumbnailFileName: PropTypes.string.isRequired,
        fileName: PropTypes.string,
        mimeType: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        classes: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            thumbnailError: false
        };
    }

    showPreview = (mediaUrl, previewMediaUrl, mimeType) => (e) => {
        e.preventDefault();
        this.props.onClick(mediaUrl, previewMediaUrl, mimeType);
    };

    imageError = () => {
        this.setState({
            thumbnailError: true
        });
    };

    render() {
        const txt = locale.pages.viewRecord;
        const {mediaUrl, thumbnailMediaUrl, thumbnailFileName, previewMediaUrl, fileName, mimeType} = this.props;

        // TODO revert once videos are transcoded to open format #158519502
        if (fileName && (mimeType.indexOf('video') >= 0 || mimeType.indexOf('octet-stream') >= 0)) {
            return (
                !this.state.thumbnailError ?
                    <ExternalLink href={mediaUrl} title={fileName}  openInNewIcon={false}>
                        <img src={thumbnailMediaUrl} alt={thumbnailFileName} onError={this.imageError} className={this.props.classes.image}/>
                    </ExternalLink>
                    : <BrokenImage color={'secondary'} />
            );
        }

        return (
            <a
                onClick={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                onKeyPress={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                title={mediaUrl && txt.thumbnailTitle.replace('[image]', mediaUrl) || ''}
            >
                {
                    !this.state.thumbnailError ?
                        <img src={thumbnailMediaUrl} alt={thumbnailFileName} onError={this.imageError} className={this.props.classes.image}/>
                        : <BrokenImage color={'secondary'} className={this.props.classes.brokenImage}/>
                }
            </a>
        );
    }
}

export default withStyles(styles)(Thumbnail);
