import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { JournalFieldsMap } from './JournalFieldsMap';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const JournalsListDataCol2Full = ({ journal, index }) => {
    return (
        <Grid
            container
            spacing={0}
            id={`journal-list-data-${index}`}
            alignItems="center"
            style={{ borderBottom: '1px dashed #e6e6e6' }}
        >
            {JournalFieldsMap.slice(1).map((item, index) => {
                const itemData = (journal && item.translateFn(journal)) || '';
                return (
                    <Grid
                        key={index}
                        item
                        id={`journal-list-header-title-${index}`}
                        style={{
                            height: 43,
                            overflow: 'hidden',
                            borderRight: '1px dashed #e6e6e6',
                            width: item.size,
                            marginBottom: 0,
                            paddingLeft: 12,
                        }}
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
