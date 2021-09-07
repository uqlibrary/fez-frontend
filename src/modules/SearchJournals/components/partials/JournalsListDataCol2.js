import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { JournalFieldsMap } from './JournalFieldsMap';
import Tooltip from '@material-ui/core/Tooltip';

const JournalsListDataCol2 = (journal, index) => {
    return (
        <Grid container spacing={1} id={`journal-list-data-${index}`} alignItems="center" style={{ marginTop: 0 }}>
            {JournalFieldsMap.slice(1).map((item, index) => {
                const itemData = (journal && item.translateFn(journal.journal)) || '';
                return (
                    <Grid
                        key={index}
                        item
                        id={`journal-list-header-title-${index}`}
                        style={{
                            height: 45,
                            borderBottom: '1px dashed #e6e6e6',
                            borderLeft: '1px dashed #e6e6e6',
                            width: item.size,
                            marginBottom: 4,
                            paddingLeft: 12,
                        }}
                    >
                        <Tooltip
                            title={
                                (itemData &&
                                    item.showTooltip &&
                                    item.toolTipLabel &&
                                    item.toolTipLabel(journal.journal)) ||
                                (item.showTooltip && itemData) ||
                                ''
                            }
                            placement="left"
                            disableFocusListener={!item.showTooltip || !itemData}
                            disableHoverListener={!item.showTooltip || !itemData}
                            disableTouchListener={!item.showTooltip || !itemData}
                        >
                            <Typography
                                variant="body1"
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: 2,
                                }}
                            >
                                {item.prefix || ''}
                                {itemData || ''}
                                {item.suffix || ''}
                            </Typography>
                        </Tooltip>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default React.memo(JournalsListDataCol2);
