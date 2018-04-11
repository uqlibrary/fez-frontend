import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody, TableRowColumn, TableHeader, TableRow, TableHeaderColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';

import moment from 'moment';
import AvVolumeUp from 'material-ui/svg-icons/av/volume-up';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import PictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf';
import Image from 'material-ui/svg-icons/image/image';
import AvVideocam from 'material-ui/svg-icons/av/videocam';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import {pathConfig} from 'config/routes';
import {viewRecordsConfig} from 'config/viewRecord';

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

    renderFileIcon = (mimeType) => {
        if (mimeType.indexOf('audio') >= 0) {
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

    // TODO: uncomment when preview is available
    // hidePreview = () => {
    //     this.setState({
    //         preview: {
    //             mediaUrl: null,
    //             previewMediaUrl: null,
    //             mimeType: null
    //         }
    //     });
    // }
    //
    // showPreview = (mediaUrl, previewMediaUrl, mimeType) => {
    //     this.setState({
    //         preview: {
    //             mediaUrl: mediaUrl,
    //             previewMediaUrl: previewMediaUrl,
    //             mimeType: mimeType
    //         }
    //     });
    // }

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

    renderEmbargoDate = (embargoDate) => {
        return embargoDate && moment(embargoDate).isAfter(moment()) ? locale.viewRecord.sections.files.embargoDate.replace('[embargoDate]', moment(embargoDate).format('DD/MM/YYYY')) : null;
    }

    // filter out fezacml, premd, thumbnail, web prefix files
    getFileData = (publication) => {
        const dataStreams = publication.fez_datastream_info;

        return !!dataStreams && dataStreams.length > 0
            ? dataStreams.filter((dataStream) => (
                !dataStream.dsi_dsid.match(viewRecordsConfig.files.blacklist.namePrefixRegex) &&
                !dataStream.dsi_label.match(new RegExp(viewRecordsConfig.files.blacklist.descriptionKeywordsRegex, 'gi'))
            )).map(dataStream => {
                const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
                // TODO: set values for open access/allowDownload when available
                return {
                    pid: publication.rek_pid,
                    fileName: dataStream.dsi_dsid,
                    description: dataStream.dsi_label,
                    mimeType: mimeType,
                    embargoText: this.renderEmbargoDate(dataStream.dsi_embargo_date),
                    calculatedSize: this.formatBytes(dataStream.dsi_size),
                    icon: this.renderFileIcon(mimeType)
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
                    <Table selectable={false} className="files horizontal">
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="header">
                            <TableRow>
                                <TableHeaderColumn className="filetype" />
                                <TableHeaderColumn className="filename">
                                    {locale.viewRecord.sections.files.fileName}
                                </TableHeaderColumn>
                                <TableHeaderColumn className="description is-hidden-mobile">
                                    {locale.viewRecord.sections.files.description}
                                </TableHeaderColumn>
                                <TableHeaderColumn className="oaStatus"/>
                                <TableHeaderColumn className="align-right is-hidden-mobile is-hidden-tablet-only size">
                                    {locale.viewRecord.sections.files.size}
                                </TableHeaderColumn>
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
                                            {
                                                !item.embargoText &&
                                                <ExternalLink
                                                    href={pathConfig.file.url(item.pid, item.fileName)}
                                                    title={`${item.fileName} - ${item.description} - ${item.calculatedSize}`}
                                                    className={'fileName'}
                                                    openInNewIcon
                                                >
                                                    {item.fileName}
                                                </ExternalLink>
                                            }
                                            {
                                                item.embargoText && item.fileName
                                            }
                                        </TableRowColumn>
                                        <TableRowColumn className="is-hidden-mobile description">
                                            {item.description}
                                        </TableRowColumn>
                                        <TableRowColumn className="oaStatus">
                                            {item.embargoText}
                                        </TableRowColumn>
                                        <TableRowColumn className="align-right is-hidden-mobile is-hidden-tablet-only size" >
                                            {item.calculatedSize}
                                        </TableRowColumn>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </StandardCard>
                {
                    // TODO: MediaPreview will be here...
                }
            </section>
        );
    }
}
