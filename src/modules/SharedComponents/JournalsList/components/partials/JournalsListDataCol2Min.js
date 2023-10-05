import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { JournalFieldsMap } from './JournalFieldsMap';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { sanitiseId } from 'helpers/general';

const JournalsListDataCol2Min = ({ journal, index }) => {
    return (
        <Grid
            container
            spacing={0}
            padding={0}
            id={`journal-list-data-col-2-min-${index}`}
            data-testid={`journal-list-data-col-2-min-${index}`}
            sx={{ borderBottom: '1px dashed #e6e6e6' }}
        >
            {JournalFieldsMap.slice(1)
                .filter(item => item.compactView)
                .map(item => {
                    const itemData = (journal && item.translateFn(journal)) || '';
                    const id = sanitiseId(`journal-list-data-col-2-min-${item.key}-${index}`);
                    return (
                        <Grid
                            key={`${item.key}-${index}`}
                            item
                            sx={{
                                width: item.size,
                                height: '43px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderRight: '1px dashed #e6e6e6',
                                marginBottom: 0,
                                paddingLeft: '12px',
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
                                describeChild
                                placement="left"
                                disableFocusListener={!item.showTooltip || !itemData}
                                disableHoverListener={!item.showTooltip || !itemData}
                                disableTouchListener={!item.showTooltip || !itemData}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
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

JournalsListDataCol2Min.propTypes = {
    journal: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(JournalsListDataCol2Min);
