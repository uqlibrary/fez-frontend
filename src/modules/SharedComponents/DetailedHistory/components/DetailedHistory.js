import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';

const moment = require('moment');

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    detailedHistoryRow: {
        '&:nth-child(even)': {
            backgroundColor: '#efefef',
        },
    },
}));

export const DetailedHistory = ({ record }) => {
    const dispatch = useDispatch();
    const detailedHistoryList = useSelector(state => state.get('viewRecordReducer').recordDetailedHistory);
    React.useEffect(() => {
        dispatch(actions.loadDetailedHistory(record.rek_pid));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
    return detailedHistoryList && detailedHistoryList.length > 0 ? (
        <div className={classes.root} id="Detailed-History" data-testid="Detailed-History">
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
                    <Grid container>
                        <Grid
                            item
                            xs={4}
                            style={{ padding: '5px', color: '#fff', backgroundColor: '#51247A', paddingLeft: '5px' }}
                        >
                            <span>Date</span>
                        </Grid>
                        <Grid
                            item
                            xs={8}
                            style={{ padding: '5px', color: '#fff', backgroundColor: '#51247A', paddingLeft: '5px' }}
                        >
                            <span>Event</span>
                        </Grid>
                        {/* Data Elements */}

                        {detailedHistoryList
                            .sort((a, b) => b.pre_id - a.pre_id)
                            .map(histItem => {
                                const eventDate = moment(new Date(histItem.pre_date)).format(
                                    'ddd MMM DD YYYY, HH:mm:ss A',
                                );
                                return (
                                    <Grid
                                        container
                                        key={histItem.pre_id}
                                        id={`detailed-history-row-${histItem.pre_id}`}
                                        data-testid={`detailed-history-row-${histItem.pre_id}`}
                                        className={classes.detailedHistoryRow}
                                    >
                                        <Grid item xs={4} style={{ padding: '5px' }}>
                                            <Typography variant="body2" component={'span'}>
                                                {eventDate}
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
        </div>
    ) : (
        <div id="Detailed-History-Empty" data-testid="Detailed-History-Empty" />
    );
};

DetailedHistory.propTypes = {
    detailedHistory: PropTypes.array,
    record: PropTypes.object,
    loadDetailedHistory: PropTypes.func,
};
export default DetailedHistory;
