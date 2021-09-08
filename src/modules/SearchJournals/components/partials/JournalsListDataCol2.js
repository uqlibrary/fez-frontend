import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { JournalFieldsMap } from './JournalFieldsMap';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const JournalsListDataCol2 = ({ journal, index, minimalView }) => {
    return (
        <Grid
            container
            spacing={1}
            id={`journal-list-data-${index}`}
            alignItems="center"
            style={{ marginTop: -4, borderBottom: '1px dashed #e6e6e6' }}
        >
            {JournalFieldsMap.slice(1).map((item, index) => {
                if ((minimalView && item.compactView) || !minimalView) {
                    const itemData = (journal && item.translateFn(journal)) || '';
                    return (
                        <Grid
                            key={index}
                            item
                            id={`journal-list-header-title-${index}`}
                            style={{
                                height: 48,
                                borderLeft: '1px dashed #e6e6e6',
                                width: minimalView ? item.compactSize : item.size,
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
                }
                return null;
            })}
        </Grid>
    );
};

JournalsListDataCol2.propTypes = {
    journal: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    minimalView: PropTypes.bool.isRequired,
};

export default React.memo(JournalsListDataCol2);
