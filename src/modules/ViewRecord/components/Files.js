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
        const thumbnailDataStream = this.searchByName(dataStreams, 'dsi_dsid', 'thumbnail_' + fileName);
        const previewDataStream = this.searchByName(dataStreams, 'dsi_dsid', 'preview_' + fileName);
        const mimeType = dataStream && dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
        const openAccess = this.isOpenAccess(accessCondition);
        const isEmbargoed = this.isEmbargoed(embargoDate);

        return (
            <TableRow selectable={false} className="file" key={`file-${order}`}>
                <TableRowColumn className="filename">
                    {
                        <FileName
                            pid={pid}
                            fileName={fileName}
                            mimeType={mimeType}
                            isEmbargoed={isEmbargoed}
                            openAccess={openAccess}
                            thumbnailFileName={thumbnailDataStream && thumbnailDataStream.dsi_dsid}
                            previewFileName={previewDataStream && previewDataStream.dsi_dsid}
                            handleFileNameClick={this.props.handleFileNameClick}
                        />
                    }
                </TableRowColumn>
                <TableRowColumn className="is-hidden-mobile description">
                    {
                        dataStream &&
                        dataStream.dsi_label
                    }
                </TableRowColumn>
                <TableRowColumn className="align-right oaStatus">
                    {
                        this.renderEmbargoDate(embargoDate, isEmbargoed, openAccess)
                    }
                </TableRowColumn>
                <TableRowColumn className="align-right is-hidden-mobile is-hidden-tablet-only size" >
                    {
                        dataStream &&
                        this.formatBytes(dataStream.dsi_size)
                    }
                </TableRowColumn>
            </TableRow>
        );
    }

    renderEmbargoDate = (embargoDate, isEmbargoed = false, openAccess = false) => {
        if (!openAccess) {
            return (<div className="fez-icon closedAccess large"/>);
        }

        return (isEmbargoed) ?
            (
                <div>
                    <span className="is-hidden-mobile is-hidden-tablet-only">
                        {locale.viewRecord.sections.files.embargoDate.replace('[embargoDate]', this.formatEmbargoDate(embargoDate))}
                    </span>
                    <div className="fez-icon openAccessEmbargoed large"/>
                </div>
            )
            :
            (
                <div className="fez-icon openAccess large"/>
            );
    }

    searchByOrder = (grantData, orderSubkey, order) => {
        return grantData && grantData.filter(grantData=>grantData[orderSubkey] === order)[0];
    }

    searchByName = (dataStreams, nameSubkey, name) => {
        return dataStreams && dataStreams.filter(dataStream=>dataStream[nameSubkey] === name)[0];
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

    formatEmbargoDate = (embargoDate) => {
        return moment(embargoDate.rek_file_attachment_embargo_date).format('DD/MM/YYYY');
    }

    isEmbargoed = (embargoDate) => {
        return embargoDate && moment(embargoDate.rek_file_attachment_embargo_date).isAfter(moment());
    }

    isOpenAccess = (accessCondition) => {
        return (accessCondition && parseInt(accessCondition.rek_file_attachment_access_condition, 10) === 8);
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
            <Table selectable={false} className="file header">
                <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="tableHeader">
                    <TableRow>
                        <TableHeaderColumn className="filename">{locale.viewRecord.sections.files.fileName}</TableHeaderColumn>
                        <TableHeaderColumn className="description is-hidden-mobile">{locale.viewRecord.sections.files.description}</TableHeaderColumn>
                        <TableHeaderColumn className="oaStatus"/>
                        <TableHeaderColumn className="align-right is-hidden-mobile is-hidden-tablet-only size">{locale.viewRecord.sections.files.size}</TableHeaderColumn>
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
