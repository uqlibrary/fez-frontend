import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import AdminActions from './AdminActions';
import { ControlledVocabulariesActionContext } from '../ControlledVocabularyContext';
import { ControlledVocabulariesStateContext } from '../ControlledVocabularyContext';

// import { useSelector, useDispatch } from 'react-redux';
// import * as actions from 'actions';

export const ChildVocabDataRow = ({ row }) => {
    const { onAdminEditActionClick } = useContext(ControlledVocabulariesActionContext);
    const state = useContext(ControlledVocabulariesStateContext);

    // const dispatch = useDispatch();

    // const vocabOpened = useSelector(state => state.get('viewVocabReducer').vocabOpened);

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
            <Box id={`portal-edit-${row.cvo_id}`} sx={{ width: '100%' }} />
            {state.cvo_id !== row.cvo_id && (
                <Grid container sx={{ paddingBottom: '10px' }}>
                    <Grid item md={8}>
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
                    <Grid item md={2}>
                        <Box>{row.cvo_image_filename}</Box>
                    </Grid>
                    <Grid item md={1}>
                        <Box>{row.cvo_external_id}</Box>
                    </Grid>
                    <Grid item md={1}>
                        <AdminActions
                            disabled={state.isOpen}
                            vocab={row.cvo_id}
                            id={`admin-actions-${row.cvo_id}`}
                            data-testid={`admin-actions-${row.cvo_id}`}
                            adminActions={[
                                {
                                    label: 'Edit vocabulary',
                                    options: null,
                                    onClick: () => onAdminEditActionClick(row),
                                },
                            ]}
                        />
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};
ChildVocabDataRow.propTypes = {
    conf: PropTypes.object,
    row: PropTypes.object,
    labels: PropTypes.object,
};
export default ChildVocabDataRow;
