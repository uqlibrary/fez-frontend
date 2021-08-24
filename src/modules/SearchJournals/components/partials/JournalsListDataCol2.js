import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { JournalFieldsMap } from './JournalFieldsMap';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

const JournalsListDataCol2 = (journal, index) => {
    const translateDate = date => {
        return moment(date).format('L');
    };
    return (
        <Grid container spacing={1} id={`journal-list-data-${index}`} alignItems="center" style={{ marginTop: 0 }}>
            {JournalFieldsMap.slice(1).map((item, index) => {
                let labelData = '';
                switch (item.translate) {
                    case 'Date':
                        labelData = translateDate(journal.journal[item.key]);
                        break;
                    default:
                        labelData = journal.journal[item.key] || '';
                }
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
                        }}
                    >
                        <Tooltip title={labelData} placement="left">
                            <Typography
                                variant="body1"
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: 2,
                                }}
                            >
                                {labelData || ''}
                            </Typography>
                        </Tooltip>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default React.memo(JournalsListDataCol2);
