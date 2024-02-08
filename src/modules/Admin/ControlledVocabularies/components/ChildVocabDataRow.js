import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';

import { ControlledVocabulariesActionContext } from '../ControlledVocabularyContext';
import { ControlledVocabulariesStateContext } from '../ControlledVocabularyContext';

export const ChildVocabDataRow = ({ row, parentId }) => {
    const { onAdminEditActionClick } = useContext(ControlledVocabulariesActionContext);
    const state = useContext(ControlledVocabulariesStateContext);

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
                                {row.cvo_title}
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
                        <IconButton
                            id={`admin-edit-button-${row.cvo_id}`}
                            data-analyticsid={`admin-edit-button-${row.cvo_id}`}
                            data-testid={`admin-edit-button-${row.cvo_id}`}
                            aria-label="Edit"
                            onClick={() => onAdminEditActionClick({ row, parentId })}
                            size="large"
                            disabled={state.isOpen}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};
ChildVocabDataRow.propTypes = {
    row: PropTypes.object,
    parentId: PropTypes.number.isRequired,
};
export default ChildVocabDataRow;
