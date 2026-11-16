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

const RibbonChartContainer = ({ data, locale, colours, label, id, children, ...rest }) => {
    const theme = useTheme();

    return (
        <React.Fragment>
            <SectionTitle data-testid={`${id}-title`}>{label}</SectionTitle>
            {!!data && (
                <TableContainer
                    data-testid={`${id}-table`}
                    tabIndex={0}
                    {...rest}
                    sx={{
                        // At high zoom / narrow columns the stat columns need all the width: drop the ribbon
                        // (it repeats the assigned/unassigned figures) and tighten the cell padding.
                        containerType: 'inline-size',
                        '@container (max-width: 24em)': {
                            '& .ribbon-chart-cell': { display: 'none' },
                            '& .MuiTableCell-root': { paddingInline: theme.spacing(1) },
                        },
                        '@container (max-width: 20em)': {
                            '& .MuiTableCell-root': { paddingInline: theme.spacing(0.5) },
                        },
                        ...rest.sx,
                    }}
                >
                    <Table aria-label="table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className="ribbon-chart-cell"
                                    size="small"
                                    sx={{ width: '35%' }}
                                    aria-hidden="true"
                                />
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
                                                role="columnheader"
                                            >
                                                {column.label}
                                            </TableCell>
                                        );
                                    })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell className="ribbon-chart-cell" align="left" size="small">
                                    {children}
                                </TableCell>
                                {Object.keys(data)
                                    .filter(key => locale.hasOwnProperty(key))
                                    .map(key => {
                                        const value = data[key];
                                        return (
                                            <TableCell key={key} align="center" size="small">
                                                {`${value}${locale[key]?.suffix?.(data.total, value) ?? ''}`}
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
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    data: PropTypes.object,
    locale: PropTypes.object,
    colours: PropTypes.object,
    children: PropTypes.node,
};

export default React.memo(RibbonChartContainer);
