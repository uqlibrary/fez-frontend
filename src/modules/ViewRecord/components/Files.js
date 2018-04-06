import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody, TableRowColumn, TableHeader, TableRow, TableHeaderColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';

import AvVolumeUp from 'material-ui/svg-icons/av/volume-up';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import PictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf';
import Image from 'material-ui/svg-icons/image/image';
import AvVideocam from 'material-ui/svg-icons/av/videocam';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import {pathConfig} from 'config/routes';

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

    searchByKey = (list, key, value) => {
        return list && list.filter(item=>item[key] === value)[0];
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

    // filter out fezacml, premd, thumbnail, web prefix files
    getFileData = (publication) => {
        const fileNames = publication.fez_record_search_key_file_attachment_name;
        const dataStreams = publication.fez_datastream_info;

        const files = !!fileNames && fileNames.length > 0
            ? fileNames.filter((fileName) => (
                !fileName.rek_file_attachment_name.match('^(FezACML|stream|web|thumbnail|preview|presmd)')
            )).sort((fileName1, fileName2) => (
                fileName1.rek_file_attachment_name_order - fileName2.rek_file_attachment_name_order
            )).map(fileName => {
                const order = fileName.rek_file_attachment_name_order;
                const dataStream = this.searchByKey(dataStreams, 'dsi_dsid', fileName.rek_file_attachment_name);
                const mimeType = dataStream && dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
                // TODO: set values for open access/allowDownload when available
                return {
                    order: order,
                    pid: publication.rek_pid,
                    fileName: fileName.rek_file_attachment_name,
                    mimeType: mimeType,
                    dataStream: dataStream,
                    calculatedSize: dataStream && this.formatBytes(dataStream.dsi_size),
                    icon: this.renderFileIcon(mimeType)
                };
            })
            : [];

        return files;
    }

    render() {
        const {publication} = this.props;
        const fileData = this.getFileData(publication);
        if (fileData.length === 0) return null;
        return (
            <section>
                <StandardCard title={locale.viewRecord.sections.files.title}>
                    {
                        !this.props.hideCulturalSensitivityStatement &&
                        <Alert allowDismiss type={'info'}
                            message={locale.viewRecord.sections.files.culturalSensitivityStatement}
                            dismissAction={this.props.setHideCulturalSensitivityStatement}/>
                    }
                    <Table selectable={false} className="file header">
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="tableHeader">
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
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                fileData.map(item => (
                                    <TableRow selectable={true} className="file" key={`file-${item.order}`}>
                                        <TableRowColumn className="filetype fileIcon">
                                            {item.icon}
                                        </TableRowColumn>
                                        <TableRowColumn className="filename">
                                            <ExternalLink
                                                href={pathConfig.file.url(item.pid, item.fileName)}
                                                title={locale.viewRecord.sections.files.linkTitle
                                                    .replace('[filename]', item.fileName)
                                                    .replace('[description]', item.dataStream && item.dataStream.dsi_label)
                                                    .replace('[size]', item.calculatedSize)
                                                }
                                                className={'fileName'} openInNewIcon
                                            >
                                                {item.fileName}
                                            </ExternalLink>
                                        </TableRowColumn>
                                        <TableRowColumn className="is-hidden-mobile description">
                                            {item.dataStream && item.dataStream.dsi_label}
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
