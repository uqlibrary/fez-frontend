import React from 'react';
import PropTypes from 'prop-types';
import {TableRow, TableRowColumn} from 'material-ui/Table';

const ViewRecordTableRow = ({heading, data}) => {
    return (
        <TableRow className="tableRow">
            <TableRowColumn className="headingColumn">
                {heading}
            </TableRowColumn>
            <TableRowColumn className="dataColumn">
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
