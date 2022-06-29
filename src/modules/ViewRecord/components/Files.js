import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Image from '@material-ui/icons/Image';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import Typography from '@material-ui/core/Typography';
import Videocam from '@material-ui/icons/Videocam';
import VolumeUp from '@material-ui/icons/VolumeUp';
import { withStyles } from '@material-ui/core/styles';

import locale from 'locale/viewRecord';
import globalLocale from 'locale/global';
import { openAccessConfig, pathConfig, viewRecordsConfig } from 'config';
import { CURRENT_LICENCES } from 'config/general';

import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import FileName from './partials/FileName';
import MediaPreview from './MediaPreview';
import Thumbnail from './partials/Thumbnail';
import { isAdded, isDerivative } from 'helpers/datastreams';
import { stripHtml } from 'helpers/general';
import { redirectUserToLogin } from 'helpers/redirectUserToLogin';

export const styles = theme => ({
    header: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
    },
    dataWrapper: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    fileIcon: {
        opacity: 0.5,
    },
    thumbIconCentered: {
        textAlign: 'center',
    },
    containerPadding: {
        padding: '8px 0',
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(1),
        },
    },
});

export const getSecurityAccess = (dataStream, props) => {
    const { isAdmin, isAuthor, author } = props;
    return !!(
        isAdmin ||
        isAuthor ||
        (dataStream && dataStream.dsi_security_policy && dataStream.dsi_security_policy === 5) ||
        (dataStream && dataStream.dsi_security_policy && dataStream.dsi_security_policy === 4) ||
        /* istanbul ignore next */
        (author && author.pol_id && dataStream.dsi_security_policy >= author.pol_id)
    );
};

export const getDownloadLicence = publication => {
    const licence = ((publication && publication.fez_record_search_key_license) || {}).rek_license;
    return CURRENT_LICENCES.find(item => item.value === licence);
};

export const getFileOpenAccessStatus = (publication, dataStream, props) => {
    const embargoDate = dataStream.dsi_embargo_date;
    const openAccessStatusId =
        (!!publication.fez_record_search_key_oa_status && publication.fez_record_search_key_oa_status.rek_oa_status) ||
        null;
    const downloadLicence = getDownloadLicence(publication);
    const allowDownload = !downloadLicence && (dataStream.dsi_security_policy === 4 ? !!props?.account : true);
    if (openAccessConfig.openAccessFiles.indexOf(openAccessStatusId) < 0) {
        return {
            isOpenAccess: false,
            embargoDate: null,
            openAccessStatusId: openAccessStatusId,
            allowDownload: allowDownload,
        };
    } else if (embargoDate && moment(embargoDate).isAfter(moment(), 'day')) {
        return {
            isOpenAccess: false,
            embargoDate: moment(embargoDate).format('Do MMMM YYYY'),
            openAccessStatusId: openAccessStatusId,
            securityStatus: getSecurityAccess(dataStream, props),
            allowDownload: false,
        };
    }
    return {
        isOpenAccess: true,
        embargoDate: null,
        openAccessStatusId: openAccessStatusId,
        allowDownload: allowDownload,
    };
};

export const getFileNameIfPresent = (value, dataStreams) => {
    const match = dataStreams.find(item => item.dsi_dsid === value);
    return match ? match.dsi_dsid : null;
};

export const getMatchingFilename = (filenames, dataStreams) =>
    filenames.reduce(
        (matchedFilename, currentFilename) => matchedFilename || getFileNameIfPresent(currentFilename, dataStreams),
        null,
    );

export const untranscodedItem = filename => {
    let file = null;
    if (filename.indexOf('_xt') >= 0) {
        file = filename
            .replace('_xt', '')
            .split('.')
            .slice(0, -1)
            .join('.');
    } else {
        file = filename
            .split('.')
            .slice(0, -1)
            .join('.');
    }
    return file;
};

export const checkForThumbnail = (filename, dataStreams) => {
    const file = untranscodedItem(filename);
    const thumbnailFilenames = [
        `thumbnail_${file}_compressed_t.jpg`,
        `thumbnail_${file}_t.jpg`,
        `thumbnail_${file}.jpg`,
        `${file}_t.jpg`,
    ];
    return getMatchingFilename(thumbnailFilenames, dataStreams);
};

