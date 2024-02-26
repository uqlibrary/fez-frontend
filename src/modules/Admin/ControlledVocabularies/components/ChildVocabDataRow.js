import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import * as actions from 'actions';

export const ChildVocabDataRow = ({ row, rootId }) => {
    const dispatch = useDispatch();
    const replaceChildVocabTable = parentId => {
        dispatch(
            actions.loadChildVocabList({
                pid: parentId,
                rootId,
            }),
        );
    };
    return (
        <Grid
            container
            key={row.cvo_id}
            data-testid={`child-row-em-${row.cvo_id}`}
            sx={{ boxSizing: 'border-box', boxShadow: '0 -1px 0 #eaeaea', padding: '15px 0px 0px' }}
        >
            <React.Fragment key={row.cvo_id}>
                <Grid container sx={{ paddingBottom: '10px' }}>
                    <Grid item md={1} data-testid={`child-row-id-${row.cvo_id}`}>
                        <Box>{row.cvo_id}</Box>
                    </Grid>
                    <Grid item md={3} data-testid={`child-row-title-${row.cvo_id}`}>
                        <Box
                            id={`child-row-title-link-${row.cvo_id}`}
                            style={{ color: '#3872a8', cursor: 'pointer' }}
                            onClick={() => {
                                replaceChildVocabTable(row.cvo_id);
                            }}
                            data-testid={`child-row-title-link-${row.cvo_id}`}
                        >
                            {row.cvo_title}
                        </Box>
                        <Typography variant="body2">
                            {/* <Link
                                to="#"
                                id={`child-row-title-link-${row.cvo_id}`}
                                onClick={() => {
                                    replaceChildVocabTable(row.cvo_id);
                                }}
                                data-testid={`child-row-title-link-${row.cvo_id}`}
                            >
                                {row.cvo_title}
                            </Link> */}
                        </Typography>
                    </Grid>
                    <Grid item md={3} data-testid={`child-row-desc-${row.cvo_id}`}>
                        <Box>{row.cvo_desc}</Box>
                    </Grid>
                    <Grid item md={1} data-testid={`child-row-order-${row.cvo_id}`}>
                        <Box>{row.cvo_order}</Box>
                    </Grid>
                    <Grid item md={2} data-testid={`child-row-image-${row.cvo_id}`}>
                        <Box>{row.cvo_image_filename}</Box>
                    </Grid>
                    <Grid item md={1} data-testid={`child-row-eid-${row.cvo_id}`}>
                        <Box>{row.cvo_external_id}</Box>
                    </Grid>
                    <Grid item md={1} data-testid={`child-row-action-${row.cvo_id}`}>
                        {''}
                    </Grid>
                </Grid>
            </React.Fragment>
        </Grid>
    );
};
ChildVocabDataRow.propTypes = {
    row: PropTypes.object,
    rootId: PropTypes.number,
};
export default ChildVocabDataRow;
