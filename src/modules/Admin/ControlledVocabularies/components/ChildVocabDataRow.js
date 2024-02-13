import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Tooltip from '@mui/material/Tooltip';

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
            sx={{ width: '100%', boxSizing: 'border-box', boxShadow: '0 -1px 0 #eaeaea', padding: '15px 0px 0px' }}
        >
            <Box id={`portal-edit-${row.cvo_id}`} data-testid={`portal-edit-${row.cvo_id}`} />
            {state.cvo_id !== row.cvo_id && (
                <Box
                    sx={{
                        ...(row.cvo_hide === 1 ? { fontStyle: 'italic' } : {}),
                    }}
                    display={'flex'}
                    alignItems={'center'}
                    width={'100%'}
                    paddingBlockEnd={'10px'}
                >
                    <Grid item md={1}>
                        {row.cvo_id}
                    </Grid>
                    <Grid item md={3}>
                        <Typography variant="body2">
                            <Link
                                to={`?id=${row.cvo_id}`}
                                id={`child-vocab-title-${row.cvo_id}`}
                                data-testid={`child-vocab-title-${row.cvo_id}`}
                            >
                                {row.cvo_title}
                                {row.cvo_hide === 1 && (
                                    <Tooltip title="This vocabulary is hidden">
                                        <VisibilityOffIcon fontSize="small" sx={{ paddingLeft: 1 }} />
                                    </Tooltip>
                                )}
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        {row.cvo_desc}
                    </Grid>
                    <Grid item md={1}>
                        {row.cvo_order}
                    </Grid>
                    <Grid item md={2}>
                        {row.cvo_image_filename}
                    </Grid>
                    <Grid item md={1}>
                        {row.cvo_external_id}
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
                </Box>
            )}
        </Grid>
    );
};
ChildVocabDataRow.propTypes = {
    row: PropTypes.object,
    parentId: PropTypes.number.isRequired,
};
export default ChildVocabDataRow;