export const checkForPreview = (filename, dataStreams) => {
    const file = untranscodedItem(filename);
    const previewFilenames = [
        `preview_${file}_compressed_t.jpg`,
        `preview_${file}_t.jpg`,
        `preview_${file}.jpg`,
        `${file}_t.jpg`,
        `preview_${file}_compressed_t.mp4`,
        `preview_${file}_t.mp4`,
        `${file}_t.mp4`,
        `preview_${file}_compressed_t.mp3`,
        `preview_${file}_t.mp3`,
        `${file}_t.mp3`,
    ];
    return getMatchingFilename(previewFilenames, dataStreams);
};

export const checkForWeb = (filename, dataStreams) => {
    const file = untranscodedItem(filename);
    const webFilenames = [
        `web_${file}_compressed_t.jpg`,
        `web_${file}_t.jpg`,
        `web_${file}.jpg`,
        `web_${file}_compressed_t.mp4`,
        `web_${file}_t.mp4`,
        `web_${file}_compressed_t.mp3`,
        `web_${file}_t.mp3`,
    ];
    return getMatchingFilename(webFilenames, dataStreams);
};

export const formatBytes = bytes => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const decimals = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, index)).toFixed(decimals)) + ' ' + sizes[index];
};

export class FilesClass extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool,
        setHideCulturalSensitivityStatement: PropTypes.func,
        classes: PropTypes.object,
        isAdmin: PropTypes.bool,
        isAuthor: PropTypes.bool,
        author: PropTypes.object,
        account: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            preview: {
                fileName: null,
                mediaUrl: null,
                webMediaUrl: null,
                previewMediaUrl: null,
                mimeType: null,
                checksums: {},
                videoLoading: true,
            },
        };
    }

    renderFileIcon = (
        pid,
        mimeType,
        fileName,
        thumbnailFileName,
        previewFileName,
        webFileName,
        securityStatus,
        checksums,
    ) => {
        if (thumbnailFileName) {
            const thumbnailProps = {
                mimeType,
                mediaUrl: this.getUrl(pid, fileName, checksums && checksums.media),
                webMediaUrl: webFileName ? this.getUrl(pid, webFileName, checksums && checksums.web) : null,
                previewMediaUrl: previewFileName
                    ? this.getUrl(pid, previewFileName, checksums && checksums.preview)
                    : null,
                thumbnailMediaUrl:
                    thumbnailFileName && this.getUrl(pid, thumbnailFileName, checksums && checksums.thumbnail),
                fileName: fileName,
                thumbnailFileName,
                onClick: this.showPreview,
                securityStatus: securityStatus,
            };
            return <Thumbnail {...thumbnailProps} />;
        } else if (mimeType.indexOf('audio') >= 0) {
            return <VolumeUp className={this.props.classes.fileIcon} color={'secondary'} />;
        } else if (mimeType.indexOf('pdf') >= 0) {
            return <PictureAsPdf className={this.props.classes.fileIcon} color={'secondary'} />;
        } else if (mimeType.indexOf('image') >= 0) {
            return <Image className={this.props.classes.fileIcon} color={'secondary'} />;
        } else if (mimeType.indexOf('video') >= 0 || mimeType === 'application/mxf') {
            return <Videocam className={this.props.classes.fileIcon} color={'secondary'} />;
        } else {
            return <InsertDriveFile className={this.props.classes.fileIcon} color={'secondary'} />;
        }
    };

    hidePreview = () => {
        this.setState({
            preview: {
                fileName: null,
                mediaUrl: null,
                webMediaUrl: null,
                previewMediaUrl: null,
                mimeType: null,
                securityStatus: null,
            },
        });
    };

    showPreview = ({ checksums = {}, fileName, mediaUrl, mimeType, previewMediaUrl, securityStatus, webMediaUrl }) => {
        if (securityStatus) {
            this.setState({
                preview: {
                    checksums,
                    fileName,
                    imageError: false,
                    mediaUrl,
                    mimeType,
                    previewMediaUrl,
                    securityStatus,
                    videoLoading: true,
                    webMediaUrl,
                },
            });
        }
    };

    getUrl = (pid, fileName, checksum = '') => {
        return pid && fileName && pathConfig.file.url(pid, fileName, checksum);
    };

    searchByKey = (list, key, value) => {
        return list && list.filter(item => item[key] === value)[0];
    };

    isFileValid = dataStream => {
        return getSecurityAccess(dataStream, this.props) && !isDerivative(dataStream) && isAdded(dataStream);
    };

    getChecksums = (dataStream, thumbnailFileName, previewFileName, webFileName, dataStreams) => {
        const checksums = {
            media: dataStream.dsi_checksum,
            thumbnail: undefined,
            preview: undefined,
            web: undefined,
        };

        dataStreams.forEach(dataStream => {
            switch (dataStream.dsi_dsid) {
                case thumbnailFileName:
                    checksums.thumbnail = dataStream.dsi_checksum;
                    break;
                case previewFileName:
                    checksums.preview = dataStream.dsi_checksum;
                    break;
                case webFileName:
                    checksums.web = dataStream.dsi_checksum;
                    break;
                default:
            }
        });

        return checksums;
    };

    getFileData = publication => {
        const dataStreams = publication.fez_datastream_info;
        const componentProps = this.props;
        return !!dataStreams && this.isViewableByUser(publication, dataStreams)
            ? dataStreams.filter(this.isFileValid).map(dataStream => {
                  const pid = publication.rek_pid;
                  const fileName = dataStream.dsi_dsid;
                  const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
                  const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
                  const previewFileName = checkForPreview(fileName, dataStreams);
                  const webFileName = checkForWeb(fileName, dataStreams);
                  const openAccessStatus = getFileOpenAccessStatus(publication, dataStream, componentProps);
                  const securityAccess = getSecurityAccess(dataStream, componentProps);
                  const checksums = this.getChecksums(
                      dataStream,
                      thumbnailFileName,
                      previewFileName,
                      webFileName,
                      dataStreams,
                  );

                  return {
                      pid: pid,
                      fileName: fileName,
                      description: dataStream.dsi_label,
                      mimeType: mimeType,
                      calculatedSize: formatBytes(dataStream.dsi_size),
                      allowDownload: openAccessStatus.allowDownload,
                      icon: this.renderFileIcon(
                          pid,
                          mimeType,
                          fileName,
                          !getDownloadLicence(publication) &&
                              !(!componentProps.account && dataStream.dsi_security_policy === 4)
                              ? thumbnailFileName
                              : null,
                          previewFileName,
                          webFileName,
                          securityAccess,
                          checksums,
                      ),
                      openAccessStatus: openAccessStatus,
                      previewMediaUrl: this.getUrl(
                          pid,
                          previewFileName ? previewFileName : fileName,
                          checksums && checksums.preview,
                      ),
                      webMediaUrl: webFileName ? this.getUrl(pid, webFileName, checksums.web) : null,
                      mediaUrl: this.getUrl(pid, fileName, checksums.media),
                      securityStatus: securityAccess,
                      checksums: checksums,
                      requiresLoginToDownload: !componentProps.account && dataStream.dsi_security_policy === 4,
                  };
              })
            : [];
    };

    isViewableByUser = (publication, dataStreams) => {
        const { files } = viewRecordsConfig;
        // check if the publication is a member of the blacklist collections, TODO: remove after security epic is done
        const containBlacklistCollections = publication.fez_record_search_key_ismemberof?.some(collection =>
            files.blacklist.collections.includes(collection.rek_ismemberof),
        );
        return (
            (!!dataStreams && dataStreams.length > 0 && (!containBlacklistCollections || !!this.props.isAdmin)) ||
            // eslint-disable-next-line camelcase
            this.props.author?.pol_id === 1
        );
    };

    handleImageFailed = () => {
        this.setState(state => ({
            ...state,
            preview: {
                ...state.preview,
                imageError: true,
            },
        }));
    };

    handleVideoFailed = event => {
        this.setState(state => ({
            ...state,
            preview: {
                ...state.preview,
                videoErrorCode: event.code,
                videoErrorMsg: event.message,
            },
        }));
    };

    handleVideoLoad = () => {
        this.setState(state => ({
            ...state,
            preview: {
                ...state.preview,
                videoLoading: false,
            },
        }));
    };

    render() {
        const { publication } = this.props;
        const fileData = this.getFileData(publication);
        if (fileData.length === 0) return null;
        return (
            <Grid item xs={12}>
                <StandardCard title={locale.viewRecord.sections.files.title}>
                    {!!publication.fez_record_search_key_advisory_statement &&
                        !this.props.hideCulturalSensitivityStatement && (
                            <Alert
                                allowDismiss
                                type={'info'}
                                message={stripHtml(
                                    publication.fez_record_search_key_advisory_statement.rek_advisory_statement,
                                )}
                                dismissAction={this.props.setHideCulturalSensitivityStatement}
                            />
                        )}
                    {/* istanbul ignore next */ !!fileData.filter(
                        ({ requiresLoginToDownload }) => requiresLoginToDownload,
                    ).length > 0 && (
                        <Alert {...{ ...globalLocale.global.loginAlertForFiles, action: redirectUserToLogin() }} />
                    )}
                    <div className={this.props.classes.containerPadding}>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            className={this.props.classes.header}
                        >
                            <Grid item xs={2} sm={1}>
                                &nbsp;
                            </Grid>
                            <Grid item sm={4} data-testid="dsi-dsid-label">
                                <Typography variant="caption" gutterBottom>
                                    {locale.viewRecord.sections.files.fileName}
                                </Typography>
                            </Grid>
                            <Hidden xsDown>
                                <Grid item sm={6} md={4} data-testid="dsi-label-label">
                                    <Typography variant="caption" gutterBottom>
                                        {locale.viewRecord.sections.files.description}
                                    </Typography>
                                </Grid>
                            </Hidden>
                            <Hidden smDown>
                                <Grid item md={2} data-testid="dsi-size-label">
                                    <Typography variant="caption" gutterBottom>
                                        {locale.viewRecord.sections.files.size}
                                    </Typography>
                                </Grid>
                            </Hidden>
                            <Hidden xsDown>
                                <Grid item sm />
                            </Hidden>
                        </Grid>
                    </div>
                    {fileData.map((item, index) => (
                        <div className={this.props.classes.containerPadding} key={index}>
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                                key={`file-${index}`}
                                spacing={2}
                                wrap={'nowrap'}
                                className={this.props.classes.header}
                            >
                                <Grid
                                    item
                                    xs={2}
                                    sm={1}
                                    className={this.props.classes.thumbIconCentered}
                                    data-testid={`dsi-mimetype-${index}`}
                                >
                                    {item.icon}
                                </Grid>
                                <Grid
                                    item
                                    sm={4}
                                    className={this.props.classes.dataWrapper}
                                    data-testid={`dsi-dsid-${index}`}
                                >
                                    <FileName
                                        {...item}
                                        id={`file-name-${index}`}
                                        downloadLicence={getDownloadLicence(publication)}
                                        onFileSelect={this.showPreview}
                                    />
                                </Grid>
                                <Hidden xsDown>
                                    <Grid
                                        item
                                        sm={6}
                                        md={4}
                                        className={this.props.classes.dataWrapper}
                                        data-testid={`dsi-label-${index}`}
                                    >
                                        <Typography variant="body2" noWrap>
                                            {item.description}
                                        </Typography>
                                    </Grid>
                                </Hidden>
                                <Hidden smDown>
                                    <Grid
                                        item
                                        md={2}
                                        className={this.props.classes.dataWrapper}
                                        data-testid={`dsi-size-${index}`}
                                    >
                                        <Typography variant="body2" noWrap>
                                            {item.calculatedSize}
                                        </Typography>
                                    </Grid>
                                </Hidden>
                                <Hidden xsDown>
                                    <Grid item sm style={{ textAlign: 'right' }} data-testid={`rek-oa-status-${index}`}>
                                        <OpenAccessIcon
                                            {...item.openAccessStatus}
                                            securityStatus={item.securityStatus}
                                        />
                                    </Grid>
                                </Hidden>
                            </Grid>
                        </div>
                    ))}
                    {this.state.preview.mediaUrl && this.state.preview.mimeType && (
                        <MediaPreview
                            fileName={this.getUrl(
                                publication.rek_pid,
                                this.state.preview.fileName,
                                this.state.preview.checksums && this.state.preview.checksums.media,
                            )}
                            mediaUrl={this.state.preview.mediaUrl}
                            webMediaUrl={this.state.preview.webMediaUrl}
                            previewMediaUrl={this.state.preview.previewMediaUrl}
                            mimeType={this.state.preview.mimeType}
                            videoErrorMsg={this.state.preview.videoErrorMsg}
                            videoErrorCode={this.state.preview.videoErrorCode}
                            videoLoading={this.state.preview.videoLoading}
                            imageError={this.state.preview.imageError}
                            onClose={this.hidePreview}
                            onVideoFailed={this.handleVideoFailed}
                            onImageFailed={this.handleImageFailed}
                            onVideoLoad={this.handleVideoLoad}
                        />
                    )}
                </StandardCard>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(FilesClass);
