import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Grid from '@mui/material/Grid';
import locale from 'locale/components';

import * as actions from 'actions';

import ChildVocabTable from './ChildVocabTable';
import {
    ControlledVocabulariesActionContext,
    ControlledVocabulariesStateContext,
} from '../ControlledVocabularyContext';

export const VocabDataRow = ({ row }) => {
    const dispatch = useDispatch();
    const { onAdminEditActionClick } = useContext(ControlledVocabulariesActionContext);
    const state = useContext(ControlledVocabulariesStateContext);

    const txt = locale.components.controlledVocabulary;
    const vocabOpened = useSelector(state => state.get('viewVocabReducer').vocabOpened);

    const open = vocabOpened.indexOf(row.cvo_id) > -1;
    const triggerChildren = openState => {
        dispatch(actions.setOpenedVocab({ id: row.cvo_id, open: openState }));
    };

    return (
        <Grid
            container
            key={row.cvo_id}
            data-testid={`row-em-${row.cvo_id}`}
            sx={{ boxSizing: 'border-box', boxShadow: '0 -1px 0 #eaeaea', padding: '15px 0px 0px' }}
        >
            <React.Fragment key={row.cvo_id}>
                <Box
                    id={`portal-edit-${row.cvo_id}`}
                    data-testid={`portal-edit-${row.cvo_id}`}
                    sx={{ width: '100%' }}
                />
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
                        <Grid item xs={12} sm={1} md={1}>
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
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                            <Box display={'flex'}>
                                {row.cvo_title}
                                {row.cvo_hide === 1 && (
                                    <Tooltip title={txt.admin.tooltip.hidden}>
                                        <VisibilityOffIcon fontSize="small" sx={{ paddingLeft: 1 }} />
                                    </Tooltip>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={2} md={1}>
                            {row.cvo_external_id}
                        </Grid>
                        <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
                            <IconButton
                                id={`admin-edit-button-${row.cvo_id}`}
                                data-analyticsid={`admin-edit-button-${row.cvo_id}`}
                                data-testid={`admin-edit-button-${row.cvo_id}`}
                                aria-label="Edit"
                                onClick={() => onAdminEditActionClick({ row, parentId: 0, rootVocabId: 0 })}
                                size="large"
                                disabled={state.isOpen}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Box>
                )}
                {!!open && state.cvo_id !== row.cvo_id && (
                    <Grid container>
                        <Grid item xs={12}>
                            <ChildVocabTable parentRow={row} />
                        </Grid>
                    </Grid>
                )}
            </React.Fragment>
        </Grid>
    );
};
VocabDataRow.propTypes = {
    row: PropTypes.object,
};
export default VocabDataRow;
