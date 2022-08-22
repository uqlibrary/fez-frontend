import React from 'react';
import PropTypes from 'prop-types';
import { JournalFieldsMap } from './JournalFieldsMap';

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import { useIsMobileView } from 'hooks';

import JournalsListCollapsibleDataPanelContent from './JournalsListCollapsibleDataPanelContent';

const JournalsListCollapsibleDataPanel = ({ row, index, classes, open }) => {
    const isXsDown = useIsMobileView();
    const dataItems = JournalFieldsMap.filter(item => !item.compactView);

    return (
        <TableRow className={classes.collapsibleRow}>
            <TableCell
                colSpan={2}
                className={!open ? classes.collapsedCell : classes.expandedCell}
                data-testid={`collapsible-cell-${open ? 'open' : 'closed'}`}
                size="small"
            >
                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit
                    id={`journal-list-collapse-panel-${index}`}
                    data-testid={`journal-list-collapse-panel-${index}`}
                >
                    <Box padding={1}>
                        <Grid container>
                            {dataItems.map((item, index) => {
                                const itemData = (row && item.translateFn(row)) || '';
                                return (
                                    <React.Fragment key={`${item.key}-${row.jnl_jid}`}>
                                        <JournalsListCollapsibleDataPanelContent
                                            item={item}
                                            data={itemData}
                                            classes={classes}
                                            {...((isXsDown && index === 0) || (!isXsDown && index <= 1)
                                                ? { isFirstRow: true }
                                                : {})}
                                            {...((isXsDown && index === dataItems.length - 1) ||
                                            (!isXsDown && index >= dataItems.length - 2)
                                                ? { isLastRow: true }
                                                : {})}
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
