import React from 'react';
import PropTypes from 'prop-types';
import {TableRow, TableRowColumn} from 'material-ui/Table';

const ViewRecordTableRow = ({heading, data}) => {
    return (
        <TableRow className="row">
            <TableRowColumn className="header">
                {heading}
            </TableRowColumn>
            <TableRowColumn className="data">
                {data}
            </TableRowColumn>
        </TableRow>
    );
};

ViewRecordTableRow.propTypes = {
    heading: PropTypes.string,
    data: PropTypes.node
};

export default ViewRecordTableRow;
