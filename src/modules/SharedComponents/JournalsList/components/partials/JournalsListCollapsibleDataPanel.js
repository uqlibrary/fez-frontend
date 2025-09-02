import React from 'react';
import PropTypes from 'prop-types';
import JournalFieldsMap from './JournalFieldsMap';

import Grid from '@mui/material/GridLegacy';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { useIsMobileView } from 'hooks';

import JournalsListCollapsibleDataPanelContent from './JournalsListCollapsibleDataPanelContent';

const JournalsListCollapsibleDataPanel = ({ row, index, open }) => {
    const isXsDown = useIsMobileView();
    const dataItems = JournalFieldsMap.filter(item => !item.compactView);

    return (
        <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
            <TableCell
                colSpan={2}
                sx={{ ...(!open ? { padding: 0, borderBottom: 0 } : { padding: 1 }) }}
                data-testid={`collapsible-cell-${open ? 'open' : 'closed'}-${index}`}
                id={`collapsible-cell-${open ? 'open' : 'closed'}-${index}`}
                size="small"
            >
                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit
                    id={`journal-list-collapse-panel-${index}`}
                    data-testid={`journal-list-collapse-panel-${index}`}
                >
                    <Box
                        sx={{
                            padding: 1,
                        }}
                    >
                        <Grid container>
                            {dataItems.map((item, itemIndex) => {
                                const itemData = (row && item.translateFn(row)) || /* istanbul ignore next */ '';
                                return (
                                    <React.Fragment key={`${item.key}-${row.jnl_jid}`}>
                                        <JournalsListCollapsibleDataPanelContent
                                            item={item}
                                            index={index}
                                            data={itemData}
                                            {...((isXsDown && itemIndex === 0) || (!isXsDown && itemIndex <= 1)
                                                ? { isFirstRow: true }
                                                : /* istanbul ignore next */ {})}
                                            {...((isXsDown && itemIndex === dataItems.length - 1) ||
                                            (!isXsDown && itemIndex >= dataItems.length - 2)
                                                ? { isLastRow: true }
                                                : /* istanbul ignore next */ {})}
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </Grid>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
JournalsListCollapsibleDataPanel.propTypes = {
    row: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    classes: PropTypes.object,
};

export default React.memo(JournalsListCollapsibleDataPanel);
