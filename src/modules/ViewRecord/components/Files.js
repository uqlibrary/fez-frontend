import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

import moment from 'moment';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import Image from '@material-ui/icons/Image';
import Videocam from '@material-ui/icons/Videocam';
import {openAccessConfig, viewRecordsConfig, routes} from 'config';
import MediaPreview from './MediaPreview';
import FileName from './partials/FileName';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import Thumbnail from './partials/Thumbnail';

const styles = (theme) => ({
    header: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
    },
    dataWrapper: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    fileIcon: {
        opacity: 0.5,
    },
});

export class FilesClass extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool,
        setHideCulturalSensitivityStatement: PropTypes.func,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            preview: {
                mediaUrl: null,
                previewMediaUrl: null,
                mimeType: null
            }
        };
    }

    renderFileIcon = (pid, mimeType, fileName, thumbnailFileName, previewFileName, allowDownload, downloadableFileName = null) => {
        if (allowDownload && thumbnailFileName) {
            const thumbnailProps = {
                mimeType,
                mediaUrl: this.getUrl(pid, downloadableFileName || fileName),
                previewMediaUrl: this.getUrl(pid, previewFileName || fileName),
                thumbnailMediaUrl: this.getUrl(pid, thumbnailFileName),
                fileName: downloadableFileName || fileName,
                thumbnailFileName,
                onClick: this.showPreview
            };
            return (
                <Thumbnail {...thumbnailProps} />
            );
        } else if (mimeType.indexOf('audio') >= 0) {
            return <VolumeUp className={this.props.classes.fileIcon} color={'secondary'} />;
        } else if (mimeType.indexOf('pdf') >= 0) {
            return <PictureAsPdf className={this.props.classes.fileIcon} color={'secondary'} />;
        } else if (mimeType.indexOf('image') >= 0) {
            return <Image className={this.props.classes.fileIcon} color={'secondary'} />;
        } else if (mimeType.indexOf('video') >= 0) {
            return <Videocam className={this.props.classes.fileIcon} color={'secondary'} />;
        } else {
            return <InsertDriveFile className={this.props.classes.fileIcon} color={'secondary'} />;
        }
    }

    hidePreview = () => {
        this.setState({
            preview: {
                mediaUrl: null,
                previewMediaUrl: null,
                mimeType: null
            }
        });
    }

    showPreview = (mediaUrl, previewMediaUrl, mimeType) => {
        this.setState({
            preview: {
                mediaUrl: mediaUrl,
                previewMediaUrl: previewMediaUrl,
                mimeType: mimeType
            }
        });
    }

    formatBytes = (bytes) => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const decimals = 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const index = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, index)).toFixed(decimals)) + ' ' + sizes[index];
    }

    getFileOpenAccessStatus = (publication, embargoDate) => {
        const openAccessStatusId = (!!publication.fez_record_search_key_oa_status
            && publication.fez_record_search_key_oa_status.rek_oa_status) || null;
        if (openAccessConfig.openAccessFiles.indexOf(openAccessStatusId) < 0) {
            return {isOpenAccess: false, embargoDate: null, openAccessStatusId: openAccessStatusId};
        } else if (embargoDate && moment(embargoDate).isAfter(moment(), 'day')) {
            return {isOpenAccess: false, embargoDate: moment(embargoDate).format('Do MMMM YYYY'), openAccessStatusId: openAccessStatusId};
        }
        return {isOpenAccess: true, embargoDate: null, openAccessStatusId: openAccessStatusId};
    }

    getUrl = (pid, fileName) => {
        return fileName && routes.pathConfig.file.url(pid, fileName);
    }

    searchByKey = (list, key, value) => {
        return list && list.filter(item=>item[key] === value)[0];
    }

    isFileValid = (dataStream) => {
        const {files: {blacklist}} = viewRecordsConfig;

        return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex) &&
            (!dataStream.dsi_label || !dataStream.dsi_label.match(new RegExp(blacklist.descriptionKeywordsRegex, 'gi'))) &&
            dataStream.dsi_state === 'A';
    }

    getFileData = (publication) => {
        const dataStreams = publication.fez_datastream_info;
        const {files} = viewRecordsConfig;
        // check if the publication is a member of the blacklist collections, TODO: remove after security epic is done
        const containBlacklistCollections = publication.fez_record_search_key_ismemberof.some(collection => files.blacklist.collections.includes(collection.rek_ismemberof));

        return !containBlacklistCollections && !!dataStreams && dataStreams.length > 0
            ? dataStreams.filter(this.isFileValid).map(dataStream => {
                const pid = publication.rek_pid;
                const fileName = dataStream.dsi_dsid;
                const thumbnailDataStream = this.searchByKey(dataStreams, 'dsi_dsid', files.thumbnailFileName(fileName));
                const previewDataStream = this.searchByKey(dataStreams, 'dsi_dsid', files.previewFileName(fileName));
                const downloadableDataStream = this.searchByKey(dataStreams, 'dsi_dsid', files.webFileName(fileName));
                const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
                const thumbnailFileName = !!thumbnailDataStream && thumbnailDataStream.dsi_dsid;
                const previewFileName = !!previewDataStream && previewDataStream.dsi_dsid;
                const downloadableFileName = !!downloadableDataStream && downloadableDataStream.dsi_dsid;
                const openAccessStatus = this.getFileOpenAccessStatus(publication, dataStream.dsi_embargo_date);

                return {
                    pid: pid,
                    fileName: fileName,
                    description: dataStream.dsi_label,
                    mimeType: mimeType,
                    thumbnailFileName: thumbnailFileName,
                    calculatedSize: this.formatBytes(dataStream.dsi_size),
                    allowDownload: openAccessStatus.isOpenAccess || !openAccessStatus.embargoDate,
                    icon: this.renderFileIcon(pid, mimeType, fileName, thumbnailFileName, previewFileName, openAccessStatus.isOpenAccess, downloadableFileName),
                    openAccessStatus: openAccessStatus,
                    previewMediaUrl: this.getUrl(pid, previewFileName || fileName),
                    mediaUrl: this.getUrl(pid, downloadableFileName || fileName)
                };
            })
            : [];
    }

    render() {
        const {publication} = this.props;
        const fileData = this.getFileData(publication);
        const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (fileData.length === 0) return null;
        let hasVideo = false;
        fileData.map((item) => {
            if(item.mimeType.indexOf('video') > -1) { hasVideo = true; }
        });
        return (
            <Grid item xs={12}>
                <StandardCard title={locale.viewRecord.sections.files.title}>
                    {
                        !!publication.fez_record_search_key_advisory_statement && !this.props.hideCulturalSensitivityStatement &&
                        <Alert allowDismiss type={'info'}
                            message={publication.fez_record_search_key_advisory_statement.rek_advisory_statement || locale.viewRecord.sections.files.culturalSensitivityStatement}
                            dismissAction={this.props.setHideCulturalSensitivityStatement}/>
                    }
                    {
                        isFireFox && hasVideo &&
                        <Alert allowDismiss type={locale.viewRecord.fireFoxAlert.type}
                            title={locale.viewRecord.fireFoxAlert.title}
                            message={locale.viewRecord.fireFoxAlert.message}
                        />
                    }
                    <div style={{padding: 8}}>
                        <Grid container direction="row" alignItems="center" spacing={16} className={this.props.classes.header}>
                            <Grid item xs={1}>&nbsp;</Grid>
                            <Grid item sm={4}>
                                <Typography variant="caption" gutterBottom>{locale.viewRecord.sections.files.fileName}</Typography>
                            </Grid>
                            <Hidden xsDown>
                                <Grid item sm={4}>
                                    <Typography variant="caption" gutterBottom>{locale.viewRecord.sections.files.description}</Typography>
                                </Grid>
                            </Hidden>
                            <Hidden smDown>
                                <Grid item md={2}>
                                    <Typography variant="caption" gutterBottom>{locale.viewRecord.sections.files.size}</Typography>
                                </Grid>
                            </Hidden>
                            <Hidden xsDown>
                                <Grid item sm />
                            </Hidden>
                        </Grid>
                    </div>
                    {
                        fileData.map((item, index) => (
                            <div style={{padding: 8}} key={index}>
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"
                                    key={`file-${index}`}
                                    spacing={16}
                                    wrap={'nowrap'}
                                    className={this.props.classes.header}
                                >
                                    <Grid item xs={1}>
                                        {item.icon}
                                    </Grid>
                                    <Grid item sm={4}className={this.props.classes.dataWrapper}>
                                        <FileName
                                            {...item}
                                            onFileSelect={this.showPreview}
                                        />
                                    </Grid>
                                    <Hidden xsDown>
                                        <Grid item sm={4} className={this.props.classes.dataWrapper}>
                                            <Typography variant="body2" noWrap>{item.description}</Typography>
                                        </Grid>
                                    </Hidden>
                                    <Hidden smDown>
                                        <Grid item sm={2} className={this.props.classes.dataWrapper}>
                                            <Typography variant="body2" noWrap>{item.calculatedSize}</Typography>
                                        </Grid>
                                    </Hidden>
                                    <Hidden xsDown>
                                        <Grid item sm style={{textAlign: 'right'}}><OpenAccessIcon {...item.openAccessStatus} /></Grid>
                                    </Hidden>
                                </Grid>
                            </div>
                        ))
                    }
                    {
                        this.state.preview.mediaUrl && this.state.preview.mimeType &&
                        <MediaPreview
                            mediaUrl={this.state.preview.mediaUrl}
                            previewMediaUrl={this.state.preview.previewMediaUrl}
                            mimeType={this.state.preview.mimeType}
                            onClose={this.hidePreview}/>
                    }
                </StandardCard>
            </Grid>
        );
    }
}

const StyledFilesClass = withStyles(styles, {withTheme: true})(FilesClass);
const Files = (props) => <StyledFilesClass {...props}/>;
export default Files;
