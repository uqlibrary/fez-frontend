import React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';

const moment = require('moment');

const historyEventDate = date => {
    return moment.utc(date.pre_date).local().format('ddd MMM DD YYYY, hh:mm:ss A');
};

export const DetailedHistory = ({ record }) => {
    const dispatch = useDispatch();
    const detailedHistoryList = useSelector(state => state.get('viewRecordReducer').recordDetailedHistory);
    React.useEffect(() => {
        dispatch(actions.loadDetailedHistory(record.rek_pid));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ width: '100%' }} id="detailed-history" data-testid="detailed-history">
            {detailedHistoryList && detailedHistoryList.length > 0 && (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="detailed-history-content"
                        id="detailed-history-header"
                        data-testid="detailed-history-header"
                    >
                        <Typography variant="h5">Detailed History ({detailedHistoryList.length} events)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container data-testid={'detailed-history-grid'}>
                            <Grid
                                item
                                xs={4}
                                sx={{ padding: '5px', color: '#fff', backgroundColor: '#51247A', paddingLeft: '5px' }}
                            >
                                <span>Date</span>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                sx={{ padding: '5px', color: '#fff', backgroundColor: '#51247A', paddingLeft: '5px' }}
                            >
                                <span>Event</span>
                            </Grid>
                            {detailedHistoryList
                                .sort((a, b) => b.pre_id - a.pre_id)
                                .map(histItem => {
                                    return (
                                        <Grid
                                            container
                                            key={histItem.pre_id}
                                            id={`detailed-history-row-${histItem.pre_id}`}
                                            data-testid={`detailed-history-row-${histItem.pre_id}`}
                                            sx={{
                                                '&:nth-child(even)': {
                                                    backgroundColor: '#efefef',
                                                },
                                            }}
                                        >
                                            <Grid item xs={4} style={{ padding: '5px' }}>
                                                <Typography
                                                    variant="body2"
                                                    component={'span'}
                                                    data-testid={`detailed-history-date-${histItem.pre_id}`}
                                                    id={`detailed-history-date-${histItem.pre_id}`}
                                                >
                                                    {historyEventDate(histItem)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8} style={{ padding: '5px' }}>
                                                <Typography variant="body2" component={'span'}>
                                                    {histItem.pre_detail}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    );
};

DetailedHistory.propTypes = {
    detailedHistory: PropTypes.array,
    record: PropTypes.object,
    loadDetailedHistory: PropTypes.func,
};
export default DetailedHistory;
