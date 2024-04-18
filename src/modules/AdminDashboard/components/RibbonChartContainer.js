import React from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import SectionTitle from './SectionTitle';

const RibbonChartContainer = ({ data, locale, colours, label, children, ...rest }) => {
    const theme = useTheme();

    return (
        <React.Fragment>
            <SectionTitle>{label}</SectionTitle>
            {!!data && (
                <TableContainer {...rest}>
                    <Table aria-label="table">
                        <TableHead>
                            <TableRow>
                                <TableCell size="small" width={200} />
                                {Object.keys(locale)
                                    .filter(item => locale[item].hasOwnProperty('label'))
                                    .map(key => {
                                        const column = locale[key];
                                        return (
                                            <TableCell
                                                key={key}
                                                align="center"
                                                size="small"
                                                sx={{
                                                    ...(Object.keys(colours).includes(key)
                                                        ? {
                                                              borderBottom: `3px solid ${colours[key]}`,
                                                              padding: theme.spacing(1),
                                                          }
                                                        : {}),
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        );
                                    })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left" size="small" width={150}>
                                    {children}
                                </TableCell>
                                {Object.keys(data).map(key => {
                                    const value = data[key];
                                    return (
                                        <TableCell key={key} align="center" size="small">
                                            {`${value}${data[key]?.suffix?.(value) ?? ''}`}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </React.Fragment>
    );
};
RibbonChartContainer.propTypes = {
    data: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
    colours: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default React.memo(RibbonChartContainer);
