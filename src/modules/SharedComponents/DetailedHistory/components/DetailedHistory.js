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

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export const DetailedHistory = ({ record }) => {
    const dispatch = useDispatch();
    const detailedHistoryList = useSelector(state => state.get('viewRecordReducer').recordDetailedHistory);
    React.useEffect(() => {
        dispatch(actions.loadDetailedHistory(record.rek_pid));
        //   !!record.rek_pid && !!loadDetailedHistory && loadDetailedHistory(record.rek_pid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography variant="h5">
                        Detailed History{' '}
                        {!!detailedHistoryList ? `(${detailedHistoryList.length} events)` : '(Loading...)'}
                    </Typography>
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

                        {!!detailedHistoryList &&
                            detailedHistoryList
                                .sort((a, b) => b.pre_id - a.pre_id)
                                .map(histItem => {
                                    return (
                                        <React.Fragment key={histItem.pre_id}>
                                            <Grid item xs={4} style={{ padding: '5px' }}>
                                                <span>{histItem.pre_date}</span>
                                            </Grid>
                                            <Grid item xs={8} style={{ padding: '5px' }}>
                                                <span>{histItem.pre_detail}</span>
                                            </Grid>
                                        </React.Fragment>
                                    );
                                })}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

DetailedHistory.propTypes = {
    detailedHistory: PropTypes.array,
    record: PropTypes.object,
    loadDetailedHistory: PropTypes.func,
};
export default DetailedHistory;
