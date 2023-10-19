import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { JournalFieldsMap } from './JournalFieldsMap';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { sanitiseId } from 'helpers/general';

const JournalsListDataCol2Full = ({ journal, index }) => {
    return (
        <Grid
            container
            spacing={0}
            padding={0}
            id={`journal-list-data-col-2-full-${index}`}
            data-testid={`journal-list-data-col-2-full-${index}`}
            alignItems="center"
            style={{ borderBottom: '1px dashed #e6e6e6' }}
        >
            {JournalFieldsMap.slice(1).map(item => {
                const itemData = (journal && item.translateFn(journal)) || '';
                const id = sanitiseId(`journal-list-data-col-2-full-${item.key}-${index}`);
                return (
                    <Grid
                        key={`${item.key}-${index}`}
                        style={{
                            height: 43,
                            overflow: 'hidden',
                            borderRight: '1px dashed #e6e6e6',
                            width: item.size,
                            marginBottom: 0,
                            paddingLeft: 12,
                        }}
                        id={id}
                        data-testid={id}
                    >
                        <Tooltip
                            title={
                                (itemData && item.showTooltip && item.toolTipLabel && item.toolTipLabel(journal)) ||
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
                                    lineHeight: 2.75,
                                }}
                            >
                                {(itemData && item.prefix) || ''}
                                {itemData || ''}
                                {(itemData && item.suffix) || ''}
                            </Typography>
                        </Tooltip>
                    </Grid>
                );
            })}
        </Grid>
    );
};

JournalsListDataCol2Full.propTypes = {
    journal: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(JournalsListDataCol2Full);
