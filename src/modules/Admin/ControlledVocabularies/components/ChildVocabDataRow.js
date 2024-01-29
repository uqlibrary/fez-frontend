import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Grid from '@mui/material/Grid';
import ChildVocabTable from './ChildVocabTable';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import * as actions from 'actions';

export const ChildVocabDataRow = ({ row }) => {
    // const dispatch = useDispatch();

    // const vocabOpened = useSelector(state => state.get('viewVocabReducer').vocabOpened);
    // console.log('row=', row);
    const open = false;
    // const open = vocabOpened.indexOf(row.cvo_id) > -1;
    // const triggerChildren = openState => {
    //     // alert('here');
    //     // dispatch(actions.clearCCCollectionsList());
    //     console.log('openState=', openState);
    //     console.log('dispatch=', dispatch, 'actions=', typeof actions.setOpenedVocab);
    //     dispatch(actions.setOpenedVocab({ id: row.cvo_id, open: openState }));
    //     // if (openState) {
    //     //     dispatch(
    //     //         actions.loadChildVocabList({
    //     //             pid: row.cvo_id,
    //     //         }),
    //     //     );
    //     // }
    // };

    return (
        <Grid
            container
            key={row.cvo_id}
            data-testid={`row-${row.cvo_id}`}
            sx={{ boxSizing: 'border-box', boxShadow: '0 -1px 0 #eaeaea', padding: '15px 0px 0px' }}
        >
            <React.Fragment key={row.cvo_id}>
                <Grid container sx={{ paddingBottom: '10px' }}>
                    <Grid item md={1}>
                        <Box>{row.cvo_id}</Box>
                    </Grid>
                    <Grid item md={3}>
                        <Typography variant="body2">
                            <Link
                                to={`?id=${row.cvo_id}`}
                                id={`child-vocab-title-${row.cvo_id}`}
                                data-testid={`child-vocab-title-${row.cvo_id}`}
                            >
                                <Box>{row.cvo_title}</Box>
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <Box>{row.cvo_desc}</Box>
                    </Grid>
                    <Grid item md={1}>
                        <Box>{row.cvo_order}</Box>
                    </Grid>
                    <Grid item md={2}>
                        <Box>{row.cvo_image_filename}</Box>
                    </Grid>
                    <Grid item md={1}>
                        <Box>{row.cvo_external_id}</Box>
                    </Grid>
                    <Grid item md={1}>
                        {''}
                    </Grid>
                </Grid>
                {!!open && (
                    <Grid container>
                        <Grid item md={12}>
                            <ChildVocabTable parentRow={row} />
                        </Grid>
                    </Grid>
                )}
            </React.Fragment>
        </Grid>
    );
};
ChildVocabDataRow.propTypes = {
    conf: PropTypes.object,
    row: PropTypes.object,
    labels: PropTypes.object,
};
export default ChildVocabDataRow;
