import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Grid from '@mui/material/Unstable_Grid2';
import Image from '@mui/icons-material/Image';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';
import Typography from '@mui/material/Typography';
import Videocam from '@mui/icons-material/Videocam';
import VolumeUp from '@mui/icons-material/VolumeUp';

import locale from 'locale/viewRecord';
import globalLocale from 'locale/global';
import { openAccessConfig, pathConfig } from 'config';
import { AV_CHECK_STATE_INFECTED } from 'config/general';

import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import FileName from './partials/FileName';
import MediaPreview from './MediaPreview';
import Thumbnail from './partials/Thumbnail';
import {
    getAdvisoryStatement,
    getAvStateDescription,
    getSensitiveHandlingNote,
    isAdded,
    isDerivative,
} from 'helpers/datastreams';
import { getDownloadLicence } from 'helpers/licence';
import { redirectUserToLogin } from 'helpers/redirectUserToLogin';
import { FileAvStateIcon } from '../../SharedComponents/Toolbox/FileAvStateIcon';
import Box from '@mui/material/Box';

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
        file = filename.replace('_xt', '').split('.').slice(0, -1).join('.');
    } else {
        file = filename.split('.').slice(0, -1).join('.');
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

const Files = props => {
    const { publication } = props;
    const [preview, setPreview] = useState({
        fileName: null,
        mediaUrl: null,
        webMediaUrl: null,
        previewMediaUrl: null,
        mimeType: null,
        checksums: {},
    });

    const getUrl = (pid, fileName, checksum = '') => {
        return pid && fileName && pathConfig.file.url(pid, fileName, checksum);
    };

    const hidePreview = () => {
        setPreview({
            fileName: null,
            mediaUrl: null,
            webMediaUrl: null,
            previewMediaUrl: null,
            mimeType: null,
            securityStatus: null,
        });
    };

    const showPreview = ({ checksums, fileName, mediaUrl, mimeType, previewMediaUrl, securityStatus, webMediaUrl }) => {
        setPreview({
            checksums,
            fileName,
            imageError: false,
            mediaUrl,
            mimeType,
            previewMediaUrl,
            securityStatus,
            videoLoading: true,
            webMediaUrl,
        });
    };

    const renderFileIcon = (
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
                mediaUrl: getUrl(pid, fileName, checksums && checksums.media),
                webMediaUrl: webFileName ? getUrl(pid, webFileName, checksums && checksums.web) : null,
                previewMediaUrl: previewFileName ? getUrl(pid, previewFileName, checksums && checksums.preview) : null,
                thumbnailMediaUrl:
                    thumbnailFileName && getUrl(pid, thumbnailFileName, checksums && checksums.thumbnail),
                fileName: fileName,
                thumbnailFileName,
                onClick: showPreview,
                securityStatus: securityStatus,
            };
            return <Thumbnail {...thumbnailProps} />;
        } else if (mimeType.indexOf('audio') >= 0) {
            return <VolumeUp sx={{ opacity: 0.5 }} color={'secondary'} />;
        } else if (mimeType.indexOf('pdf') >= 0) {
            return <PictureAsPdf sx={{ opacity: 0.5 }} color={'secondary'} />;
        } else if (mimeType.indexOf('image') >= 0) {
            return <Image sx={{ opacity: 0.5 }} color={'secondary'} />;
        } else if (mimeType.indexOf('video') >= 0 || mimeType === 'application/mxf') {
            return <Videocam sx={{ opacity: 0.5 }} color={'secondary'} />;
        } else {
            return <InsertDriveFile sx={{ opacity: 0.5 }} color={'secondary'} />;
        }
    };

    const isFileValid = dataStream => {
        return getSecurityAccess(dataStream, props) && !isDerivative(dataStream) && isAdded(dataStream);
    };

    const getChecksums = (dataStream, thumbnailFileName, previewFileName, webFileName, dataStreams) => {
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

    const getFileData = publication => {
        const dataStreams = publication.fez_datastream_info;
        const attachments = publication.fez_record_search_key_file_attachment_name;

        return !!!dataStreams
            ? []
            : dataStreams
                  .filter(isFileValid)
                  .map(item => {
                      if (
                          (item.dsi_order === null || item.dsi_order === undefined) &&
                          !!attachments &&
                          attachments.length > 0
                      ) {
                          const attachIndex = attachments.findIndex(
                              attachItem => item.dsi_dsid === attachItem.rek_file_attachment_name,
                          );
                          item.dsi_order =
                              attachIndex >= 0 ? attachments[attachIndex].rek_file_attachment_name_order : null;
                      }
                      return item;
                  })
                  .sort((a, b) => {
                      return a.dsi_dsid < b.dsi_dsid ? -1 : 1;
                  })
                  .map(dataStream => {
                      const pid = publication.rek_pid;
                      const fileName = dataStream.dsi_dsid;
                      const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
                      const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
                      const previewFileName = checkForPreview(fileName, dataStreams);
                      const webFileName = checkForWeb(fileName, dataStreams);
                      const openAccessStatus = getFileOpenAccessStatus(publication, dataStream, props);
                      /**
                       *  datastreams are being filtered by isFileValid which calls getSecurityAccess,
                       *  securityAccess will always be true
                       */
                      const securityAccess = getSecurityAccess(dataStream, props);
                      const checksums = getChecksums(
                          dataStream,
                          thumbnailFileName,
                          previewFileName,
                          webFileName,
                          dataStreams,
                      );
                      const isInfected = dataStream.dsi_av_check_state === AV_CHECK_STATE_INFECTED;

                      return {
                          pid: pid,
                          fileName: fileName,
                          description: dataStream.dsi_label,
                          mimeType: mimeType,
                          calculatedSize: formatBytes(dataStream.dsi_size),
                          allowDownload: !isInfected && openAccessStatus.allowDownload,
                          icon: renderFileIcon(
                              pid,
                              mimeType,
                              fileName,
                              !isInfected &&
                                  !getDownloadLicence(publication) &&
                                  !(!props.account && dataStream.dsi_security_policy === 4)
                                  ? thumbnailFileName
                                  : null,
                              previewFileName,
                              webFileName,
                              securityAccess,
                              checksums,
                          ),
                          openAccessStatus: openAccessStatus,
                          previewMediaUrl: isInfected
                              ? null
                              : getUrl(
                                    pid,
                                    previewFileName ? previewFileName : fileName,
                                    checksums && checksums.preview,
                                ),
                          webMediaUrl: webFileName ? getUrl(pid, webFileName, checksums.web) : null,
                          mediaUrl: getUrl(pid, fileName, checksums.media),
                          securityStatus: securityAccess,
                          checksums: checksums,
                          requiresLoginToDownload: !props.account && dataStream.dsi_security_policy === 4,
                          avCheck: {
                              state: dataStream.dsi_av_check_state,
                              date: dataStream.dsi_av_check_date,
                              isInfected: dataStream.dsi_av_check_state === AV_CHECK_STATE_INFECTED,
                          },
                      };
                  });
    };

    const handleImageFailed = () => {
        setPreview({
            ...preview,
            imageError: true,
        });
    };

    const handleVideoFailed = event => {
        setPreview({
            ...preview,
            videoLoading: false,
            videoErrorCode: event?.target?.error?.code,
            videoErrorMsg: event?.target?.error?.message,
        });
    };

    const handleVideoLoad = () => {
        setPreview({
            ...preview,
            videoLoading: false,
        });
    };

    const fileData = getFileData(publication);
    if (fileData.length === 0) return null;

    return (
        <Grid xs={12}>
            <StandardCard title={locale.viewRecord.sections.files.title}>
                {!!publication.fez_record_search_key_advisory_statement?.rek_advisory_statement && (
                    <Alert
                        allowDismiss
                        type={'info'}
                        message={getAdvisoryStatement(publication, locale.culturalSensitivityStatement)}
                    />
                )}
                {!!publication.fez_record_search_key_sensitive_handling_note_id?.rek_sensitive_handling_note_id && (
                    <Alert allowDismiss type={'info'} message={getSensitiveHandlingNote(publication)} />
                )}
                {
                    /* istanbul ignore next */ !!fileData.filter(
                        ({ requiresLoginToDownload }) => requiresLoginToDownload,
                    ).length > 0 && (
                        <Alert {...{ ...globalLocale.global.loginAlertForFiles, action: redirectUserToLogin() }} />
                    )
                }
                <Box sx={{ padding: { xs: '8px 0', sm: 1 } }}>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        padding={0}
                        sx={{ borderBottom: '1px solid', borderBottomColor: 'secondary.light' }}
                    >
                        <Grid xs={2} sm={1}>
                            &nbsp;
                        </Grid>
                        <Grid sm={4} data-testid="dsi-dsid-label">
                            <Typography variant="caption" gutterBottom>
                                {locale.viewRecord.sections.files.fileName}
                            </Typography>
                        </Grid>
                        <Grid sm={6} md={4} data-testid="dsi-label-label" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="caption" gutterBottom>
                                {locale.viewRecord.sections.files.description}
                            </Typography>
                        </Grid>
                        <Grid md={2} data-testid="dsi-size-label" sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="caption" gutterBottom>
                                {locale.viewRecord.sections.files.size}
                            </Typography>
                        </Grid>
                        <Grid sm sx={{ display: { xs: 'none', sm: 'block' } }} />
                    </Grid>
                </Box>

                {fileData.map((item, index) => (
                    <Box sx={{ padding: { xs: '8px 0', sm: 1 } }} key={index}>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            key={`file-${index}`}
                            spacing={2}
                            padding={0}
                            wrap={'nowrap'}
                            sx={{ borderBottom: '1px solid', borderBottomColor: 'secondary.light' }}
                        >
                            <Grid
                                xs={2}
                                sm={1}
                                textAlign={'center'}
                                data-analyticsid={`dsi-mimetype-${index}`}
                                data-testid={`dsi-mimetype-${index}`}
                            >
                                {item.icon}
                            </Grid>
                            <Grid
                                xs={8}
                                sm={4}
                                textOverflow={'ellipsis'}
                                whiteSpace={'nowrap'}
                                overflow={'hidden'}
                                data-analyticsid={`dsi-dsid-${index}`}
                                data-testid={`dsi-dsid-${index}`}
                            >
                                <FileName
                                    {...item}
                                    id={`file-name-${index}`}
                                    downloadLicence={getDownloadLicence(publication)}
                                    onFileSelect={showPreview}
                                    tooltip={
                                        item.avCheck.isInfected
                                            ? getAvStateDescription(item.avCheck.state, item.checkedAt)
                                            : ''
                                    }
                                    disabled={item.avCheck.isInfected}
                                />
                            </Grid>
                            <Grid
                                sm={6}
                                md={4}
                                textOverflow={'ellipsis'}
                                whiteSpace={'nowrap'}
                                overflow={'hidden'}
                                data-testid={`dsi-label-${index}`}
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                            >
                                <Typography variant="body2" noWrap>
                                    {item.description}
                                </Typography>
                            </Grid>
                            <Grid
                                md={2}
                                textOverflow={'ellipsis'}
                                whiteSpace={'nowrap'}
                                overflow={'hidden'}
                                data-testid={`dsi-size-${index}`}
                                sx={{ display: { xs: 'none', md: 'block' } }}
                            >
                                <Typography variant="body2" noWrap>
                                    {item.calculatedSize}
                                </Typography>
                            </Grid>
                            <Grid
                                sm
                                style={{ textAlign: 'right' }}
                                data-analyticsid={`rek-oa-status-${index}`}
                                data-testid={`rek-oa-status-${index}`}
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                            >
                                <Box style={{ whiteSpace: 'nowrap' }}>
                                    <Box component={'span'} paddingRight={1}>
                                        <FileAvStateIcon
                                            state={item.avCheck?.state}
                                            checkedAt={item.avCheck?.date}
                                            id={`${item.pid}-${item.fileName}`}
                                        />
                                    </Box>
                                    <Box component={'span'} paddingRight={1}>
                                        <OpenAccessIcon
                                            {...item.openAccessStatus}
                                            securityStatus={item.securityStatus}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                {preview.mediaUrl && preview.mimeType && (
                    <MediaPreview
                        fileName={getUrl(
                            publication.rek_pid,
                            preview.fileName,
                            preview.checksums && preview.checksums.media,
                        )}
                        mediaUrl={preview.mediaUrl}
                        webMediaUrl={preview.webMediaUrl}
                        previewMediaUrl={preview.previewMediaUrl}
                        mimeType={preview.mimeType}
                        videoErrorMsg={preview.videoErrorMsg}
                        videoErrorCode={preview.videoErrorCode}
                        videoLoading={preview.videoLoading}
                        imageError={preview.imageError}
                        onClose={hidePreview}
                        onVideoFailed={handleVideoFailed}
                        onImageFailed={handleImageFailed}
                        onVideoLoad={handleVideoLoad}
                    />
                )}
            </StandardCard>
        </Grid>
    );
};

Files.propTypes = {
    publication: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool,
    isAuthor: PropTypes.bool,
    author: PropTypes.object,
    account: PropTypes.object,
};

export default Files;
