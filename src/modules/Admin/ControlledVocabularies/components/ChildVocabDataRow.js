import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

import Grid from '@mui/material/GridLegacy';
import { useDispatch } from 'react-redux';
import * as actions from 'actions/viewControlledVocab';

import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Tooltip from '@mui/material/Tooltip';
import locale from 'locale/components';

import { ControlledVocabulariesActionContext } from '../ControlledVocabularyContext';
import { ControlledVocabulariesStateContext } from '../ControlledVocabularyContext';

const txt = locale.components.controlledVocabulary;

export const ChildVocabDataRow = ({ row, parentId, rootId, locked }) => {
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
            <Box id={`portal-edit-${row.cvo_id}`} data-testid={`portal-edit-${row.cvo_id}`} sx={{ width: '100%' }} />
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
                    <Grid item xs={12} sm={1} data-testid={`child-row-id-${row.cvo_id}`}>
                        {row.cvo_id}
                    </Grid>
                    <Grid item xs={12} sm={locked ? 5 : 4} data-testid={`child-row-title-${row.cvo_id}`}>
                        <Link
                            id={`child-row-title-link-${row.cvo_id}`}
                            component="button"
                            variant="body2"
                            align="left"
                            onClick={() => {
                                replaceChildVocabTable(row.cvo_id);
                            }}
                            data-testid={`child-row-title-link-${row.cvo_id}`}
                            sx={{ cursor: 'pointer' }}
                        >
                            {row.cvo_title}
                            {row.cvo_hide === 1 && (
                                <Tooltip title={txt.admin.tooltip.hidden} data-testid={`row-hidden-icon-${row.cvo_id}`}>
                                    <VisibilityOffIcon fontSize="small" sx={{ paddingLeft: 1 }} />
                                </Tooltip>
                            )}
                        </Link>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={5}
                        data-testid={`child-row-desc-${row.cvo_id}`}
                        sx={{ wordBreak: 'break-word' }}
                    >
                        {row.cvo_desc}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={1}
                        data-testid={`child-row-eid-${row.cvo_id}`}
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        {row.cvo_external_id}
                    </Grid>
                    {!locked && (
                        <Grid item xs={12} sm={1} data-testid={`child-row-action-${row.cvo_id}`}>
                            <IconButton
                                id={`admin-edit-button-${row.cvo_id}`}
                                data-analyticsid={`admin-edit-button-${row.cvo_id}`}
                                data-testid={`admin-edit-button-${row.cvo_id}`}
                                aria-label="Edit"
                                onClick={() => onAdminEditActionClick({ row, parentId, rootVocabId: rootId })}
                                size="large"
                                disabled={state.isOpen}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </Grid>
                    )}
                </Box>
            )}
        </Grid>
    );
};
ChildVocabDataRow.propTypes = {
    row: PropTypes.object,
    parentId: PropTypes.number.isRequired,
    rootId: PropTypes.number,
    locked: PropTypes.bool,
};
export default ChildVocabDataRow;
