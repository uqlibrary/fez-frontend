import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody, TableRowColumn, TableHeader, TableRow, TableHeaderColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import FileName from './partials/FileName';
import moment from 'moment';
import {QuickTemplates, OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION, OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT, OPEN_ACCESS_ID_OTHER} from 'config/general';
import OpenAccessIcon from './partials/OpenAccessIcon';

export default class Files extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        onFileSelect: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    isFileOpenAccess = (record, fileName, accessCondition, embargoDate) => {
        const openAccessStatusId = record.fez_record_search_key_oa_status
            && record.fez_record_search_key_oa_status.rek_oa_status;
        if (openAccessStatusId === OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION
        || openAccessStatusId === OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT
        || openAccessStatusId === OPEN_ACCESS_ID_OTHER) {
            // closed access file without embargo date
            if (accessCondition && !embargoDate
                && parseInt(accessCondition.rek_file_attachment_access_condition, 10) === QuickTemplates.CLOSED_ACCESS_ID) {
                return {isOpenAccess: false, embargoDate: null, openAccessStatusId: openAccessStatusId};
            }
            // closed access with embargo date or open access file
            const currentDate = moment().format();
            const hasEmbargoDateMatured = !embargoDate || moment(embargoDate.rek_file_attachment_embargo_date).format() < currentDate;
            const displayEmbargoDate = !!embargoDate && !hasEmbargoDateMatured ? moment(embargoDate.rek_file_attachment_embargo_date).format('Do MMMM YYYY') : null;
            // TODO: other quick template ids - do users have access to those files?
            return {isOpenAccess: hasEmbargoDateMatured, embargoDate: displayEmbargoDate, openAccessStatusId: openAccessStatusId};
        } else {
            return {isOpenAccess: false, embargoDate: null, openAccessStatusId: openAccessStatusId};
        }
    };

    renderFileDetail = (order, pid, fileName, openAccessStatus, dataStreams) => {
        const dataStream = this.searchByKey(dataStreams, 'dsi_dsid', fileName);
        const thumbnailDataStream = this.searchByKey(dataStreams, 'dsi_dsid', 'thumbnail_' + fileName);
        const previewDataStream = this.searchByKey(dataStreams, 'dsi_dsid', 'preview_' + fileName);
        const mimeType = dataStream && dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
        return (
            <TableRow selectable={false} className="file" key={`file-${order}`}>
                <TableRowColumn className="filename">
                    {
                        <FileName
                            pid={pid}
                            fileName={fileName}
                            mimeType={mimeType}
                            allowDownload={openAccessStatus.isOpenAccess}
                            thumbnailFileName={thumbnailDataStream && thumbnailDataStream.dsi_dsid}
                            previewFileName={previewDataStream && previewDataStream.dsi_dsid}
                            onFileSelect={this.props.onFileSelect}
                        />
                    }
                </TableRowColumn>
                <TableRowColumn className="is-hidden-mobile description">
                    {
                        dataStream &&
                        dataStream.dsi_label
                    }
                </TableRowColumn>
                <TableRowColumn className="align-right is-hidden-mobile is-hidden-tablet-only size" >
                    {
                        dataStream &&
                        this.formatBytes(dataStream.dsi_size)
                    }
                </TableRowColumn>
                <TableRowColumn className="rowOA align-right">
                    <OpenAccessIcon {...openAccessStatus} showEmbargoText />
                </TableRowColumn>
            </TableRow>
        );
    }

    searchByKey = (list, key, value) => {
        return list && list.filter(item=>item[key] === value)[0];
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

    // filter out fezacml, premd, thumbnail, web prefix files
    renderFiles = (publication) => {
        const files = [];
        const fileNames = publication.fez_record_search_key_file_attachment_name;
        const embargoDates = publication.fez_record_search_key_file_attachment_embargo_date;
        const accessConditions = publication.fez_record_search_key_file_attachment_access_condition;
        const dataStreams = publication.fez_datastream_info;

        fileNames.filter((fileName) => (
            !fileName.rek_file_attachment_name.match('^(FezACML|stream|web|thumbnail|preview|presmd)')
        )).sort((fileName1, fileName2) => (
            fileName1.rek_file_attachment_name_order - fileName2.rek_file_attachment_name_order
        )).map((fileName) => {
            const order = fileName.rek_file_attachment_name_order;
            const embargoDate = this.searchByKey(embargoDates, 'rek_file_attachment_embargo_date_order', order);
            const accessCondition = this.searchByKey(accessConditions, 'rek_file_attachment_access_condition_order', order);
            const openAccessStatus = this.isFileOpenAccess(this.props.publication, fileName, accessCondition, embargoDate);
            files.push(this.renderFileDetail(order, publication.rek_pid, fileName.rek_file_attachment_name, openAccessStatus, dataStreams));
        });

        return (
            <Table selectable={false} className="file header">
                <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="tableHeader">
                    <TableRow>
                        <TableHeaderColumn className="filename">{locale.viewRecord.sections.files.fileName}</TableHeaderColumn>
                        <TableHeaderColumn className="description is-hidden-mobile">{locale.viewRecord.sections.files.description}</TableHeaderColumn>
                        <TableHeaderColumn className="align-right is-hidden-mobile is-hidden-tablet-only size">{locale.viewRecord.sections.files.size}</TableHeaderColumn>
                        <TableHeaderColumn className="oaStatus"/>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {files}
                </TableBody>
            </Table>
        );
    }

    render() {
        const {publication} = this.props;

        return (
            <StandardCard title={locale.viewRecord.sections.files.title}>
                {
                    publication.fez_record_search_key_file_attachment_name &&
                    publication.fez_record_search_key_file_attachment_name.length > 0 &&
                    this.renderFiles(publication)
                }
            </StandardCard>
        );
    }
}
