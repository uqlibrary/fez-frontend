import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Grid, Hidden, Button} from '@material-ui/core';

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

    MediaPreviewButtons = ({openInNewWindow, close}) => {
        return (
            <div style={{padding: 8}}>
                <Grid container spacing={16} justify="flex-end" direction="row">
                    <Grid item xs={12} sm="auto">
                        <Button variant="contained" onClick={this.openFileInNewWindow} color="primary" fullWidth>
                            {openInNewWindow}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button variant="contained" onClick={this.props.onClose} fullWidth>
                            {close}
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    };

    render()  {
        const {mediaUrl, previewMediaUrl, mimeType} = this.props;
        const {videoTitle, imageTitle, browserNotSupportVideoTagMsg} = locale.viewRecord.sections.files.preview;
        const isVideo = mimeType.indexOf('video') >= 0;
        const isImage = mimeType.indexOf('image') >= 0;
        const title = isVideo ? videoTitle : imageTitle;
        return (
            <StandardCard title={title} className={'mediaPreview'}>
                <Hidden xsDown>
                    <this.MediaPreviewButtons {...locale.viewRecord.sections.files.preview}/>
                </Hidden>
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
                <Hidden smUp>
                    <this.MediaPreviewButtons {...locale.viewRecord.sections.files.preview}/>
                </Hidden>
            </StandardCard>
        );
    }
}
