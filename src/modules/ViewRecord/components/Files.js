import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody, TableRowColumn, TableHeader, TableRow, TableHeaderColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import FileName from './partials/FileName';

const moment = require('moment');

export default class Files extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        handleFileNameClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderFileDetail = (pid, fileName, embargoDate, accessCondition, order, dataStreams) => {
        const dataStream = this.searchByName(dataStreams, 'dsi_dsid', fileName);
        const mimeType = dataStream && dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
        const thumbnailDataStream = this.searchByName(dataStreams, 'dsi_dsid', 'thumbnail_' + fileName);
        const previewDataStream = this.searchByName(dataStreams, 'dsi_dsid', 'preview_' + fileName);
        const openAccess = !(embargoDate || (accessCondition && accessCondition.rek_file_attachment_access_condition === 8));

        return (
            <TableRow selectable={false} className="file" key={`file-${order}`}>
                <TableRowColumn>
                    {
                        <FileName pid={pid} fileName={fileName} mimeType={mimeType} openAccess={openAccess} thumbnailFileName={thumbnailDataStream && thumbnailDataStream.dsi_dsid} previewFileName={previewDataStream && previewDataStream.dsi_dsid} handleFileNameClick={this.props.handleFileNameClick} />
                    }
                </TableRowColumn>
                <TableRowColumn>
                    {
                        dataStream &&
                        dataStream.dsi_label
                    }
                </TableRowColumn>
                <TableRowColumn className="rowOA align-right">
                    {
                        this.renderEmbargoDate(embargoDate, openAccess)
                    }
                </TableRowColumn>
                <TableRowColumn className="align-right">
                    {
                        dataStream &&
                        this.formatBytes(dataStream.dsi_size)
                    }
                </TableRowColumn>
            </TableRow>
        );
    }

    searchByOrder = (grantData, orderSubkey, order) => {
        return grantData && grantData.filter(grantData=>grantData[orderSubkey] === order)[0];
    }

    searchByName = (dataStreams, nameSubkey, name) => {
        return dataStreams && dataStreams.filter(dataStream=>dataStream[nameSubkey] === name)[0];
    }

    renderEmbargoDate = (embargoDate, openAccess = false) => {
        if (!openAccess) {
            return (<div className="fez-icon openAccessClosed large"/>);
        }

        return (embargoDate && moment(embargoDate.rek_file_attachment_embargo_date).isAfter(moment())) ?
            (
                <div>
                    <span className="is-hidden-mobile is-hidden-tablet-only">
                        {locale.viewRecord.sections.files.embargoDate.replace('[embargoDate]', moment(embargoDate.rek_file_attachment_embargo_date).format('DD/MM/YYYY'))}
                    </span>
                    <div className="fez-icon openAccessEmbargoed large"/>
                </div>
            )
            :
            (
                <div className="fez-icon openAccess large"/>
            );
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
            // console.log(fileName.rek_file_attachment_name)
            !fileName.rek_file_attachment_name.match('^(FezACML|stream|web|thumbnail|presmd)')
        )).sort((fileName1, fileName2) => (
            fileName1.rek_file_attachment_name_order - fileName2.rek_file_attachment_name_order
        )).map((fileName) => {
            const order = fileName.rek_file_attachment_name_order;
            const embargoDate = this.searchByOrder(embargoDates, 'rek_file_attachment_embargo_date_order', order);
            const accessCondition = this.searchByOrder(accessConditions, 'rek_file_attachment_access_condition_order', order);

            files.push(this.renderFileDetail(publication.rek_pid, fileName.rek_file_attachment_name, embargoDate, accessCondition, order, dataStreams));
        });

        return (
            <Table selectable={false} className="files">
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn>{locale.viewRecord.sections.files.fileName}</TableHeaderColumn>
                        <TableHeaderColumn>{locale.viewRecord.sections.files.description}</TableHeaderColumn>
                        <TableHeaderColumn/>
                        <TableHeaderColumn className="align-right">{locale.viewRecord.sections.files.size}</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {files}
                </TableBody>
            </Table>
        );
    }

    render() {
        return (
            <StandardCard title={locale.viewRecord.sections.files.title}>
                {this.props.publication.fez_record_search_key_file_attachment_name && this.renderFiles(this.props.publication)}
            </StandardCard>
        );
    }
}
