import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody, TableRowColumn, TableHeader, TableRow, TableHeaderColumn} from 'material-ui/Table';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';

import moment from 'moment';
import AvVolumeUp from 'material-ui/svg-icons/av/volume-up';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import PictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf';
import Image from 'material-ui/svg-icons/image/image';
import AvVideocam from 'material-ui/svg-icons/av/videocam';
import {openAccessConfig, viewRecordsConfig, routes} from 'config';
import MediaPreview from './MediaPreview';
import FileName from './partials/FileName';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';

export default class Files extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool,
        setHideCulturalSensitivityStatement: PropTypes.func
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

    renderFileIcon = (pid, mimeType, thumbnailFileName, allowDownload) => {
        if (allowDownload && thumbnailFileName) {
            return <img src={this.getUrl(pid, thumbnailFileName)} alt={thumbnailFileName}/>;
        } else if (mimeType.indexOf('audio') >= 0) {
            return <AvVolumeUp />;
        } else if (mimeType.indexOf('pdf') >= 0) {
            return <PictureAsPdf />;
        } else if (mimeType.indexOf('image') >= 0) {
            return <Image />;
        } else if (mimeType.indexOf('video') >= 0) {
            return <AvVideocam />;
        } else {
            return <InsertDriveFile />;
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

        setTimeout(() => {
            const files = ReactDOM.findDOMNode(this.refs.files);
            window.scrollTo(0, (files.offsetTop + files.scrollHeight - 30));
        }, 80);
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
        } else if (embargoDate && moment(embargoDate).isSameOrAfter(moment(), 'day')) {
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
        return !dataStream.dsi_dsid.match(viewRecordsConfig.files.blacklist.namePrefixRegex) &&
            (!dataStream.dsi_label || !dataStream.dsi_label.match(new RegExp(viewRecordsConfig.files.blacklist.descriptionKeywordsRegex, 'gi'))) &&
            dataStream.dsi_state === 'A';
    }

    getFileData = (publication) => {
        const dataStreams = publication.fez_datastream_info;

        return !!dataStreams && dataStreams.length > 0
            ? dataStreams.filter(this.isFileValid).map(dataStream => {
                const pid = publication.rek_pid;
                const fileName = dataStream.dsi_dsid;
                const fileNameWithoutExtension = fileName.substr(0, fileName.lastIndexOf('.'));
                const thumbnailDataStream = this.searchByKey(dataStreams, 'dsi_dsid', `thumbnail_${fileNameWithoutExtension}.jpg`);
                const previewDataStream = this.searchByKey(dataStreams, 'dsi_dsid', `preview_${fileNameWithoutExtension}.jpg`);
                const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
                const thumbnailFileName = thumbnailDataStream && thumbnailDataStream.dsi_dsid;
                const openAccessStatus = this.getFileOpenAccessStatus(publication, dataStream.dsi_embargo_date);

                return {
                    pid: pid,
                    fileName: fileName,
                    description: dataStream.dsi_label,
                    mimeType: mimeType,
                    thumbnailFileName: thumbnailFileName,
                    previewFileName: previewDataStream && previewDataStream.dsi_dsid,
                    calculatedSize: this.formatBytes(dataStream.dsi_size),
                    allowDownload: openAccessStatus.isOpenAccess || !openAccessStatus.embargoDate,
                    icon: this.renderFileIcon(pid, mimeType, thumbnailFileName, openAccessStatus.isOpenAccess),
                    openAccessStatus: openAccessStatus
                };
            })
            : [];
    }

    render() {
        const {publication} = this.props;
        const fileData = this.getFileData(publication);
        if (fileData.length === 0) return null;
        return (
            <section>
                <StandardCard title={locale.viewRecord.sections.files.title}>
                    {
                        !!publication.fez_record_search_key_advisory_statement && !this.props.hideCulturalSensitivityStatement &&
                        <Alert allowDismiss type={'info'}
                            message={publication.fez_record_search_key_advisory_statement.rek_advisory_statement || locale.viewRecord.sections.files.culturalSensitivityStatement}
                            dismissAction={this.props.setHideCulturalSensitivityStatement}/>
                    }
                    <Table selectable={false} className="files horizontal" ref="files">
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="header">
                            <TableRow>
                                <TableHeaderColumn className="filetype" />
                                <TableHeaderColumn className="filename">
                                    {locale.viewRecord.sections.files.fileName}
                                </TableHeaderColumn>
                                <TableHeaderColumn className="description is-hidden-mobile">
                                    {locale.viewRecord.sections.files.description}
                                </TableHeaderColumn>
                                <TableHeaderColumn className="align-right is-hidden-mobile is-hidden-tablet-only size">
                                    {locale.viewRecord.sections.files.size}
                                </TableHeaderColumn>
                                <TableHeaderColumn className="oa align-right"/>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} className="data">
                            {
                                fileData.map((item, index) => (
                                    <TableRow selectable className="file" key={`file-${index}`}>
                                        <TableRowColumn className="filetype fileIcon">
                                            {item.icon}
                                        </TableRowColumn>
                                        <TableRowColumn className="filename">
                                            <FileName
                                                {...item}
                                                onFileSelect={this.showPreview}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn className="is-hidden-mobile description">
                                            {item.description}
                                        </TableRowColumn>
                                        <TableRowColumn className="align-right is-hidden-mobile is-hidden-tablet-only size" >
                                            {item.calculatedSize}
                                        </TableRowColumn>
                                        <TableRowColumn className="oa align-right">
                                            <OpenAccessIcon {...item.openAccessStatus} />
                                        </TableRowColumn>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </StandardCard>
                {
                    this.state.preview.mediaUrl && this.state.preview.mimeType &&
                    <MediaPreview
                        ref="mediaPreview"
                        mediaUrl={this.state.preview.mediaUrl}
                        previewMediaUrl={this.state.preview.previewMediaUrl}
                        mimeType={this.state.preview.mimeType}
                        onClose={this.hidePreview}/>
                }
            </section>
        );
    }
}
