import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
// import {locale} from 'locale';

export default class ViewRecordLinks extends PureComponent {
    static propTypes = {
        recordToView: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        const record = this.props.recordToView;
        return (
            <div className="viewRecordLinks">
                <Table selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="tableHeader">
                        <TableRow>
                            <TableHeaderColumn className="rowLink">Link (will open in a new window)</TableHeaderColumn>
                            <TableHeaderColumn className="rowDescription">Description</TableHeaderColumn>
                            <TableHeaderColumn className="rowOA align-right">OA Status</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} className="tableData">
                        {record.fez_record_search_key_pubmed_central_id &&
                            <TableRow key="0">
                                <TableRowColumn className="rowLink">
                                    <PubmedCentralLink pubmedCentralId={record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id}/>
                                </TableRowColumn>
                                <TableRowColumn className="rowDescription">PubmedCentral link</TableRowColumn>
                                <TableRowColumn className="rowOA align-right">
                                    <div className="fez-icon openAccess large"/>
                                </TableRowColumn>
                            </TableRow>
                        }
                        {record.fez_record_search_key_link &&
                        record.fez_record_search_key_link.map((item, index) => (
                            <TableRow key={index + 1}>
                                <TableRowColumn className="rowLink">
                                    <ExternalLink href={item.rek_link}>{item.rek_link}</ExternalLink>
                                </TableRowColumn>
                                <TableRowColumn className="rowDescription">{record.fez_record_search_key_link_description[index].rek_link_description || 'Default message'}</TableRowColumn>
                                <TableRowColumn className="rowOA align-right">
                                    <div className="fez-icon openAccess large"/>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
