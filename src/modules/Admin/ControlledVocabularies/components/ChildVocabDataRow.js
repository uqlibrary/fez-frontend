import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import * as actions from 'actions/viewControlledVocab';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Tooltip from '@mui/material/Tooltip';
import locale from 'locale/components';

import { ControlledVocabulariesActionContext } from '../ControlledVocabularyContext';
import { ControlledVocabulariesStateContext } from '../ControlledVocabularyContext';

const txt = locale.components.controlledVocabulary;

export const ChildVocabDataRow = ({ row, parentId, rootId }) => {
    const { onAdminEditActionClick } = useContext(ControlledVocabulariesActionContext);
    const state = useContext(ControlledVocabulariesStateContext);

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
                    <Grid md={1} data-testid={`child-row-id-${row.cvo_id}`}>
                        {row.cvo_id}
                    </Grid>
                    <Grid md={3} data-testid={`child-row-title-${row.cvo_id}`}>
                        <Typography
                            id={`child-row-title-link-${row.cvo_id}`}
                            style={{ color: '#3872a8', cursor: 'pointer' }}
                            variant="body2"
                            onClick={() => {
                                replaceChildVocabTable(row.cvo_id);
                            }}
                            data-testid={`child-row-title-link-${row.cvo_id}`}
                        >
                            {row.cvo_title}
                            {row.cvo_hide === 1 && (
                                <Tooltip title={txt.admin.tooltip.hidden}>
                                    <VisibilityOffIcon fontSize="small" sx={{ paddingLeft: 1 }} />
                                </Tooltip>
                            )}
                        </Typography>
                    </Grid>
                    <Grid md={3} data-testid={`child-row-desc-${row.cvo_id}`}>
                        {row.cvo_desc}
                    </Grid>
                    <Grid md={1} data-testid={`child-row-order-${row.cvo_id}`}>
                        {row.cvo_order}
                    </Grid>
                    <Grid
                        md={2}
                        data-testid={`child-row-image-${row.cvo_id}`}
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        {row.cvo_image_filename}
                    </Grid>
                    <Grid
                        md={1}
                        data-testid={`child-row-eid-${row.cvo_id}`}
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        {row.cvo_external_id}
                    </Grid>
                    <Grid md={1} data-testid={`child-row-action-${row.cvo_id}`}>
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
    rootId: PropTypes.number,
};
export default ChildVocabDataRow;
