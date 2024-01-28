import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Grid from '@mui/material/Grid';
import ChildVocabTable from './ChildVocabTable';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from 'actions';

export const VocabDataRow = ({ row }) => {
    const dispatch = useDispatch();

    const vocabOpened = useSelector(state => state.get('viewVocabReducer').vocabOpened);

    const open = vocabOpened.indexOf(row.cvo_id) > -1;
    const triggerChildren = openState => {
        // alert('here');
        // dispatch(actions.clearCCCollectionsList());
        // console.log('openState=', openState);
        // console.log('dispatch=', dispatch, 'actions=', typeof actions.setOpenedVocab);
        dispatch(actions.setOpenedVocab({ id: row.cvo_id, open: openState }));
        // if (openState) {
        //     dispatch(
        //         actions.loadChildVocabList({
        //             pid: row.cvo_id,
        //         }),
        //     );
        // }
    };

    return (
        <Grid
            container
            key={row.cvo_id}
            data-testid={`row-${row.cvo_id}`}
            sx={{ boxSizing: 'border-box', boxShadow: '0 -1px 0 #eaeaea', padding: '15px 0px 0px' }}
        >
            <React.Fragment key={row.cvo_id}>
                <Grid container sx={{ paddingBottom: '10px' }}>
                    <Grid item xs={1} sm={1} md={1}>
                        <Box sx={{ float: 'left', width: '24px' }}>
                            <IconButton
                                sx={{ paddingTop: '5px' }}
                                aria-label="expand row"
                                size="small"
                                id={`expand-row-${row.cvo_id}`}
                                data-analyticsid={`expand-row-${row.cvo_id}`}
                                data-testid={`expand-row-${row.cvo_id}`}
                                onClick={() => {
                                    triggerChildren(!open);
                                }}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item md={8} sm={6} xs={6}>
                        <Box>{row.cvo_title}</Box>
                    </Grid>
                    <Grid item md={1} xs={2} sm={2}>
                        <Box>{/* row.cvo_image_filename*/}</Box>
                    </Grid>
                    <Grid item md={1} xs={2} sm={2}>
                        <Box>{row.cvo_external_id}</Box>
                    </Grid>
                    <Grid item md={1} xs={1} sm={1}>
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
VocabDataRow.propTypes = {
    conf: PropTypes.object,
    row: PropTypes.object,
    labels: PropTypes.object,
};
export default VocabDataRow;
