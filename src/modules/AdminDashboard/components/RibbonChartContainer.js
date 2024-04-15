import React from 'react';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const RibbonChartContainer = ({ data, label, children, ...rest }) => {
    return (
        <React.Fragment>
            <Typography textTransform={'uppercase'} fontWeight={400}>
                {label}
            </Typography>

            <TableContainer {...rest}>
                <Table aria-label="table">
                    <TableHead>
                        <TableRow>
                            <TableCell size="small" width={200} />
                            {data.map(column => (
                                <TableCell
                                    key={`h_${column.label}`}
                                    align="center"
                                    size="small"
                                    sx={{ ...(column.sx ?? {}) }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left" size="small" width={150}>
                                {children}
                            </TableCell>
                            {data.map(row => (
                                <TableCell key={row.label} align="center" size="small">
                                    {`${row.value}${row.suffix ? ` ${row.suffix}` : ''}`}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};
RibbonChartContainer.propTypes = {
    data: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default React.memo(RibbonChartContainer);
