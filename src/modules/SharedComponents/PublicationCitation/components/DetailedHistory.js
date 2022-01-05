import React from 'react';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};
const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        spacing: 0,
        direction: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    paper: {
        position: 'absolute',
        width: 800,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export const DetailedHistory = () => {
    const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
    const classes = useStyles();

    return (
        <React.Fragment>
            <button
                onClick={() => {
                    setDetailsModalOpen(true);
                }}
            >
                Detailed History
            </button>

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                onClose={() => {
                    setDetailsModalOpen(false);
                }}
                open={detailsModalOpen}
            >
                <div style={modalStyle} className={classes.paper}>
                    <Grid container>
                        {/* Header Elements */}
                        <Grid item xs={12}>
                            <Typography
                                variant="h5"
                                id="Author-Information-Details"
                                data-testid="Author-Information-Details"
                            >
                                <span>Detailed History</span>
                            </Typography>
                        </Grid>
                        <Grid item xs={4} style={{ color: '#fff', backgroundColor: '#51247A', paddingLeft: '5px' }}>
                            <span>Date</span>
                        </Grid>
                        <Grid item xs={8} style={{ color: '#fff', backgroundColor: '#51247A', paddingLeft: '5px' }}>
                            <span>Event</span>
                        </Grid>
                        {/* Data Elements */}
                        <Grid item xs={4}>
                            <span>Thu, 30 Dec 2021, 19:41:33 EST</span>
                        </Grid>
                        <Grid item xs={8}>
                            <span>Merged metadata in external source orcid (Author Id:76019)</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span>Thu, 30 Dec 2021, 19:38:01 EST</span>
                        </Grid>
                        <Grid item xs={8}>
                            <span>Merged metadata from external source scopus</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span>Thu, 30 Dec 2021, 19:41:33 EST</span>
                        </Grid>
                        <Grid item xs={8}>
                            <span>Merged metadata in external source orcid (Author Id:76019)</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span>Thu, 30 Dec 2021, 19:41:33 EST</span>
                        </Grid>
                        <Grid item xs={8}>
                            <span>Merged metadata from external source scopus</span>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default DetailedHistory;
